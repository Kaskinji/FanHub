import axios from "axios";
import type { RegisterData } from "../types/AuthTypes";
import { API_CONFIG } from "../config/apiConfig";

export interface LoginCredentials {
  login: string;
  password: string;
}

export class AuthApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async login(credentials: LoginCredentials): Promise<number> {
    try {
      const response = await axios.post<number>(
        `${this.baseUrl}/auth/login`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleAuthError(error);
    }
  }
  
  async register(data: RegisterData): Promise<number> {
    try {
      console.log("sending:", data);
      const result = await axios.post<number>(
        `${this.baseUrl}/auth/register`,
        {
          username: data.username,
          login: data.login,
          password: data.password,
          avatar: undefined,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      localStorage.setItem("user_id", result.data.toString());
      return result.data;
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  async checkAuth(): Promise<{ isAuthenticated: boolean; userId?: number }> {
    try {
      const userId = localStorage.getItem("user_id");

      if (userId) {
        const response = await axios.get<boolean>(
          `${this.baseUrl}/auth/check`,
          {
            withCredentials: true,
            timeout: 10000,
          }
        );
        console.log(response);
        if (response.data === true) {
          return { isAuthenticated: true, userId: Number(userId) };
        }
      }

      return { isAuthenticated: false };
    } catch (error) {
      console.error("Auth check failed:", error);
      return { isAuthenticated: false };
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } finally {
      localStorage.removeItem("user_id");
    }
  }

  private handleAuthError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Authentication failed";

        switch (status) {
          case 400:
            throw new Error("Invalid login or password format.");
          case 401:
            throw new Error("Invalid username or password.");
          case 404:
            throw new Error("User not found.");
          case 500:
            throw new Error("Server error. Please try again later.");
          default:
            throw new Error(message);
        }
      } else if (error.request) {
        throw new Error("Network error. Please check your connection.");
      }
    }

    throw new Error("An unexpected error occurred.");
  }

  private handleRegisterError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Authentication failed";

        switch (status) {
          case 400:
            throw new Error(message);
          case 401:
            throw new Error(message);
          case 404:
            throw new Error(message);
          case 500:
            throw new Error(message);
          default:
            throw new Error(message);
        }
      } else if (error.request) {
        throw new Error("Network error. Please check your connection.");
      }
    }

    throw new Error("An unexpected error occurred.");
  }
}

// Экспортируем экземпляр по умолчанию
export const authApi = new AuthApi();

// Для использования с кастомным URL
export default AuthApi;
