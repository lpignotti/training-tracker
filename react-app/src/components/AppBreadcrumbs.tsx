import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Typography,
  Link,
  Paper
} from '@mui/material';
import {
  Home,
  AdminPanelSettings,
  School,
  NavigateNext
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

interface BreadcrumbItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const AppBreadcrumbs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isTrainer } = useAuth();

  // Define all possible breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      path: '/',
      label: 'Homepage',
      icon: <Home sx={{ mr: 0.5 }} fontSize="inherit" />
    },
    {
      path: '/trainer',
      label: 'Trainer Dashboard',
      icon: <AdminPanelSettings sx={{ mr: 0.5 }} fontSize="inherit" />
    },
    {
      path: '/training',
      label: 'Training',
      icon: <School sx={{ mr: 0.5 }} fontSize="inherit" />
    }
  ];

  // Get current path items
  const getCurrentBreadcrumbs = (): BreadcrumbItem[] => {
    const currentPath = location.pathname;
    const items: BreadcrumbItem[] = [];

    // Always include homepage for trainers
    if (isTrainer()) {
      items.push(breadcrumbItems[0]); // Homepage
    }

    // Add current page if it's not homepage
    const currentItem = breadcrumbItems.find(item => item.path === currentPath);
    if (currentItem && currentPath !== '/') {
      items.push(currentItem);
    }

    return items;
  };

  const handleBreadcrumbClick = (path: string) => {
    navigate(path);
  };

  const currentBreadcrumbs = getCurrentBreadcrumbs();

  // Don't show breadcrumbs if there's only one item or user is not trainer
  if (currentBreadcrumbs.length <= 1 || !isTrainer()) {
    return null;
  }

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        px: 3, 
        py: 2, 
        mb: 3,
        backgroundColor: 'grey.50',
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{
            '& .MuiBreadcrumbs-li': {
              display: 'flex',
              alignItems: 'center'
            }
          }}
        >
          {currentBreadcrumbs.map((item, index) => {
            const isLast = index === currentBreadcrumbs.length - 1;
            
            if (isLast) {
              return (
                <Typography
                  key={item.path}
                  color="primary.main"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {item.icon}
                  {item.label}
                </Typography>
              );
            } else {
              return (
                <Link
                  key={item.path}
                  component="button"
                  variant="body1"
                  onClick={() => handleBreadcrumbClick(item.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'primary.main'
                    },
                    cursor: 'pointer',
                    border: 'none',
                    background: 'transparent',
                    font: 'inherit'
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            }
          })}
        </Breadcrumbs>
      </Box>
    </Paper>
  );
};

export default AppBreadcrumbs;
