import { Training, TrainingFormData } from '../types/training';
import { User } from '../types/user';
import { parseCsvContent } from '../utils/csvHelpers';

// Load training data from backend API
let trainingsData: Training[] = [];
let isInitialized = false;

const loadTrainingsFromCsv = async (): Promise<Training[]> => {
  try {
    if (!isInitialized) {
      // Fetch trainings from backend API
      try {
        const response = await fetch('/api/trainings');
        if (response.ok) {
          const trainings = await response.json() as Training[];
          if (trainings && trainings.length >= 0) {
            trainingsData = trainings;
            isInitialized = true;
            console.log('Loaded trainings from backend API');
            return [...trainingsData];
          }
        } else {
          console.warn('Backend API not available, using fallback');
        }
      } catch (fetchError) {
        console.warn('Could not fetch from backend API:', fetchError);
      }

      // Fallback to CSV file if backend is not available
      try {
        const response = await fetch('/data/trainings.csv');
        if (response.ok) {
          const csvContent = await response.text();
          const parseResult = parseCsvContent<Training>(csvContent, ['id', 'playerId', 'playerName', 'trainingDay', 'createdBy', 'createdAt']);
          
          if (parseResult.success && parseResult.data.length >= 0) {
            trainingsData = parseResult.data;
            isInitialized = true;
            return [...trainingsData];
          }
        }
      } catch (csvError) {
        console.warn('Could not fetch CSV file:', csvError);
      }

      // No default data - start with empty array
      trainingsData = [];
      isInitialized = true;
      console.log('No CSV data found, starting with empty training list');
    }
    return [...trainingsData];
  } catch (error) {
    console.error('Error loading trainings:', error);
    throw new Error('Failed to load training data');
  }
};

// Save trainings to backend API
const saveTrainingsToCsv = async (trainings: Training[]): Promise<void> => {
  try {
    // Update in-memory data
    trainingsData = trainings;
    
    // Send data to backend API to save to CSV
    const response = await fetch('/api/trainings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trainingsData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save trainings: ${response.statusText}`);
    }
    
    console.log('Trainings successfully saved to CSV file via backend');
  } catch (error) {
    console.error('Error saving trainings to backend:', error);
    throw new Error('Failed to save training data to CSV file');
  }
};

// Get current trainings from CSV data
const getCurrentTrainings = async (): Promise<Training[]> => {
  return await loadTrainingsFromCsv();
};

export const trainingService = {
  // Get all trainings (trainer only)
  getAllTrainings: async (): Promise<Training[]> => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        try {
          const trainings = await getCurrentTrainings();
          resolve([...trainings]);
        } catch (error) {
          console.error('Error getting trainings:', error);
          resolve([]);
        }
      }, 300);
    });
  },

  // Get trainings for a specific user
  getUserTrainings: async (userId: string): Promise<Training[]> => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        try {
          const trainings = await getCurrentTrainings();
          const userTrainings = trainings.filter(training => training.playerId === userId);
          resolve([...userTrainings]);
        } catch (error) {
          console.error('Error getting user trainings:', error);
          resolve([]);
        }
      }, 300);
    });
  },

  // Create new training (trainer only)
  createTraining: async (trainingFormData: TrainingFormData, user: User, playerName: string): Promise<Training> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const trainings = await getCurrentTrainings();
      
      // Generate new ID
      const maxId = trainings.length > 0 ? Math.max(...trainings.map(t => parseInt(t.id))) : 0;
      const newId = (maxId + 1).toString();

      const newTraining: Training = {
        id: newId,
        playerId: trainingFormData.playerId,
        playerName: playerName,
        trainingDay: trainingFormData.trainingDay,
        createdBy: user.id,
        createdAt: new Date().toISOString()
      };

      const updatedTrainings = [...trainings, newTraining];
      await saveTrainingsToCsv(updatedTrainings);
      return newTraining;
    } catch (error) {
      console.error('Error creating training:', error);
      throw error;
    }
  },

  // Update training (trainer only)
  updateTraining: async (id: string, trainingFormData: TrainingFormData, playerName: string): Promise<Training> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const trainings = await getCurrentTrainings();
      const trainingIndex = trainings.findIndex(t => t.id === id);
      
      if (trainingIndex === -1) {
        throw new Error('Training not found');
      }

      const updatedTraining: Training = {
        ...trainings[trainingIndex],
        playerId: trainingFormData.playerId,
        playerName: playerName,
        trainingDay: trainingFormData.trainingDay
      };

      const updatedTrainings = [...trainings];
      updatedTrainings[trainingIndex] = updatedTraining;
      await saveTrainingsToCsv(updatedTrainings);
      return updatedTraining;
    } catch (error) {
      console.error('Error updating training:', error);
      throw error;
    }
  },

  // Delete training (trainer only)
  deleteTraining: async (id: string): Promise<void> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const trainings = await getCurrentTrainings();
      const trainingIndex = trainings.findIndex(t => t.id === id);
      
      if (trainingIndex === -1) {
        throw new Error('Training not found');
      }

      const updatedTrainings = trainings.filter(t => t.id !== id);
      await saveTrainingsToCsv(updatedTrainings);
    } catch (error) {
      console.error('Error deleting training:', error);
      throw error;
    }
  },

  // Clear all training data (for testing)
  clearAllTrainings: async (): Promise<void> => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        try {
          await saveTrainingsToCsv([]);
          resolve();
        } catch (error) {
          console.error('Error clearing trainings:', error);
          resolve();
        }
      }, 200);
    });
  }
};
