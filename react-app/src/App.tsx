import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Homepage from './pages/Homepage';
import TrainerPage from './pages/TrainerPage';
import TrainingPage from './pages/TrainingPage';
import 'bootstrap/dist/css/bootstrap.min.css';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute requireTrainer={true}>
                    <Homepage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/trainer" 
                element={
                  <ProtectedRoute requireTrainer={true}>
                    <TrainerPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/training" 
                element={
                  <ProtectedRoute>
                    <TrainingPage />
                  </ProtectedRoute>
                } 
              />
              {/* Redirect any other routes to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
