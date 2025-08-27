import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TrainingFormData } from '../types/training';
import { User } from '../types/user';
import { userService } from '../services/userService';

interface TrainingFormProps {
  onSubmit: (trainingData: TrainingFormData) => Promise<void>;
  isTrainer: boolean;
  loading?: boolean;
}

const TrainingForm: React.FC<TrainingFormProps> = ({
  onSubmit,
  isTrainer,
  loading = false
}) => {
  const [formData, setFormData] = useState<TrainingFormData>({
    playerId: '',
    trainingDay: ''
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Load users for the player dropdown
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const allUsers = await userService.getAllUsers();
        // Filter to only show players (not trainers)
        const playersOnly = allUsers.filter(user => user.role === 'Player');
        setUsers(playersOnly);
      } catch (err) {
        setError('Failed to load users');
        console.error('Error loading users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  // Sync selectedDate with formData.trainingDay
  useEffect(() => {
    if (formData.trainingDay && !selectedDate) {
      try {
        const date = new Date(formData.trainingDay);
        setSelectedDate(date);
      } catch (err) {
        console.warn('Invalid date in formData:', formData.trainingDay);
      }
    }
  }, [formData.trainingDay, selectedDate]);

  const handlePlayerChange = (playerId: string) => {
    setFormData(prev => ({ ...prev, playerId }));
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      trainingDay: date ? date.toISOString() : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.playerId) {
      setError('Please select a player');
      return;
    }

    if (!formData.trainingDay) {
      setError('Please select a training date and time');
      return;
    }

    try {
      setError('');
      await onSubmit(formData);
      
      // Reset form after successful submission
      setFormData({
        playerId: '',
        trainingDay: ''
      });
      setSelectedDate(null);
    } catch (err) {
      setError('Failed to save training');
      console.error('Error saving training:', err);
    }
  };

  if (loadingUsers) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card elevation={3} sx={{ borderRadius: 2 }}>
      <CardHeader
        title={isTrainer ? "📅 New Training Session" : "📅 Training Details"}
        sx={{ 
          backgroundColor: isTrainer ? 'primary.main' : 'grey.100',
          color: isTrainer ? 'white' : 'text.primary',
          '& .MuiCardHeader-title': {
            fontSize: '1.25rem',
            fontWeight: 'bold'
          }
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 1,
                  '& .MuiAlert-message': {
                    fontWeight: 'medium'
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <FormControl 
              fullWidth 
              required 
              disabled={!isTrainer}
              variant="outlined"
            >
              <InputLabel id="player-label">👤 Player</InputLabel>
              <Select
                labelId="player-label"
                value={formData.playerId}
                onChange={(e) => handlePlayerChange(e.target.value)}
                label="👤 Player"
                sx={{
                  borderRadius: 1,
                  '& .MuiSelect-select': {
                    py: 1.5
                  }
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select a player</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>👤</span>
                      <span>{user.name} - {user.surname}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="🗓️ Training date and arrival player time"
                value={selectedDate}
                onChange={handleDateChange}
                disabled={!isTrainer}
                ampm={false}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    variant: 'outlined',
                    helperText: isTrainer 
                      ? '📅 Select training date and arrival player time'
                      : '📅 Training date and time (read-only)',
                    error: !!error && !formData.trainingDay,
                    sx: {
                      borderRadius: 1,
                      '& .MuiInputBase-root': {
                        borderRadius: 1,
                      }
                    }
                  },
                  actionBar: {
                    actions: ['clear', 'today', 'accept'],
                  },
                  popper: {
                    placement: 'bottom-start',
                  },
                  calendarHeader: {
                    format: 'MMMM yyyy',
                  },
                  day: {
                    sx: {
                      fontSize: '0.875rem',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        }
                      }
                    }
                  }
                }}
                views={['year', 'month', 'day', 'hours', 'minutes']}
                format="MMM dd, yyyy, HH:mm" // e.g., "Dec 25, 2023, 14:30"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 1,
                  }
                }}
              />
            </LocalizationProvider>

            {isTrainer && (
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  mt: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderRadius: 1,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    boxShadow: 0
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                    Adding Training...
                  </>
                ) : (
                  '✨ Add Training Session'
                )}
              </Button>
            )}

            {!isTrainer && (
              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: 1,
                  backgroundColor: 'info.light',
                  '& .MuiAlert-message': {
                    fontWeight: 'medium'
                  }
                }}
              >
                📖 You are viewing training details in read-only mode. Only trainers can schedule new training sessions.
              </Alert>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default TrainingForm;
