import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import logoHome from '../images/logo_home.png';
import { 
  AdminPanelSettings, 
  School,
  Logout
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const { isTrainer, logout, user } = useAuth();

  const handleTrainerClick = () => {
    navigate('/trainer');
  };

  const handleTrainingClick = () => {
    navigate('/training');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome, {user?.name} {user?.surname}
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

      <Container maxWidth="md">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="calc(100vh - 64px)"
          textAlign="center"
          px={{ xs: 2, sm: 4 }}
        >
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
            <img 
              src={logoHome} 
              alt="AllReds Logo" 
              style={{ 
                maxWidth: '300px', 
                width: '100%', 
                height: 'auto' 
              }} 
            />
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
              maxWidth: '500px',
              width: '100%'
            }}
          >
            {/* Trainer Button - Only visible to trainers */}
            {isTrainer() && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AdminPanelSettings />}
                onClick={handleTrainerClick}
                sx={{
                  py: 2,
                  px: 3,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  minHeight: { xs: '60px', sm: '70px' },
                  flex: 1
                }}
              >
                Trainer Dashboard
              </Button>
            )}

            {/* Training Button - Visible to all users */}
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<School />}
              onClick={handleTrainingClick}
              sx={{
                py: 2,
                px: 3,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: 2,
                minHeight: { xs: '60px', sm: '70px' },
                flex: 1
              }}
            >
              Training Dashboard
            </Button>
          </Box>

          <Box mt={4}>
            <Typography variant="body2" color="text.secondary">
              Trainer access granted
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Homepage;
