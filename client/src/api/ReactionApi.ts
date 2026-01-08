import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";

export type ReactionType = "like" | "dislike";

// Маппинг между числовыми значениями enum с сервера и строковыми типами
export const ReactionTypeMap: Record<number, ReactionType> = {
  0: "like",
  1: "dislike",
};

// Обратный маппинг: строка -> число (для отправки на сервер)
export const ReactionTypeToNumber: Record<ReactionType, number> = {
  like: 0,
  dislike: 1,
};

export interface ReactionReadDto {
  id: number;
  userId: number;
  postId: number;
  date: string;
  type: number;
}

export interface ReactionCreateDto {
  postId: number;
  type: ReactionType;
}

export class ReactionApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getReactionsByPost(): Promise<ReactionReadDto[]> {
    try {
      const response = await axios.get<ReactionReadDto[]>(
        `${this.baseUrl}/reactions`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );
      return response.data || [];
    } catch (error) {
      // Если endpoint не существует, возвращаем пустой массив
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      console.warn(`Failed to load reactions:`, error);
      return [];
    }
  }

  /**
   * Получить реакции по postId
   */
  async getPostReactions(postId: number): Promise<ReactionReadDto[]> {
    try {
      const response = await axios.get<ReactionReadDto[]>(
        `${this.baseUrl}/reactions/post/${postId}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );
      return response.data || [];
    } catch (error) {
      // Если endpoint не существует, возвращаем пустой массив
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn(`Endpoint /reactions/post/${postId} not found, falling back to getReactionsByPost`);
        // Fallback на старый метод для обратной совместимости
        try {
          const allReactions = await this.getReactionsByPost();
          return allReactions.filter((r: ReactionReadDto) => r.postId === postId);
        } catch (fallbackError) {
          // Если и fallback не работает (например, 401), возвращаем пустой массив
          return [];
        }
      }
      // Для 401 (Unauthorized) просто возвращаем пустой массив без логирования
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return [];
      }
      console.warn(`Failed to load reactions for post ${postId}:`, error);
      return [];
    }
  }

  /**
   * Получить реакцию пользователя на пост по типу
   */
  async getUserReaction(
    postId: number,
    reactionType: ReactionType,
    userId: number
  ): Promise<ReactionReadDto | null> {
    try {
      const reactions = await this.getPostReactions(postId);
      const reactionTypeNumber = ReactionTypeToNumber[reactionType];
      return reactions.find(
        (r: ReactionReadDto) => r.type === reactionTypeNumber && r.userId === userId
      ) || null;
    } catch (error) {
      console.warn(`Failed to get user reaction for post ${postId}:`, error);
      return null;
    }
  }

  /**
   * Добавить реакцию на пост
   */
  async addReaction(
    postId: number,
    reactionType: ReactionType
  ): Promise<number> {
    try {
      // Проверяем валидность postId
      if (!postId || postId === 0) {
        throw new Error(`Invalid postId: ${postId}`);
      }

      // Преобразуем строковый тип в числовое значение enum для сервера
      const reactionTypeNumber = ReactionTypeToNumber[reactionType];
      
      if (reactionTypeNumber === undefined) {
        throw new Error(`Invalid reaction type: ${reactionType}`);
      }
      
      // Отправляем данные напрямую, как в других API методах
      // Пробуем оба варианта: с dto и без dto
      const requestDataDirect = {
        postId,
        type: reactionTypeNumber, // Отправляем число (enum value)
      };
      
      // Также пробуем с оберткой dto (на случай, если сервер требует)
      const requestDataWithDto = {
        dto: requestDataDirect
      };
      
      console.log('Sending reaction data (direct):', requestDataDirect);
      console.log('PostId:', postId, 'Original type:', reactionType, 'Numeric type:', reactionTypeNumber);
      
      // Пробуем сначала без обертки dto
      let response;
      try {
        response = await axios.post<number>(
          `${this.baseUrl}/reactions`,
          requestDataDirect,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
            timeout: 10000,
          }
        );
        return response.data;
      } catch (directError) {
        // Если не сработало без dto, пробуем с оберткой dto
        if (axios.isAxiosError(directError) && directError.response?.status === 400) {
          console.log('Direct request failed, trying with dto wrapper...');
          response = await axios.post<number>(
            `${this.baseUrl}/reactions`,
            requestDataWithDto,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
              timeout: 10000,
            }
          );
          return response.data;
        }
        throw directError;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        if (error.response.data?.errors) {
          console.error('Validation errors:', JSON.stringify(error.response.data.errors, null, 2));
        }
      }
      this.handleReactionError(
        error,
        `Failed to add reaction ${reactionType} for post ID ${postId}`
      );
    }
  }

  /**
   * Удалить реакцию с поста
   */
  async removeReaction(reactionId: number): Promise<void> {
    try {
      await axios.delete(
        `${this.baseUrl}/reactions/${reactionId}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );
    } catch (error) {
      this.handleReactionError(
        error,
        `Failed to remove reaction with ID ${reactionId}`
      );
    }
  }

  /**
   * Обработка ошибок
   */
  private handleReactionError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || defaultMessage;

        switch (status) {
          case 400:
            throw new Error("Invalid reaction data.");
          case 401:
            throw new Error("Unauthorized. Please login again.");
          case 403:
            throw new Error("Forbidden. You don't have permission.");
          case 404:
            throw new Error("Post or reaction not found.");
          case 409:
            throw new Error("Reaction already exists.");
          case 422:
            throw new Error("Validation error. Please check your data.");
          case 500:
            throw new Error("Server error. Please try again later.");
          default:
            throw new Error(message);
        }
      } else if (error.request) {
        throw new Error("Network error. Please check your connection.");
      }
    }

    throw new Error(defaultMessage);
  }
}

// Экспортируем экземпляр по умолчанию
export const reactionApi = new ReactionApi();

// Для использования с кастомным URL
export default ReactionApi;
