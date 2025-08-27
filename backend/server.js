const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Paths
const REACT_APP_DIR = path.join(__dirname, '../react-app');
const CSV_FILE_PATH = path.join(REACT_APP_DIR, 'public/data/users.csv');
const PUBLIC_CSV_PATH = path.join(REACT_APP_DIR, 'public/data/users.csv');
const TRAINING_CSV_FILE_PATH = path.join(REACT_APP_DIR, 'public/data/trainings.csv');
const TRAINING_PUBLIC_CSV_PATH = path.join(REACT_APP_DIR, 'public/data/trainings.csv');

// Ensure directories exist
const ensureDirectories = async () => {
  try {
    await fs.ensureDir(path.dirname(CSV_FILE_PATH));
    await fs.ensureDir(path.dirname(PUBLIC_CSV_PATH));
  } catch (error) {
    console.error('Error ensuring directories:', error);
  }
};

// Read users from CSV file
const readUsersFromCsv = async () => {
  try {
    const users = [];
    
  // Check if CSV files exist, if not create empty ones
  if (!fs.existsSync(CSV_FILE_PATH)) {
    console.log('CSV file does not exist, creating empty CSV file');
    await writeUsersToCsv([]);
  }    return new Promise((resolve, reject) => {
      fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv())
        .on('data', (row) => {
          // Convert string booleans to actual booleans
          const user = {
            ...row,
            isTrainer: row.isTrainer === 'true' || row.role === 'Trainer'
          };
          users.push(user);
        })
        .on('end', () => {
          resolve(users);
        })
        .on('error', (error) => {
          console.error('Error reading CSV:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error('Error in readUsersFromCsv:', error);
    throw error;
  }
};

// Write users to CSV file
const writeUsersToCsv = async (users) => {
  try {
    const csvWriter = createCsvWriter({
      path: CSV_FILE_PATH,
      header: [
        { id: 'id', title: 'id' },
        { id: 'name', title: 'name' },
        { id: 'password', title: 'password' },
        { id: 'surname', title: 'surname' },
        { id: 'email', title: 'email' },
        { id: 'category', title: 'category' },
        { id: 'role', title: 'role' },
        { id: 'isTrainer', title: 'isTrainer' }
      ]
    });

    // Ensure isTrainer is properly set based on role
    const processedUsers = users.map(user => ({
      ...user,
      isTrainer: user.role === 'Trainer'
    }));

    await csvWriter.writeRecords(processedUsers);
    
    // Also update the public CSV file for consistency
    const publicCsvWriter = createCsvWriter({
      path: PUBLIC_CSV_PATH,
      header: [
        { id: 'id', title: 'id' },
        { id: 'name', title: 'name' },
        { id: 'password', title: 'password' },
        { id: 'surname', title: 'surname' },
        { id: 'email', title: 'email' },
        { id: 'category', title: 'category' },
        { id: 'role', title: 'role' },
        { id: 'isTrainer', title: 'isTrainer' }
      ]
    });
    
    await publicCsvWriter.writeRecords(processedUsers);
    
  } catch (error) {
    console.error('Error writing CSV:', error);
    throw error;
  }
};

// Read trainings from CSV file
const readTrainingsFromCsv = async () => {
  try {
    const trainings = [];
    
    // Check if CSV files exist, if not create empty ones
    if (!fs.existsSync(TRAINING_CSV_FILE_PATH)) {
      console.log('Training CSV file does not exist, creating empty CSV file');
      await writeTrainingsToCsv([]);
    }
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(TRAINING_CSV_FILE_PATH)
        .pipe(csv())
        .on('data', (row) => {
          trainings.push(row);
        })
        .on('end', () => {
          resolve(trainings);
        })
        .on('error', (error) => {
          console.error('Error reading training CSV:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error('Error in readTrainingsFromCsv:', error);
    throw error;
  }
};

// Write trainings to CSV file
const writeTrainingsToCsv = async (trainings) => {
  try {
    const csvWriter = createCsvWriter({
      path: TRAINING_CSV_FILE_PATH,
      header: [
        { id: 'id', title: 'id' },
        { id: 'playerId', title: 'playerId' },
        { id: 'playerName', title: 'playerName' },
        { id: 'trainingDay', title: 'trainingDay' },
        { id: 'createdBy', title: 'createdBy' },
        { id: 'createdAt', title: 'createdAt' }
      ]
    });

    await csvWriter.writeRecords(trainings);
    
    // Also update the public CSV file for consistency
    const publicCsvWriter = createCsvWriter({
      path: TRAINING_PUBLIC_CSV_PATH,
      header: [
        { id: 'id', title: 'id' },
        { id: 'playerId', title: 'playerId' },
        { id: 'playerName', title: 'playerName' },
        { id: 'trainingDay', title: 'trainingDay' },
        { id: 'createdBy', title: 'createdBy' },
        { id: 'createdAt', title: 'createdAt' }
      ]
    });
    
    await publicCsvWriter.writeRecords(trainings);
    
  } catch (error) {
    console.error('Error writing training CSV:', error);
    throw error;
  }
};

// API Routes

// GET /api/users - Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await readUsersFromCsv();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to read users from CSV file' });
  }
});

// POST /api/users - Save all users (overwrite CSV)
app.post('/api/users', async (req, res) => {
  try {
    const users = req.body;
    
    if (!Array.isArray(users)) {
      return res.status(400).json({ error: 'Request body must be an array of users' });
    }
    
    await writeUsersToCsv(users);
    res.json({ message: `Successfully saved ${users.length} users to CSV file` });
  } catch (error) {
    console.error('Error saving users:', error);
    res.status(500).json({ error: 'Failed to save users to CSV file' });
  }
});

// GET /api/users/:id - Get specific user
app.get('/api/users/:id', async (req, res) => {
  try {
    const users = await readUsersFromCsv();
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Training API Routes

// GET /api/trainings - Get all trainings
app.get('/api/trainings', async (req, res) => {
  try {
    const trainings = await readTrainingsFromCsv();
    res.json(trainings);
  } catch (error) {
    console.error('Error getting trainings:', error);
    res.status(500).json({ error: 'Failed to read trainings from CSV file' });
  }
});

// POST /api/trainings - Save all trainings (overwrite CSV)
app.post('/api/trainings', async (req, res) => {
  try {
    const trainings = req.body;
    
    if (!Array.isArray(trainings)) {
      return res.status(400).json({ error: 'Request body must be an array of trainings' });
    }
    
    await writeTrainingsToCsv(trainings);
    res.json({ message: `Successfully saved ${trainings.length} trainings to CSV file` });
  } catch (error) {
    console.error('Error saving trainings:', error);
    res.status(500).json({ error: 'Failed to save trainings to CSV file' });
  }
});

// GET /api/trainings/:id - Get specific training
app.get('/api/trainings/:id', async (req, res) => {
  try {
    const trainings = await readTrainingsFromCsv();
    const training = trainings.find(t => t.id === req.params.id);
    
    if (!training) {
      return res.status(404).json({ error: 'Training not found' });
    }
    
    res.json(training);
  } catch (error) {
    console.error('Error getting training:', error);
    res.status(500).json({ error: 'Failed to get training' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    csvPath: CSV_FILE_PATH,
    publicCsvPath: PUBLIC_CSV_PATH
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const startServer = async () => {
  try {
    await ensureDirectories();
    
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(`📁 CSV file path: ${CSV_FILE_PATH}`);
      console.log(`📁 Public CSV path: ${PUBLIC_CSV_PATH}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
