import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import { SERVER_CONFIG } from "../config/apiConfig";
import type { Comment as CommentType } from "../types/Post";

export interface CommentReadDto {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentCommentId?: number;
}

export interface CommentShowDto {
  id: number;
  postId: number;
  userId: number;
  content: string;
  commentDate: string;
  authorName?: string;
  authorUsername?: string;
  authorAvatar?: string | null;
  // Альтернативная структура (если сервер вернет объект author)
  author?: {
    id: number;
    username: string;
    avatar?: string;
  };
  // Для обратной совместимости
  createdAt?: string;
  updatedAt?: string;
  parentCommentId?: number;
}

export interface CommentCreateDto {
  postId: number;
  content: string;
  parentCommentId?: number;
}

export interface CommentUpdateDto {
  content?: string;
}

export class CommentApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Получить все комментарии с данными автора
   */
  async getAllComments(): Promise<CommentShowDto[]> {
    try {
      const response = await axios.get<CommentShowDto[]>(
        `${this.baseUrl}/comments`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleCommentError(error, "Failed to fetch comments");
    }
  }

  /**
   * Получить комментарии по ID поста
   */
  async getCommentsByPostId(postId: number): Promise<CommentShowDto[]> {
    try {
      const response = await axios.get<CommentShowDto[]>(
        `${this.baseUrl}/comments/post/${postId}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data || [];
    } catch (error) {
      // Если 404 - это нормально, значит у поста просто нет комментариев
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      
      // Для 401 (Unauthorized) возвращаем пустой массив без логирования
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return [];
      }
      
      // Для других ошибок пробрасываем исключение
      this.handleCommentError(
        error,
        `Failed to fetch comments for post ID ${postId}`
      );
    }
  }

  /**
   * Получить комментарий по ID
   */
  async getCommentById(id: number): Promise<CommentReadDto> {
    try {
      const response = await axios.get<CommentReadDto>(
        `${this.baseUrl}/comments/${id}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handleCommentError(error, `Failed to fetch comment with ID ${id}`);
    }
  }

  /**
   * Создать новый комментарий
   */
  async createComment(commentData: CommentCreateDto): Promise<number> {
    try {
      const response = await axios.post<number>(
        `${this.baseUrl}/comments`,
        commentData,
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
      this.handleCommentError(error, "Failed to create comment");
    }
  }

  /**
   * Обновить комментарий
   */
  async updateComment(id: number, commentData: CommentUpdateDto): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/comments/${id}`, commentData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        timeout: 10000,
      });
    } catch (error) {
      this.handleCommentError(error, `Failed to update comment with ID ${id}`);
    }
  }

  /**
   * Удалить комментарий
   */
  async deleteComment(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/comments/${id}`, {
        withCredentials: true,
        timeout: 10000,
      });
    } catch (error) {
      this.handleCommentError(error, `Failed to delete comment with ID ${id}`);
    }
  }

  /**
   * Преобразовать URL изображения
   */
  private getImageUrl(imageUrl?: string | null): string | null {
    if (!imageUrl || imageUrl.trim() === "") {
      return null;
    }
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    return `${SERVER_CONFIG.BASE_URL}${imageUrl}`;
  }

  /**
   * Преобразовать CommentShowDto в формат Comment
   */
  adaptToComment(comment: CommentShowDto): CommentType | null {
    if (!comment || !comment.id || !comment.content) {
      console.warn("Invalid comment data:", comment);
      return null;
    }

    // Определяем данные автора из разных возможных структур
    let authorId: number;
    let authorUsername: string;
    let authorAvatar: string | undefined;

    if (comment.author) {
      // Если есть объект author (старая структура)
      authorId = comment.author.id;
      authorUsername = comment.author.username;
      authorAvatar = comment.author.avatar
        ? this.getImageUrl(comment.author.avatar) || undefined
        : undefined;
    } else if (comment.userId && (comment.authorName || comment.authorUsername)) {
      // Если есть плоская структура (новая структура)
      // authorName содержит username для отображения, authorUsername может содержать login
      authorId = comment.userId;
      authorUsername = comment.authorName || comment.authorUsername || 'Unknown';
      authorAvatar = comment.authorAvatar
        ? this.getImageUrl(comment.authorAvatar) || undefined
        : undefined;
    } else {
      console.warn("Comment missing author data:", comment);
      return null;
    }

    // Используем commentDate или createdAt
    const createdAt = comment.commentDate || comment.createdAt || new Date().toISOString();

    const adapted: CommentType = {
      id: comment.id,
      content: comment.content,
      author: {
        id: authorId,
        username: authorUsername,
        avatar: authorAvatar,
      },
      createdAt: createdAt,
      updatedAt: comment.updatedAt,
      reactions: [],
      replies: [],
    };

    return adapted;
  }

  /**
   * Преобразовать массив CommentShowDto в формат Comment
   */
  adaptToComments(comments: CommentShowDto[]): CommentType[] {
    if (!comments || !Array.isArray(comments)) {
      console.warn("Invalid comments array:", comments);
      return [];
    }

    console.log(`Adapting ${comments.length} comments`);

    const adaptedComments = comments
      .map((comment) => {
        const adapted = this.adaptToComment(comment);
        if (!adapted) {
          console.warn(`Failed to adapt comment ${comment.id}:`, comment);
        }
        return adapted;
      })
      .filter((comment): comment is CommentType => comment !== null);

    console.log(`Successfully adapted ${adaptedComments.length} comments`);

    // Организуем комментарии в иерархию (основные и ответы)
    const commentsMap = new Map<number, CommentType>();
    const rootComments: CommentType[] = [];

    adaptedComments.forEach((comment) => {
      commentsMap.set(comment.id, comment);
    });

    adaptedComments.forEach((comment) => {
      const originalComment = comments.find((c) => c.id === comment.id);
      // Проверяем parentCommentId (может быть в разных полях)
      const parentCommentId = originalComment?.parentCommentId;
      
      if (parentCommentId) {
        const parent = commentsMap.get(parentCommentId);
        if (parent) {
          if (!parent.replies) {
            parent.replies = [];
          }
          parent.replies.push(comment);
        } else {
          console.warn(
            `Parent comment ${parentCommentId} not found for comment ${comment.id}`
          );
          // Если родитель не найден, добавляем как корневой комментарий
          rootComments.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    console.log(`Returning ${rootComments.length} root comments`);
    return rootComments;
  }

  /**
   * Обработка ошибок
   */
  private handleCommentError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || defaultMessage;

        switch (status) {
          case 400:
            throw new Error("Invalid comment data.");
          case 401:
            throw new Error("Unauthorized. Please login again.");
          case 403:
            throw new Error("Forbidden. You don't have permission.");
          case 404:
            throw new Error("Comment not found.");
          case 409:
            throw new Error("Comment already exists.");
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
export const commentApi = new CommentApi();

// Для использования с кастомным URL
export default CommentApi;
