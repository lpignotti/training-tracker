import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  SupervisorAccount as AdminIcon
} from '@mui/icons-material';
import { User, UserFormData } from '../types/user';
import { userService } from '../services/userService';
import UserForm from './UserForm';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormMode('add');
    setError('');
    setSuccessMessage('');
    setFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormMode('edit');
    setError('');
    setSuccessMessage('');
    setFormOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    // Prevent deletion of the last trainer user
    const trainerUsers = users.filter(u => u.role === 'Trainer');
    if (user.role === 'Trainer' && trainerUsers.length === 1) {
      setError('Cannot delete the last trainer user. At least one trainer must remain.');
      return;
    }
    
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (userData: UserFormData) => {
    setActionLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      if (formMode === 'add') {
        await userService.createUser(userData);
        setSuccessMessage(`User "${userData.name} ${userData.surname}" has been added successfully!`);
      } else if (selectedUser) {
        await userService.updateUser(selectedUser.id, userData);
        setSuccessMessage(`User "${userData.name} ${userData.surname}" has been updated successfully!`);
      }
      await loadUsers();
      setFormOpen(false);
      setSelectedUser(null);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      throw err; // Let the form handle the error display
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setActionLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await userService.deleteUser(userToDelete.id);
      setSuccessMessage(`User "${userToDelete.name} ${userToDelete.surname}" has been deleted successfully!`);
      await loadUsers();
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setActionLoading(false);
    }
  };



  const getRoleChip = (user: User) => {
    return (
      <Chip
        icon={user.role === 'Trainer' ? <AdminIcon /> : <PersonIcon />}
        label={user.role}
        color={user.role === 'Trainer' ? 'primary' : 'default'}
        size="small"
        variant={user.role === 'Trainer' ? 'filled' : 'outlined'}
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            User Management
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
              sx={{ textTransform: 'none' }}
            >
              Add New User
            </Button>
          </Box>
        </Box>

        {/* Success Alert */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Users Table */}
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Surname</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No users found. Click "Add New User" to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.surname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.category}</TableCell>
                    <TableCell>{getRoleChip(user)}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <Tooltip title="Edit User">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditUser(user)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteUser(user)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Total users: {users.length} | 
          <Typography component="span" sx={{ ml: 1, color: 'success.main', fontWeight: 'medium' }}>
            ✅ Data persisted locally
          </Typography>
        </Typography>
      </Paper>

      {/* User Form Dialog */}
      <UserForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{userToDelete?.name} {userToDelete?.surname}"?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
