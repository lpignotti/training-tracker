import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { User, UserFormData } from '../types/user';
import { Category, categoryService } from '../services/categoryService';
import {
  validateName,
  validateSurname,
  validatePassword,
  validateEmail,
  validateCategory,
  validateRole
} from '../utils/validation';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: UserFormData) => Promise<void>;
  user?: User | null;
  mode: 'add' | 'edit';
}

interface FormErrors {
  name?: string;
  password?: string;
  surname?: string;
  email?: string;
  category?: string;
  role?: string;
}

const UserForm: React.FC<UserFormProps> = ({
  open,
  onClose,
  onSubmit,
  user,
  mode
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    password: '',
    surname: '',
    email: '',
    category: '',
    role: 'Player'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        name: user.name,
        password: user.password,
        surname: user.surname,
        email: user.email,
        category: user.category,
        role: user.role
      });
    } else {
      setFormData({
        name: '',
        password: '',
        surname: '',
        email: '',
        category: '',
        role: 'Player'
      });
    }
    setErrors({});
    setSubmitError('');
  }, [user, mode, open]);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const loadedCategories = await categoryService.getAllCategories();
        setCategories(loadedCategories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    
    if (open) {
      loadCategories();
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const surnameError = validateSurname(formData.surname);
    if (surnameError) newErrors.surname = surnameError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const categoryError = validateCategory(formData.category);
    if (categoryError) newErrors.category = categoryError;

    const roleError = validateRole(formData.role);
    if (roleError) newErrors.role = roleError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserFormData) => (
    event: React.ChangeEvent<HTMLInputElement> | { target: { value: unknown } }
  ) => {
    const value = event.target.value as string;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {mode === 'add' ? 'Add New User' : 'Edit User'}
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {submitError && (
              <Alert severity="error">{submitError}</Alert>
            )}

            <TextField
              label="Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              required
              fullWidth
              disabled={loading}
              inputProps={{ maxLength: 50 }}
            />

            <TextField
              label="Surname"
              value={formData.surname}
              onChange={handleInputChange('surname')}
              error={!!errors.surname}
              helperText={errors.surname}
              required
              fullWidth
              disabled={loading}
              inputProps={{ maxLength: 50 }}
            />

            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              required
              fullWidth
              disabled={loading}
              inputProps={{ maxLength: 100 }}
            />

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              required
              fullWidth
              disabled={loading}
              inputProps={{ 
                maxLength: 254
              }}
            />

            <FormControl fullWidth required error={!!errors.category}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={formData.category}
                label="Category"
                onChange={handleInputChange('category')}
                disabled={loading}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <Box component="p" sx={{ 
                  color: 'error.main', 
                  fontSize: '0.75rem', 
                  mt: '3px', 
                  mx: '14px',
                  mb: 0,
                  lineHeight: 1.66
                }}>
                  {errors.category}
                </Box>
              )}
            </FormControl>

            <FormControl fullWidth required error={!!errors.role}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                value={formData.role}
                onChange={handleInputChange('role')}
                label="Role"
                disabled={loading}
              >
                <MenuItem value="Player">Player</MenuItem>
                <MenuItem value="Trainer">Trainer</MenuItem>
              </Select>
              {errors.role && (
                <Box component="p" sx={{ 
                  color: 'error.main', 
                  fontSize: '0.75rem', 
                  mt: '3px', 
                  mx: '14px',
                  mb: 0,
                  lineHeight: 1.66
                }}>
                  {errors.role}
                </Box>
              )}
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={onClose}
            disabled={loading}
            sx={{ minWidth: 80 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              mode === 'add' ? 'Add User' : 'Update User'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm;
