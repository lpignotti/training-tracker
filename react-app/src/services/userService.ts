import { User, UserFormData } from '../types/user';
import { parseCsvContent } from '../utils/csvHelpers';

// Import CSV data at build time
let usersData: User[] = [];
let isInitialized = false;

// Load user data from backend API
const loadUsersFromCsv = async (): Promise<User[]> => {
  try {
    if (!isInitialized) {
      // Fetch users from backend API
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const users = await response.json() as User[];
          if (users && users.length > 0) {
            usersData = users.map(user => ({
              ...user,
              isTrainer: user.role === 'Trainer'
            }));
            isInitialized = true;
            console.log('Loaded users from backend API');
            return [...usersData];
          }
        } else {
          console.warn('Backend API not available, using fallback');
        }
      } catch (fetchError) {
        console.warn('Could not fetch from backend API:', fetchError);
      }

      // Fallback to CSV file if backend is not available
      try {
        const response = await fetch('/data/users.csv');
        if (response.ok) {
          const csvContent = await response.text();
          const parseResult = parseCsvContent<User>(csvContent, ['id', 'name', 'password', 'surname', 'email', 'category', 'role', 'isTrainer']);
          
          if (parseResult.success && parseResult.data.length > 0) {
            usersData = parseResult.data.map(user => ({
              ...user,
              isTrainer: user.role === 'Trainer'
            }));
            isInitialized = true;
            return [...usersData];
          }
        }
      } catch (csvError) {
        console.warn('Could not fetch CSV file:', csvError);
      }

      // No default data - start with empty array
      usersData = [];
      isInitialized = true;
      console.log('No CSV data found, starting with empty user list');
    }
    return [...usersData];
  } catch (error) {
    console.error('Error loading users:', error);
    throw new Error('Failed to load user data');
  }
};

// Save users to backend API
const saveUsersToCsv = async (users: User[]): Promise<void> => {
  try {
    // Update in-memory data
    usersData = users.map(user => ({
      ...user,
      isTrainer: user.role === 'Trainer'
    }));
    
    // Send data to backend API to save to CSV
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usersData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save users: ${response.statusText}`);
    }
    
    console.log('Users successfully saved to CSV file via backend');
  } catch (error) {
    console.error('Error saving users to backend:', error);
    throw new Error('Failed to save user data to CSV file');
  }
};

// Get current users from CSV data
const getCurrentUsers = async (): Promise<User[]> => {
  return await loadUsersFromCsv();
};

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    // Simulate API delay
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        try {
          const users = await getCurrentUsers();
          resolve([...users]);
        } catch (error) {
          console.error('Error getting users:', error);
          resolve([]);
        }
      }, 300);
    });
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | null> => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        try {
          const users = await getCurrentUsers();
          const user = users.find(u => u.id === id);
          resolve(user || null);
        } catch (error) {
          console.error('Error getting user by ID:', error);
          resolve(null);
        }
      }, 200);
    });
  },

  // Get user by email (for login)
  getUserByEmail: async (email: string): Promise<User | null> => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        try {
          const users = await getCurrentUsers();
          const user = users.find(u => u.email === email);
          resolve(user || null);
        } catch (error) {
          console.error('Error getting user by email:', error);
          resolve(null);
        }
      }, 200);
    });
  },

  // Create new user
  createUser: async (userData: UserFormData): Promise<User> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const users = await getCurrentUsers();
      
      // Check if email already exists
      if (users.some(u => u.email === userData.email)) {
        throw new Error('Email already exists');
      }

      // Generate new ID
      const maxId = users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) : 0;
      const newId = (maxId + 1).toString();

      const newUser: User = {
        id: newId,
        name: userData.name,
        password: userData.password,
        surname: userData.surname,
        email: userData.email,
        category: userData.category,
        role: userData.role,
        isTrainer: userData.role === 'Trainer'
      };

      const updatedUsers = [...users, newUser];
      await saveUsersToCsv(updatedUsers);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update existing user
  updateUser: async (id: string, userData: UserFormData): Promise<User> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const users = await getCurrentUsers();
      const userIndex = users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Check if email already exists for other users
      if (users.some(u => u.email === userData.email && u.id !== id)) {
        throw new Error('Email already exists');
      }

      const updatedUser: User = {
        id,
        name: userData.name,
        password: userData.password,
        surname: userData.surname,
        email: userData.email,
        category: userData.category,
        role: userData.role,
        isTrainer: userData.role === 'Trainer'
      };

      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      await saveUsersToCsv(updatedUsers);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const users = await getCurrentUsers();
      const userIndex = users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const updatedUsers = users.filter(u => u.id !== id);
      await saveUsersToCsv(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Clear all user data (for testing)
  clearAllUsers: async (): Promise<void> => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        try {
          await saveUsersToCsv([]);
          resolve();
        } catch (error) {
          console.error('Error clearing users:', error);
          resolve();
        }
      }, 200);
    });
  }
};
