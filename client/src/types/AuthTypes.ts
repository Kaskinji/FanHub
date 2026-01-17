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


export interface LoginCredentials {
  login: string;    
  password: string; 
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
  login: (credentials: LoginCredentials) => Promise<void>; 
  register: (data: RegisterData) => Promise<void>; 
  logout: () => Promise<void>; 
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
}