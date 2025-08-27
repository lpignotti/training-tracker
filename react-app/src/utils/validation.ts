// Validation utility functions

export const validateName = (name: string): string | null => {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'Name is required';
  }
  if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
    return 'Name must contain only alphabetic characters';
  }
  if (trimmed.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (trimmed.length > 50) {
    return 'Name must be less than 50 characters long';
  }
  return null;
};

export const validateSurname = (surname: string): string | null => {
  const trimmed = surname.trim();
  if (!trimmed) {
    return 'Surname is required';
  }
  if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
    return 'Surname must contain only alphabetic characters';
  }
  if (trimmed.length < 2) {
    return 'Surname must be at least 2 characters long';
  }
  if (trimmed.length > 50) {
    return 'Surname must be less than 50 characters long';
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const trimmed = email.trim();
  if (!trimmed) {
    return 'Email is required';
  }
  
  // More strict RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address (e.g., user@example.com)';
  }
  
  // Additional checks for common issues
  if (trimmed.includes('..')) {
    return 'Email cannot contain consecutive dots';
  }
  
  if (trimmed.startsWith('.') || trimmed.endsWith('.')) {
    return 'Email cannot start or end with a dot';
  }
  
  if (trimmed.includes('@.') || trimmed.includes('.@')) {
    return 'Invalid email format around @ symbol';
  }
  
  // Check for at least one dot after @
  const atIndex = trimmed.indexOf('@');
  if (atIndex === -1 || trimmed.indexOf('.', atIndex) === -1) {
    return 'Email must contain a domain with at least one dot (e.g., @example.com)';
  }
  
  // Check domain part has at least 2 characters after final dot
  const lastDotIndex = trimmed.lastIndexOf('.');
  if (trimmed.length - lastDotIndex < 3) {
    return 'Domain extension must be at least 2 characters long';
  }
  
  if (trimmed.length > 254) {
    return 'Email address is too long';
  }
  
  return null;
};

export const validateCategory = (category: string): string | null => {
  const trimmed = category.trim();
  if (!trimmed) {
    return 'Category is required';
  }
  if (!/^[a-zA-Z0-9\s]+$/.test(trimmed)) {
    return 'Category must contain only alphanumeric characters and spaces';
  }
  if (trimmed.length < 2) {
    return 'Category must be at least 2 characters long';
  }
  if (trimmed.length > 30) {
    return 'Category must be less than 30 characters long';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  const trimmed = password.trim();
  if (!trimmed) {
    return 'Password is required';
  }
  if (trimmed.length < 3) {
    return 'Password must be at least 3 characters long';
  }
  if (trimmed.length > 100) {
    return 'Password must be less than 100 characters long';
  }
  return null;
};

export const validateRole = (role: string): string | null => {
  if (!role) {
    return 'Role is required';
  }
  if (!['Trainer', 'Player'].includes(role)) {
    return 'Role must be either Trainer or Player';
  }
  return null;
};
