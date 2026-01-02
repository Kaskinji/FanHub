import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

export interface SubscriptionReadDto {
  id: number;
  fandomId: number;
  userId: number;
}

export interface SubscriptionCreateDto {
  fandomId: number;
}

export class SubscriptionApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Получить все подписки
   */
  async getSubscriptions(): Promise<SubscriptionReadDto[]> {
    try {
      const response = await axios.get<SubscriptionReadDto[]>(`${this.baseUrl}/subscriptions`, {
        withCredentials: true,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      this.handleSubscriptionError(error, 'Failed to fetch subscriptions');
    }
  }

  /**
   * Получить подписку по ID
   */
  async getSubscriptionById(id: number): Promise<SubscriptionReadDto> {
    try {
      const response = await axios.get<SubscriptionReadDto>(`${this.baseUrl}/subscriptions/${id}`, {
        withCredentials: true,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      this.handleSubscriptionError(error, `Failed to fetch subscription with ID ${id}`);
    }
  }

  /**
   * Создать подписку
   */
  async createSubscription(dto: SubscriptionCreateDto): Promise<number> {
    try {
      const response = await axios.post<number>(`${this.baseUrl}/subscriptions`, dto, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      this.handleSubscriptionError(error, 'Failed to create subscription');
    }
  }

  /**
   * Получить подписку текущего пользователя на фандом
   */
  async getCurrentUserSubscription(fandomId: number): Promise<number | null> {
    try {
      const response = await axios.get<number | null>(`${this.baseUrl}/subscriptions/current/${fandomId}`, {
        withCredentials: true
      });
      if(response.status === 204)
      {
        return null;
      }
      return response.data;
    } catch (error) {
      this.handleSubscriptionError(error, `Failed to get current user subscription for fandom ID ${fandomId}`);
    }
  }

  /**
   * Удалить подписку
   */
  async deleteSubscription(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/subscriptions/${id}`, {
        withCredentials: true,
        timeout: 10000,
      });
    } catch (error) {
      this.handleSubscriptionError(error, `Failed to delete subscription with ID ${id}`);
    }
  }

  /**
   * Обработка ошибок
   */
  private handleSubscriptionError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || defaultMessage;

        switch (status) {
          case 400:
            throw new Error('Invalid subscription data.');
          case 401:
            throw new Error('Unauthorized. Please login again.');
          case 403:
            throw new Error('Forbidden. You don\'t have permission.');
          case 404:
            throw new Error('Subscription not found.');
          case 409:
            throw new Error('Subscription already exists.');
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

    throw new Error(defaultMessage);
  }
}

// Экспортируем экземпляр по умолчанию
export const subscriptionApi = new SubscriptionApi();

// Для использования с кастомным URL
export default SubscriptionApi;