import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

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
  role: 'User' | 'Admin' | 'Moderator';
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
      const response = await axios.get<UserReadDto[]>(`${this.baseUrl}/api/users`, {
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
      const response = await axios.get<UserSafeReadDto>(`${this.baseUrl}/api/users/${id}`, {
        withCredentials: true,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      this.handleUserError(error, `Failed to fetch user with ID ${id}`);
    }
  }
  
  /**
   * Получить текущего авторизованного пользователя
   */
  async getCurrentUser(): Promise<UserSafeReadDto | null> {
    try {
      // Сначала проверяем, есть ли сохраненный ID
      const userId = localStorage.getItem('user_id');
      
      if (!userId) {
        return null;
      }

      return await this.getUserById(Number(userId));
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Обновить данные пользователя
   */
  async updateUser(id: number, userData: UserUpdateDto): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/api/users/${id}`, userData, {
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
      await axios.delete(`${this.baseUrl}/api/users/${id}`, {
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
   * Получить аватар пользователя (если нужно отдельно)
   */
  async getUserAvatar(id: number): Promise<string | null> {
    try {
      const user = await this.getUserById(id);
      return user.avatar || null;
    } catch (error) {
      console.error('Failed to get user avatar:', error);
      return null;
    }
  }

  /**
   * Обновить аватар пользователя
   */
  async updateUserAvatar(id: number, avatarData: FormData): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/api/users/${id}/avatar`, avatarData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        timeout: 30000, // Больше времени для загрузки файла
      });
    } catch (error) {
      this.handleUserError(error, 'Failed to update avatar');
    }
  }

  /**
   * Обновить аватар текущего пользователя
   */
  async updateCurrentUserAvatar(avatarFile: File): Promise<void> {
    try {
      const userId = localStorage.getItem('user_id');
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const formData = new FormData();
      formData.append('avatar', avatarFile);

      await this.updateUserAvatar(Number(userId), formData);
    } catch (error) {
      this.handleUserError(error, 'Failed to update current user avatar');
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