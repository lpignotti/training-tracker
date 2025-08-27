import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await userService.getUserByEmail(email);
      
      if (user && user.password === password) {
        login(user);
        
        // Redirect based on user type
        if (user.isTrainer) {
          navigate('/'); // Trainer goes to homepage
        } else {
          navigate('/training'); // Regular user goes directly to training
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        py={4}
      >
        <Paper
          elevation={4}
          sx={{
            padding: 4,
            width: '100%',
            borderRadius: 2
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
            >
              Please sign in to your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box mb={3}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: 2,
                mb: 3
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
