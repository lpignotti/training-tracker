import React, { useState, useEffect } from 'react';
import { 
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Alert,
  Box,
  Divider
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { trainingService } from '../services/trainingService';
import { Training, TrainingFormData } from '../types/training';
import TrainingForm from '../components/TrainingForm';
import TrainingList from '../components/TrainingList';
import AppBreadcrumbs from '../components/AppBreadcrumbs';
import { useNavigate } from 'react-router-dom';

const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user, isTrainer } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Load trainings based on user role
  const loadTrainings = async () => {
    try {
      setLoading(true);
      setError('');

      if (!user) {
        setTrainings([]);
        return;
      }

      if (isTrainer()) {
        // Trainer sees all trainings
        const allTrainings = await trainingService.getAllTrainings();
        setTrainings(allTrainings);
      } else {
        // User sees only their own trainings
        const userTrainings = await trainingService.getUserTrainings(user.id);
        setTrainings(userTrainings);
      }
    } catch (err) {
      setError('Failed to load trainings');
      console.error('Error loading trainings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainings();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle training form submission (trainer only)
  const handleTrainingSubmit = async (trainingData: TrainingFormData) => {
    if (!user || !isTrainer()) {
      setError('Only trainers can add trainings');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Get player name for display
      const selectedUser = await userService.getUserById(trainingData.playerId);
      if (!selectedUser) {
        throw new Error('Selected player not found');
      }

      const playerName = `${selectedUser.name} - ${selectedUser.surname}`;

      // Create the training
      await trainingService.createTraining(trainingData, user, playerName);
      
      // Reload trainings
      await loadTrainings();
      
    } catch (err) {
      setError('Failed to create training');
      console.error('Error creating training:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle training deletion (trainer only)
  const handleTrainingDelete = async (trainingId: string) => {
    if (!user || !isTrainer()) {
      setError('Only trainers can delete trainings');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await trainingService.deleteTraining(trainingId);
      
      // Reload trainings
      await loadTrainings();
      
    } catch (err) {
      setError('Failed to delete training');
      console.error('Error deleting training:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Training - {user?.name} {user?.surname}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            title="Logout"
          >
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ py: 4, minHeight: 'calc(100vh - 64px)' }}>
          <AppBreadcrumbs />
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                boxShadow: 1
              }}
            >
              {error}
            </Alert>
          )}

          {/* Training Form - Only visible to Trainer users */}
          {isTrainer() && (
            <>
              <Box sx={{ mb: 4 }}>
                <TrainingForm
                  onSubmit={handleTrainingSubmit}
                  isTrainer={isTrainer()}
                  loading={loading}
                />
              </Box>

              <Divider sx={{ my: 4 }} />
            </>
          )}

          {!isTrainer() && (
            <Box sx={{ mb: 4 }}>
              <Alert 
                severity="info"
                sx={{ 
                  borderRadius: 2,
                  boxShadow: 1
                }}
              >
                📖 You are viewing your training sessions in read-only mode. Only trainers can schedule new training sessions.
              </Alert>
            </Box>
          )}

          {/* Training List - Trainer sees all, User sees only their own */}
          <TrainingList
            trainings={trainings}
            isTrainer={isTrainer()}
            loading={loading}
            onRefresh={loadTrainings}
            onDelete={handleTrainingDelete}
          />
        </Box>
      </Container>
    </>
  );
};

export default TrainingPage;
