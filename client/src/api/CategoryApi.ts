import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import type { Category } from "../types/Category";

export class CategoryApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Получить все категории
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await axios.get<Category[]>(
        `${this.baseUrl}/categories`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      this.handleCategoryError(error, "Failed to fetch categories");
    }
  }

  /**
   * Создать новую категорию
   */
  async createCategory(name: string, icon?: string): Promise<Category> {
    try {
      const response = await axios.post<Category>(
        `${this.baseUrl}/categories`,
        { name, icon },
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to create category:", error);
      this.handleCategoryError(error, "Failed to create category");
    }
  }

  /**
   * Удалить категорию
   */
  async deleteCategory(id: number): Promise<void> {
    try {
      await axios.delete(
        `${this.baseUrl}/categories/${id}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );
    } catch (error) {
      console.error("Failed to delete category:", error);
      this.handleCategoryError(error, "Failed to delete category");
    }
  }

  /**
   * Обработка ошибок
   */
  private handleCategoryError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || defaultMessage;

        switch (status) {
          case 400:
            throw new Error("Invalid request.");
          case 401:
            throw new Error("Unauthorized. Please login again.");
          case 403:
            throw new Error("Forbidden. You don't have permission.");
          case 404:
            throw new Error("Categories not found.");
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
export const categoryApi = new CategoryApi();

// Для использования с кастомным URL
export default CategoryApi;
