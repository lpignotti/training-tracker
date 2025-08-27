import React from 'react';
import { Box, Switch, FormControlLabel, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const UserToggle: React.FC = () => {
  const { user, login } = useAuth();

  const handleToggleTrainer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isTrainer = event.target.checked;
    if (user) {
      login({
        ...user,
        isTrainer
      });
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 2,
        borderRadius: 1,
        boxShadow: 2,
        zIndex: 1000
      }}
    >
      <Typography variant="body2" gutterBottom>
        Demo Controls
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={user?.isTrainer || false}
            onChange={handleToggleTrainer}
            color="primary"
          />
        }
        label="Trainer Mode"
      />
    </Box>
  );
};

export default UserToggle;
