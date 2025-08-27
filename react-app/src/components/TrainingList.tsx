import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Alert,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import { Training } from '../types/training';
import { format } from 'date-fns';

interface TrainingListProps {
  trainings: Training[];
  isTrainer: boolean;
  loading?: boolean;
  onRefresh?: () => Promise<void>;
  onDelete?: (trainingId: string) => Promise<void>;
}

const TrainingList: React.FC<TrainingListProps> = ({
  trainings,
  isTrainer,
  loading = false,
  onDelete
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(null);
  const [deleting, setDeleting] = useState(false);
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Loading trainings...</Typography>
      </Box>
    );
  }

  if (trainings.length === 0) {
    return (
      <Alert 
        severity="info" 
        sx={{ 
          borderRadius: 2,
          '& .MuiAlert-message': {
            fontSize: '1rem'
          }
        }}
      >
        {isTrainer 
          ? '📅 No training sessions have been scheduled yet. Use the form above to add the first training session.'
          : '📅 No training sessions have been scheduled for you yet. Please contact your trainer.'
        }
      </Alert>
    );
  }

  // Group trainings by player name
  const groupedTrainings = trainings.reduce((groups, training) => {
    const playerName = training.playerName;
    if (!groups[playerName]) {
      groups[playerName] = [];
    }
    groups[playerName].push(training);
    return groups;
  }, {} as Record<string, Training[]>);

  const formatShortDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  const handleDeleteClick = (training: Training) => {
    setTrainingToDelete(training);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (trainingToDelete && onDelete) {
      try {
        setDeleting(true);
        await onDelete(trainingToDelete.id);
        setDeleteDialogOpen(false);
        setTrainingToDelete(null);
      } catch (error) {
        console.error('Error deleting training:', error);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTrainingToDelete(null);
  };

  return (
    <Box>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 3
        }}
      >
        🗓️ {isTrainer ? 'All Training Sessions' : 'Your Training Sessions'}
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(groupedTrainings).map(([playerName, playerTrainings]) => (
          <Card 
            key={playerName} 
            variant="outlined"
            sx={{
              borderRadius: 2,
              boxShadow: 1,
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <CardHeader
              avatar={
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main',
                    width: 40,
                    height: 40
                  }}
                >
                  👤
                </Avatar>
              }
              title={
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  {playerName}
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {playerTrainings.length} training session{playerTrainings.length !== 1 ? 's' : ''}
                </Typography>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2,
                justifyContent: 'flex-start'
              }}>
                {playerTrainings.map((training) => (
                  <Box 
                    key={training.id}
                    sx={{ 
                      backgroundColor: 'primary.light',
                      borderRadius: 1,
                      p: 1.5,
                      color: 'primary.contrastText',
                      border: '1px solid',
                      borderColor: 'primary.main',
                      minWidth: 180,
                      flex: '0 0 auto',
                      position: 'relative'
                    }}
                  >
                    {isTrainer && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(training)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          color: '#ffffff',
                          backgroundColor: 'rgba(0, 0, 0, 0.4)',
                          '&:hover': {
                            backgroundColor: 'error.main',
                            color: '#ffffff',
                            transform: 'scale(1.1)'
                          },
                          width: 26,
                          height: 26,
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <DeleteOutline sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 'bold', pr: isTrainer ? 3 : 0 }}>
                      Date: {formatShortDate(training.trainingDay)}
                    </Typography>
                    <Typography variant="body2">
                      Time: {formatTime(training.trainingDay)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          🗑️ Delete Training Session
        </DialogTitle>
        <DialogContent>
          {trainingToDelete && (
            <Typography>
              Are you sure you want to delete the training session for <strong>{trainingToDelete.playerName}</strong> scheduled on{' '}
              <strong>{formatShortDate(trainingToDelete.trainingDay)}</strong> at{' '}
              <strong>{formatTime(trainingToDelete.trainingDay)}</strong>?
            </Typography>
          )}
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel} 
            disabled={deleting}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            disabled={deleting}
            color="error"
            variant="contained"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainingList;
