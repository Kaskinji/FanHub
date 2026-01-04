import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";

export interface FandomReadDto {
  id: number;
  gameId: number;
  name: string;
  description: string;
  creationDate: string;
  coverImage?: string;
  rules: string;
}

export interface FandomStatsDto {
  id: number;
  gameId: number;
  name: string;
  description: string;
  creationDate: string;
  coverImage?: string;
  rules: string;
  subscribersCount: number;
  postsCount: number;
}

export interface FandomCreateDto {
  gameId: number;
  name: string;
  description: string;
  coverImage: string | undefined;
  rules: string;
}

export interface FandomUpdateDto {
  gameId: number;
  name: string;
  description: string;
  coverImage: string | undefined;
  rules: string;
}

export class FandomApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Получить все фандомы
   */
  async getFandoms(): Promise<FandomReadDto[]> {
    try {
      const response = await axios.get<FandomReadDto[]>(
        `${this.baseUrl}/fandoms`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleFandomError(error, "Failed to fetch fandoms");
    }
  }

  /**
   * Получить фандом по ID (базовые данные)
   */
  async getFandomById(id: number): Promise<FandomReadDto> {
    try {
      const response = await axios.get<FandomReadDto>(
        `${this.baseUrl}/fandoms/${id}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleFandomError(error, `Failed to fetch fandom with ID ${id}`);
    }
  }

  /**
   * Получить фандом со статистикой по ID
   */
  async getFandomWithStatsById(id: number): Promise<FandomStatsDto> {
    try {
      const response = await axios.get<FandomStatsDto>(
        `${this.baseUrl}/fandoms/stats/${id}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleFandomError(
        error,
        `Failed to fetch fandom stats with ID ${id}`
      );
    }
  }

  /**
   * Поиск фандомов по названию
   */
  async searchFandomsByName(name: string): Promise<FandomReadDto[]> {
    try {
      const response = await axios.get<FandomReadDto[]>(
        `${this.baseUrl}/fandoms/name`,
        {
          params: { name },
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleFandomError(
        error,
        `Failed to search fandoms by name: ${name}`
      );
    }
  }

  /**
   * Поиск фандомов по названию и игре
   */
  async searchFandomsByNameAndGame(
    gameId: number,
    name?: string
  ): Promise<FandomReadDto[]> {
    try {
      const response = await axios.get<FandomReadDto[]>(
        `${this.baseUrl}/fandoms/search/${gameId}`,
        {
          params: { name: name || "" },
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleFandomError(
        error,
        `Failed to search fandoms by game ID ${gameId} and name: ${name}`
      );
    }
  }

  /**
   * Получить популярные фандомы
   */
  async getPopularFandoms(limit: number = 20): Promise<FandomReadDto[]> {
    try {
      const response = await axios.get<FandomReadDto[]>(
        `${this.baseUrl}/fandoms/popular`,
        {
          params: { limit },
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleFandomError(
        error,
        `Failed to fetch popular fandoms with limit ${limit}`
      );
    }
  }

  /**
   * Получить популярные фандомы по игре
   */
  async getPopularFandomsByGame(
    gameId: number,
    limit: number = 20
  ): Promise<FandomReadDto[]> {
    try {
      const response = await axios.get<FandomReadDto[]>(
        `${this.baseUrl}/fandoms/search/${gameId}/popular`,
        {
          params: { limit },
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleFandomError(
        error,
        `Failed to fetch popular fandoms for game ID ${gameId} with limit ${limit}`
      );
    }
  }

  /**
   * Проверить, является ли текущий пользователь создателем фандома
   */
  async checkCreator(fandomId: number): Promise<boolean> {
    try {
      const response = await axios.get<boolean>(
        `${this.baseUrl}/fandoms/${fandomId}/is-creator`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleFandomError(
        error,
        `Failed to check creator status for fandom ID ${fandomId}`
      );
    }
  }

  /**
   * Создать новый фандом
   */
  async createFandom(fandomData: FandomCreateDto): Promise<number> {
    try {
      const response = await axios.post<number>(
        `${this.baseUrl}/fandoms`,
        fandomData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      this.handleFandomError(error, "Failed to create fandom");
    }
  }

  /**
   * Обновить данные фандома
   */
  async updateFandom(id: number, fandomData: FandomUpdateDto): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/fandoms/${id}`, fandomData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        timeout: 10000,
      });
    } catch (error) {
      this.handleFandomError(error, `Failed to update fandom with ID ${id}`);
    }
  }

  /**
   * Удалить фандом (только для администраторов)
   */
  async deleteFandom(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/fandoms/${id}`, {
        withCredentials: true,
        timeout: 10000,
      });
    } catch (error) {
      this.handleFandomError(error, `Failed to delete fandom with ID ${id}`);
    }
  }

  /**
   * Обработка ошибок
   */
  private handleFandomError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || defaultMessage;

        switch (status) {
          case 400:
            throw new Error("Invalid fandom data.");
          case 401:
            throw new Error("Unauthorized. Please login again.");
          case 403:
            throw new Error("Forbidden. You don't have permission.");
          case 404:
            throw new Error("Fandom not found.");
          case 409:
            throw new Error("Fandom with this name already exists.");
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
export const fandomApi = new FandomApi();

// Для использования с кастомным URL
export default FandomApi;
