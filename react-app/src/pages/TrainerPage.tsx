import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import UserManagement from '../components/UserManagement';
import AppBreadcrumbs from '../components/AppBreadcrumbs';

const TrainerPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Trainer - {user?.name} {user?.surname}
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

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <AppBreadcrumbs />
        <UserManagement />
      </Container>
    </>
  );
};

export default TrainerPage;
