import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import type { Role } from '../types/enums/Roles';

export interface UserSafeReadDto {
  id: number;
  username: string;
  avatar?: string;
  registrationDate: string;
}

export interface UserCreateDto {
  username: string;
  login: string;
  password: string;
  avatar?: string;
}

export interface UserUpdateDto {
  username: string;
  login: string;
  password: string;
  avatar?: string | null;
}

export interface UserReadDto {
  id: number;
  username: string;
  login: string;
  passwordHash: string;
  avatar?: string;
  role: Role;
  registrationDate: string;
}

export class UserApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Получить всех пользователей (только для администраторов)
   */
  async getUsers(): Promise<UserReadDto[]> {
    try {
      const response = await axios.get<UserReadDto[]>(`${this.baseUrl}/users`, {
        withCredentials: true,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      this.handleUserError(error, 'Failed to fetch users');
    }
  }

  /**
   * Получить пользователя по ID (безопасные данные)
   */
  async getUserById(id: number): Promise<UserSafeReadDto> {
    try {
      const response = await axios.get<UserSafeReadDto>(`${this.baseUrl}/users/${id}`, {
        withCredentials: true,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      // Для 401 (Unauthorized) выбрасываем специальную ошибку, которую можно обработать
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        const unauthorizedError = new Error('UNAUTHORIZED') as Error & { status?: number };
        unauthorizedError.status = 401;
        throw unauthorizedError;
      }
      this.handleUserError(error, `Failed to fetch user with ID ${id}`);
    }
  }
  
  /**
   * Получить текущего авторизованного пользователя
   */
  async getCurrentUser(): Promise<UserReadDto | undefined> {
    try {
      const userId = localStorage.getItem('user_id');
      
      if (!userId) {
        return undefined;
      }

      return (await axios.get<UserReadDto>(`${this.baseUrl}/users/current`, {withCredentials: true})).data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return undefined;
    }
  }

  /**
   * Обновить данные пользователя
   */
  async updateUser(id: number, userData: UserUpdateDto): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/users/${id}`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        timeout: 10000,
      });
    } catch (error) {
      this.handleUserError(error, `Failed to update user with ID ${id}`);
    }
  }

  /**
   * Обновить данные текущего пользователя
   */
  async updateCurrentUser(userData: UserUpdateDto): Promise<void> {
    try {
      const userId = localStorage.getItem('user_id');
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      await this.updateUser(Number(userId), userData);
    } catch (error) {
      this.handleUserError(error, 'Failed to update current user');
    }
  }

  /**
   * Удалить пользователя (только для администраторов или самого пользователя)
   */
  async deleteUser(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/users/${id}`, {
        withCredentials: true,
        timeout: 10000,
      });
    } catch (error) {
      this.handleUserError(error, `Failed to delete user with ID ${id}`);
    }
  }

  /**
   * Удалить текущего пользователя
   */
  async deleteCurrentUser(): Promise<void> {
    try {
      const userId = localStorage.getItem('user_id');
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      await this.deleteUser(Number(userId));
      
      // Очищаем localStorage после удаления аккаунта
      localStorage.removeItem('user_id');
    } catch (error) {
      this.handleUserError(error, 'Failed to delete current user');
    }
  }

  /**
   * Обработка ошибок
   */
  private handleUserError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || defaultMessage;

        switch (status) {
          case 400:
            throw new Error('Invalid user data.');
          case 401:
            throw new Error('Unauthorized. Please login again.');
          case 403:
            throw new Error('Forbidden. You don\'t have permission.');
          case 404:
            throw new Error('User not found.');
          case 409:
            throw new Error('Username or login already exists.');
          case 422:
            throw new Error('Validation error. Please check your data.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(message);
        }
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      }
    }

    throw new Error('An unexpected error occurred.');
  }
}

// Экспортируем экземпляр по умолчанию
export const userApi = new UserApi();

// Для использования с кастомным URL
export default UserApi;