export interface User {
  id: string;
  name: string;
  password: string;
  surname: string;
  email: string;
  category: string;
  role: 'Trainer' | 'Player';
  isTrainer: boolean; // Derived from role for backward compatibility
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  isTrainer: () => boolean;
}

export interface UserFormData {
  name: string;
  password: string;
  surname: string;
  email: string;
  category: string;
  role: 'Trainer' | 'Player';
}
