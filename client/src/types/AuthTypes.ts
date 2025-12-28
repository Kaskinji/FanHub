import type { Role } from "./enums/Roles";

export interface User {
  id: string;
  login: string;
  name: string;
  avatar?: string;
  role: Role;
  registrationDate: string;
}

export interface AuthState {
  user: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | undefined;
}

// Используем те же имена полей, что и в AuthService
export interface LoginCredentials {
  login: string;    // Должно совпадать с AuthService
  password: string; // Должно совпадать с AuthService
}

export interface RegisterData {
  username: string;
  login: string;
  password: string;
  avatar: string | undefined;
}

export interface AuthContextType {
  user: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | undefined;
  login: (credentials: LoginCredentials) => Promise<void>; // Изменено на void
  register: (data: RegisterData) => Promise<void>; // Изменено на void
  logout: () => Promise<void>; // Изменено на void
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
}