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

  
  async getUserById(id: number): Promise<UserSafeReadDto> {
    try {
      const response = await axios.get<UserSafeReadDto>(`${this.baseUrl}/users/${id}`, {
        withCredentials: true,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        const unauthorizedError = new Error('UNAUTHORIZED') as Error & { status?: number };
        unauthorizedError.status = 401;
        throw unauthorizedError;
      }
      this.handleUserError(error, `Failed to fetch user with ID ${id}`);
    }
  }
  
  
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

  
  async deleteCurrentUser(): Promise<void> {
    try {
      const userId = localStorage.getItem('user_id');
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      await this.deleteUser(Number(userId));
      
      
      localStorage.removeItem('user_id');
    } catch (error) {
      this.handleUserError(error, 'Failed to delete current user');
    }
  }

  
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


export const userApi = new UserApi();


export default UserApi;