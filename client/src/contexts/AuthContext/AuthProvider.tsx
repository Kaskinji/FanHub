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
import { userApi } from '../../api/UserApi';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface ProviderAuthError extends Error {
  message: string;
  code?: string;
  status?: number;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children 
}) => {
  const [state, setState] = useState<AuthState>({
    user: undefined,
    isAuthenticated: false,
    isLoading: true,
    error: undefined,
  });

  const createAuthError = (message: string, originalError?: unknown): ProviderAuthError => {
    const error: ProviderAuthError = new Error(message);
    
    if (originalError && originalError instanceof Error) {
      error.message = originalError.message || message;
    }
    
    return error;
  };

  // Функция для получения пользователя по ID
  const fetchUserById = useCallback(async (userId: number): Promise<User | null> => {
    try {
      const userData = await userApi.getCurrentUser();
      
      if (!userData) {
        return null;
      }

      // Преобразуем UserReadDto в User (адаптируем под ваш тип User)
      const user: User = {
        id: userData.id.toString(),
        login: userData.login, // или userData.email, если есть
        name: userData.username,
        role: userData.role,
        avatar: userData.avatar,
        registrationDate: userData.registrationDate
        // Добавьте другие поля при необходимости
      };
      
      return user;
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      return null;
    }
  }, []);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { isAuthenticated, userId } = await authApi.checkAuth();
        
        if (isAuthenticated && userId) {
          // Получаем данные пользователя
          const user = await fetchUserById(userId);
          
          if (user) {
            setState(prev => ({ 
              ...prev, 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            }));
          } else {
            // Пользователь не найден, сбрасываем аутентификацию
            setState(prev => ({ 
              ...prev, 
              user: undefined, 
              isAuthenticated: false, 
              isLoading: false 
            }));
          }
        } else {
          setState(prev => ({ 
            ...prev, 
            user: undefined, 
            isAuthenticated: false, 
            isLoading: false 
          }));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setState(prev => ({ 
          ...prev, 
          user: undefined, 
          isAuthenticated: false, 
          isLoading: false 
        }));
      }
    };

    checkAuth();
  }, [fetchUserById]);

  // Вход
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      const userId = await authApi.login(credentials);
      
      // Получаем данные пользователя после успешного входа
      const user = await fetchUserById(userId);
      
      if (!user) {
        throw new Error('Failed to load user data after login');
      }
      
      localStorage.setItem('user_id', userId.toString());
      
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
  }, [fetchUserById]);

  // Выход
  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await authApi.logout();
    } catch (error: unknown) {
      console.error('Logout API failed:', error);
    } finally {
      localStorage.removeItem('user_id');
      
      setState({
        user: undefined,
        isAuthenticated: false,
        isLoading: false,
        error: undefined,
      });
    }
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev;
      
      const updatedUser = { ...prev.user, ...userData };
      
      return {
        ...prev,
        user: updatedUser,
      };
    });
  }, []);

  // Очистка ошибок
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: undefined }));
  }, []);

  // Регистрация
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      await authApi.register(data);
      
      const userData = await userApi.getCurrentUser();
      
      if (!userData) {
        throw Error;
      }

      // Преобразуем UserReadDto в User (адаптируем под ваш тип User)
      const user: User = {
        id: userData.id.toString(),
        login: userData.login, // или userData.email, если есть
        name: userData.username,
        role: userData.role,
        avatar: userData.avatar,
        registrationDate: userData.registrationDate
      };

           
      if (user === undefined)
      {
        setState(prev => ({ 
        ...prev, 
        user: undefined, 
        isAuthenticated: true, 
        isLoading: false 

      }));
      throw Error;
      }
      
      setState(prev => ({ 
        ...prev, 
        user: user, 
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

  // Значение контекста
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