import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import type { 
  User, 
  AuthState, 
  LoginCredentials, 
  RegisterData,
  AuthContextType 
} from '../../types/AuthTypes';
import { authApi } from '../../api/AuthApi';

interface AuthProviderProps {
  children: React.ReactNode;
}

// Тип для ошибки в провайдере
interface ProviderAuthError extends Error {
  message: string;
  code?: string;
  status?: number;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children 
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Вспомогательная функция для создания ошибки
  const createAuthError = (message: string, originalError?: unknown): ProviderAuthError => {
    const error: ProviderAuthError = new Error(message);
    
    if (originalError && originalError instanceof Error) {
      error.message = originalError.message || message;
    }
    
    return error;
  };

  // Преобразование ID пользователя в объект User
  const createUserFromId = useCallback((userId: number): User => {
    // Пробуем получить сохраненное имя из localStorage
    const savedName = localStorage.getItem(`user_name_${userId}`);
    
    return {
      id: userId.toString(),
      name: savedName || `User ${userId}`,
      email: '',
      role: 'user' as const,
    };
  }, []);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { isAuthenticated, userId } = await authApi.checkAuth();
        console.log(isAuthenticated, userId);
        if (isAuthenticated && userId) {
          console.log("aasdf");
          const user = createUserFromId(userId);
          setState(prev => ({ 
            ...prev, 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          }));
        } else {
          setState(prev => ({ 
            ...prev, 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          }));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setState(prev => ({ 
          ...prev, 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        }));
      }
    };

    checkAuth();
  }, [createUserFromId]);

  // Вход
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const userId = await authApi.login(credentials);
      
      localStorage.setItem('user_id', userId.toString());
      
      const user = createUserFromId(userId);
      
      setState(prev => ({ 
        ...prev, 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      }));
    } catch (error: unknown) {
      const authError = createAuthError(
        'Login failed. Please check your credentials.',
        error
      );
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: authError.message
      }));
      
      throw authError;
    }
  }, [createUserFromId]);

  // Выход
  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await authApi.logout();
    } catch (error: unknown) {
      console.error('Logout API failed:', error);
      // Продолжаем очистку даже если API запрос не удался
    } finally {
      localStorage.removeItem('user_id');
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  // Обновление пользователя
  const updateUser = useCallback((userData: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev;
      
      const updatedUser = { ...prev.user, ...userData };
      
      if (userData.name && updatedUser.id) {
        localStorage.setItem(`user_name_${updatedUser.id}`, userData.name);
      }
      
      return {
        ...prev,
        user: updatedUser,
      };
    });
  }, []);

  // Очистка ошибок
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Регистрация
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: Реализовать регистрацию когда появится API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: 'user' as const,
      };
      
      setState(prev => ({ 
        ...prev, 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      }));
    } catch (error: unknown) {
      const authError = createAuthError(
        'Registration failed. Please try again.',
        error
      );
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: authError.message
      }));
      
      throw authError;
    }
  }, []);

  // Значение контекста - строго по типу AuthContextType
  const contextValue: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};