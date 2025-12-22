export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Используем те же имена полей, что и в AuthService
export interface LoginCredentials {
  login: string;    // Должно совпадать с AuthService
  password: string; // Должно совпадать с AuthService
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>; // Изменено на void
  register: (data: RegisterData) => Promise<void>; // Изменено на void
  logout: () => Promise<void>; // Изменено на void
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
}