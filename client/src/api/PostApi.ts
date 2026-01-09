import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import { SERVER_CONFIG } from "../config/apiConfig";
import { userApi } from "./UserApi";
import { categoryApi } from "./CategoryApi";
import { reactionApi, ReactionTypeMap } from "./ReactionApi";
import type { Post } from "../types/Post";
import type { Category } from "../types/Category";
import type { ReactionType } from "./ReactionApi";

export interface PostReadDto {
  id: number;
  userId: number;
  fandomId: number;
  categoryId: number;
  title: string | null;
  content: string;
  postDate: string;
  mediaContent: string;
}

export interface ReactionSummaryDto {
  reactionType: ReactionType | number; // Может быть числом с сервера или строкой после преобразования
  count: number;
}

export interface PostStatsDto {
  id: number;
  userId: number;
  fandomId: number;
  categoryId: number;
  title: string | null;
  postDate: string;
  content: string;
  mediaContent: string;
  commentsCount: number;
  reactionsSummaries: ReactionSummaryDto[];
}

export interface PostCreateDto {
  title: string;
  content: string;
  fandomId: number;
  categoryId: number; // Обязательное поле на бэкенде
  mediaContent?: string; // Соответствует MediaContent на бэкенде (вместо image)
}

export interface PostUpdateDto {
  title?: string;
  content?: string;
  categoryId?: number;
  mediaContent?: string; // Соответствует MediaContent на бэкенде (вместо image)
}

export class PostApi {
  private readonly baseUrl: string;
  private categoriesCache: Category[] | null = null;
  private categoriesMap: Map<number, string> = new Map();

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Загрузить категории и создать маппинг
   */
  private async loadCategoriesIfNeeded(): Promise<void> {
    if (this.categoriesCache === null) {
      try {
        this.categoriesCache = await categoryApi.getAllCategories();
        this.categoriesMap.clear();
        this.categoriesCache.forEach(category => {
          this.categoriesMap.set(category.id, category.name);
        });
      } catch (error) {
        console.warn("Failed to load categories, using fallback:", error);
        this.categoriesCache = [];
      }
    }
  }

  /**
   * Получить название категории по ID
   */
  private getCategoryName(categoryId: number): string {
    return this.categoriesMap.get(categoryId) || "General";
  }

  /**
   * Получить все посты
   */
  async getAllPosts(): Promise<PostReadDto[]> {
    try {
      const response = await axios.get<PostReadDto[]>(
        `${this.baseUrl}/posts`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handlePostError(error, "Failed to fetch posts");
    }
  }

  /**
   * Получить посты по названию категории
   */
  async getPostsByCategoryName(categoryName: string): Promise<PostStatsDto[]> {
    try {
      const response = await axios.get<PostStatsDto[]>(
        `${this.baseUrl}/posts/category/name`,
        {
          params: { categoryName },
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handlePostError(
        error,
        `Failed to fetch posts by category name: ${categoryName}`
      );
    }
  }

  /**
   * Получить посты по ID категории
   */
  async getPostsByCategoryId(categoryId: number): Promise<PostStatsDto[]> {
    try {
      const response = await axios.get<PostStatsDto[]>(
        `${this.baseUrl}/posts/category/${categoryId}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handlePostError(
        error,
        `Failed to fetch posts by category ID: ${categoryId}`
      );
    }
  }

  /**
   * Поиск постов по категории
   */
  async searchPosts(
    categoryId?: number,
    categoryName?: string
  ): Promise<PostStatsDto[]> {
    try {
      const response = await axios.get<PostStatsDto[]>(
        `${this.baseUrl}/posts/search`,
        {
          params: {
            ...(categoryId !== undefined && { categoryId }),
            ...(categoryName && { categoryName }),
          },
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handlePostError(error, "Failed to search posts");
    }
  }

  /**
   * Получить пост по ID
   */
  async getPostById(id: number): Promise<PostReadDto> {
    try {
      const response = await axios.get<PostReadDto>(
        `${this.baseUrl}/posts/${id}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handlePostError(error, `Failed to fetch post with ID ${id}`);
    }
  }

  /**
   * Получить популярные посты
   */
  async getPopularPosts(limit?: number): Promise<PostStatsDto[]> {
    try {
      const response = await axios.get<PostStatsDto[]>(
        `${this.baseUrl}/posts/popular`,
        {
          params: limit !== undefined ? { limit } : {},
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handlePostError(
        error,
        `Failed to fetch popular posts with limit ${limit}`
      );
    }
  }

  /**
   * Получить популярные посты по фандому
   */
  async getPopularPostsByFandom(
    fandomId: number,
    limit?: number
  ): Promise<PostStatsDto[]> {
    try {
      const response = await axios.get<PostStatsDto[]>(
        `${this.baseUrl}/posts/fandom/${fandomId}/popular`,
        {
          params: limit !== undefined ? { limit } : {},
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handlePostError(
        error,
        `Failed to fetch popular posts for fandom ID ${fandomId} with limit ${limit}`
      );
    }
  }

  /**
   * Получить пост со статистикой по ID
   */
  async getPostWithStatsById(id: number): Promise<PostStatsDto> {
    try {
      const response = await axios.get<PostStatsDto>(
        `${this.baseUrl}/posts/with-stats/${id}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      this.handlePostError(error, `Failed to fetch post with stats for ID ${id}`);
    }
  }

  /**
   * Создать новый пост
   */
  async createPost(postData: PostCreateDto): Promise<number> {
    try {
      console.log('Creating post with data:', postData);
      console.log('POST URL:', `${this.baseUrl}/posts`);
      
      const response = await axios.post<number>(
        `${this.baseUrl}/posts`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          timeout: 10000,
        }
      );

      console.log('Post created successfully with ID:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating post:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('Status text:', error.response?.statusText);
        
        // Улучшенная обработка ошибок на основе сообщения от сервера
        if (error.response?.status === 404) {
          const errorMessage = error.response?.data?.message || error.response?.statusText || 'Not Found';
          // Если ошибка связана с категорией
          if (errorMessage.includes('Category')) {
            throw new Error(`Category not found. ${errorMessage}. Please select a valid category.`);
          }
          throw new Error(`Unable to create post. Endpoint not found (404). ${errorMessage}. Please check if the server endpoint /api/posts exists.`);
        }
      }
      this.handlePostError(error, "Failed to create post");
    }
  }

  /**
   * Обновить пост
   */
  async updatePost(id: number, postData: PostUpdateDto): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/posts/${id}`, postData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        timeout: 10000,
      });
    } catch (error) {
      this.handlePostError(error, `Failed to update post with ID ${id}`);
    }
  }

  /**
   * Удалить пост
   */
  async deletePost(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/posts/${id}`, {
        withCredentials: true,
        timeout: 10000,
      });
    } catch (error) {
      this.handlePostError(error, `Failed to delete post with ID ${id}`);
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
   * Получить реакции поста и построить массив реакций по типам
   */
  private async getPostReactionsPreview(postId: number): Promise<Array<{ type: "like" | "dislike"; count: number }>> {
    try {
      // Получаем реакции конкретного поста через GET /reactions/post/{postId}
      const postReactions = await reactionApi.getPostReactions(postId);
      
      // Подсчитываем количество реакций по типам
      const reactionCounts: Partial<Record<"like" | "dislike", number>> = {
        like: 0,
        dislike: 0
      };

      postReactions.forEach((reaction) => {
        // Преобразуем числовой тип реакции в строковый
        const type = ReactionTypeMap[reaction.type];
        if (type === "like" || type === "dislike") {
          reactionCounts[type] = (reactionCounts[type] || 0) + 1;
        }
      });

      // Преобразуем в массив, показывая только like и dislike
      const result: Array<{ type: "like" | "dislike"; count: number }> = [];
      
      result.push({
        type: 'like',
        count: reactionCounts.like ?? 0,
      });
      result.push({
        type: 'dislike',
        count: reactionCounts.dislike ?? 0,
      });

      return result;
    } catch (error) {
      console.warn(`Failed to load reactions for post ${postId}:`, error);
      // Возвращаем пустые реакции при ошибке
      return [
        { type: 'like', count: 0 },
        { type: 'dislike', count: 0 },
      ];
    }
  }

  /**
   * Преобразовать PostReadDto в формат для превью поста (с загрузкой автора и реакций)
   */
  async adaptToPostPreview(post: PostReadDto): Promise<{
    id: number;
    title: string;
    image: string | null;
    author: {
      id: number;
      username: string;
      avatar?: string;
    };
    reactions: Array<{ type: "like" | "dislike"; count: number }>;
  } | null> {
    // Проверяем наличие обязательных полей
    if (!post || !post.id || !post.title) {
      console.warn("Invalid post data:", post);
      return null;
    }

    // Проверяем наличие userId
    if (!post.userId) {
      console.warn("Post missing userId:", post);
      return null;
    }

    // Преобразуем MediaContent в image
    const imageUrl = this.getImageUrl(post.mediaContent);

    // Загружаем данные автора
    let author: { id: number; username: string; avatar?: string };
    try {
      const userData = await userApi.getUserById(post.userId);
      const avatarUrl = userData.avatar ? this.getImageUrl(userData.avatar) : null;
      author = {
        id: userData.id,
        username: userData.username,
        avatar: avatarUrl || undefined,
      };
    } catch (error) {
      // Для 401 (Unauthorized) используем fallback без логирования
      const isUnauthorized = 
        (axios.isAxiosError(error) && error.response?.status === 401) ||
        (error instanceof Error && (error as Error & { status?: number }).status === 401) ||
        (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message.includes('Unauthorized')));
      
      if (isUnauthorized) {
        author = {
          id: post.userId,
          username: "User",
          avatar: undefined,
        };
      } else {
        console.warn(`Failed to load user ${post.userId}, using fallback`);
        author = {
          id: post.userId,
          username: "User",
          avatar: undefined,
        };
      }
    }

    // Загружаем реакции поста
    const reactions = await this.getPostReactionsPreview(post.id);

    return {
      id: post.id,
      title: post.title,
      image: imageUrl,
      author,
      reactions,
    };
  }

  /**
   * Преобразовать массив PostReadDto в формат для превью постов
   */
  async adaptToPostPreviews(
    posts: PostReadDto[]
  ): Promise<Array<{
    id: number;
    title: string;
    image: string | null;
    author: {
      id: number;
      username: string;
      avatar?: string;
    };
    reactions: Array<{ type: "like" | "dislike"; count: number }>;
  }>> {
    if (!posts || !Array.isArray(posts)) {
      console.warn("Invalid posts array:", posts);
      return [];
    }

    // Загружаем все посты параллельно
    const adaptedPosts = await Promise.all(
      posts.map((post) => this.adaptToPostPreview(post))
    );

    return adaptedPosts.filter((post): post is NonNullable<typeof post> => post !== null);
  }

  /**
   * Преобразовать PostStatsDto в формат для превью поста (с загрузкой автора, реакции уже включены)
   */
  async adaptStatsDtoToPostPreview(post: PostStatsDto): Promise<{
    id: number;
    title: string;
    image: string | null;
    author: {
      id: number;
      username: string;
      avatar?: string;
    };
    reactions: Array<{ type: "like" | "dislike"; count: number }>;
  } | null> {
    // Проверяем наличие обязательных полей
    if (!post || !post.id || !post.title) {
      console.warn("Invalid post data:", post);
      return null;
    }

    // Проверяем наличие userId
    if (!post.userId) {
      console.warn("Post missing userId:", post);
      return null;
    }

    // Преобразуем MediaContent в image
    const imageUrl = this.getImageUrl(post.mediaContent);

    // Загружаем данные автора
    let author: { id: number; username: string; avatar?: string };
    try {
      const userData = await userApi.getUserById(post.userId);
      const avatarUrl = userData.avatar ? this.getImageUrl(userData.avatar) : null;
      author = {
        id: userData.id,
        username: userData.username,
        avatar: avatarUrl || undefined,
      };
    } catch (error) {
      // Для 401 (Unauthorized) используем fallback без логирования
      const isUnauthorized = 
        (axios.isAxiosError(error) && error.response?.status === 401) ||
        (error instanceof Error && (error as Error & { status?: number }).status === 401) ||
        (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message.includes('Unauthorized')));
      
      if (isUnauthorized) {
        author = {
          id: post.userId,
          username: "User",
          avatar: undefined,
        };
      } else {
        console.warn(`Failed to load user ${post.userId}, using fallback`);
        author = {
          id: post.userId,
          username: "User",
          avatar: undefined,
        };
      }
    }

    // Преобразуем ReactionsSummaries в формат реакций (реакции уже включены в DTO)
    const reactions: Array<{ type: "like" | "dislike"; count: number }> = 
      post.reactionsSummaries.map((summary) => {
        const reactionType = typeof summary.reactionType === 'number' 
          ? ReactionTypeMap[summary.reactionType] || 'like'
          : summary.reactionType;
        return {
          type: reactionType,
          count: summary.count,
        };
      });

    return {
      id: post.id,
      title: post.title,
      image: imageUrl,
      author,
      reactions,
    };
  }

  /**
   * Преобразовать массив PostStatsDto в формат для превью постов
   */
  async adaptStatsDtosToPostPreviews(
    posts: PostStatsDto[]
  ): Promise<Array<{
    id: number;
    title: string;
    image: string | null;
    author: {
      id: number;
      username: string;
      avatar?: string;
    };
    reactions: Array<{ type: "like" | "dislike"; count: number }>;
  }>> {
    if (!posts || !Array.isArray(posts)) {
      console.warn("Invalid posts array:", posts);
      return [];
    }

    // Загружаем все посты параллельно
    const adaptedPosts = await Promise.all(
      posts.map((post) => this.adaptStatsDtoToPostPreview(post))
    );

    return adaptedPosts.filter((post): post is NonNullable<typeof post> => post !== null);
  }

  /**
   * Преобразовать PostReadDto в полный формат Post с загрузкой данных автора
   */
  async adaptToFullPost(post: PostReadDto): Promise<Post | null> {
    if (!post || !post.id || !post.title) {
      console.warn("Invalid post data:", post);
      return null;
    }

    if (!post.userId) {
      console.warn("Post missing userId:", post);
      return null;
    }

    // Загружаем категории если нужно
    await this.loadCategoriesIfNeeded();

    // Загружаем данные автора
    let author: { id: number; username: string; avatar?: string };
    try {
      const userData = await userApi.getUserById(post.userId);
      const avatarUrl = userData.avatar ? this.getImageUrl(userData.avatar) : null;
      author = {
        id: userData.id,
        username: userData.username,
        avatar: avatarUrl || undefined,
      };
    } catch (error) {
      // Для 401 (Unauthorized) используем fallback без логирования
      const isUnauthorized = 
        (axios.isAxiosError(error) && error.response?.status === 401) ||
        (error instanceof Error && (error as Error & { status?: number }).status === 401) ||
        (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message.includes('Unauthorized')));
      
      if (isUnauthorized) {
        author = {
          id: post.userId,
          username: "User",
          avatar: undefined,
        };
      } else {
        console.warn(`Failed to load user ${post.userId}, using fallback`);
        author = {
          id: post.userId,
          username: "User",
          avatar: undefined,
        };
      }
    }

    // Преобразуем MediaContent в image
    const imageUrl = this.getImageUrl(post.mediaContent);

    // Для PostReadDto нет реакций, возвращаем пустой массив
    const reactions: Array<{ type: "like" | "dislike"; count: number }> = [];

    // Создаем excerpt из content (первые 150 символов)
    const excerpt =
      post.content.length > 150
        ? post.content.substring(0, 150) + "..."
        : post.content;

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt,
      image: imageUrl || undefined,
      author,
      reactions,
      category: this.getCategoryName(post.categoryId), // Используем реальное название категории
      tags: [],
      createdAt: post.postDate,
      commentCount: 0, // Будет обновлено при загрузке комментариев
    };
  }

  /**
   * Преобразовать массив PostReadDto в полный формат Post
   */
  async adaptToFullPosts(posts: PostReadDto[]): Promise<Post[]> {
    if (!posts || !Array.isArray(posts)) {
      console.warn("Invalid posts array:", posts);
      return [];
    }

    const adaptedPosts = await Promise.all(
      posts.map((post) => this.adaptToFullPost(post))
    );

    return adaptedPosts.filter(
      (post): post is Post => post !== null
    );
  }

  /**
   * Преобразовать PostStatsDto в полный формат Post с загрузкой данных автора
   */
  async adaptStatsDtoToFullPost(post: PostStatsDto): Promise<Post | null> {
    if (!post || !post.id || !post.title) {
      console.warn("Invalid post data:", post);
      return null;
    }

    if (!post.userId) {
      console.warn("Post missing userId:", post);
      return null;
    }

    // Загружаем категории если нужно
    await this.loadCategoriesIfNeeded();

    // Загружаем данные автора
    let author: { id: number; username: string; avatar?: string };
    try {
      const userData = await userApi.getUserById(post.userId);
      const avatarUrl = userData.avatar ? this.getImageUrl(userData.avatar) : null;
      author = {
        id: userData.id,
        username: userData.username,
        avatar: avatarUrl || undefined,
      };
    } catch (error) {
      // Для 401 (Unauthorized) используем fallback без логирования
      const isUnauthorized = 
        (axios.isAxiosError(error) && error.response?.status === 401) ||
        (error instanceof Error && (error as Error & { status?: number }).status === 401) ||
        (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message.includes('Unauthorized')));
      
      if (isUnauthorized) {
        author = {
          id: post.userId,
          username: "User",
          avatar: undefined,
        };
      } else {
        console.warn(`Failed to load user ${post.userId}, using fallback`);
        author = {
          id: post.userId,
          username: "User",
          avatar: undefined,
        };
      }
    }

    // Преобразуем MediaContent в image
    const imageUrl = this.getImageUrl(post.mediaContent);

    // Загружаем реакции с информацией о том, поставил ли пользователь реакцию
    let reactions: Array<{ type: "like" | "dislike"; count: number; userReacted: boolean }> = [];
    try {
      const userId = Number(localStorage.getItem("user_id")) || undefined;
      const postReactions = await reactionApi.getPostReactions(post.id);

      // Создаем мапу для подсчета реакций и проверки userReacted
      const reactionCounts: Partial<
        Record<ReactionType, { count: number; userReacted: boolean }>
      > = {
        like: { count: 0, userReacted: false },
        dislike: { count: 0, userReacted: false },
      };

      // Подсчитываем реакции из postReactions
      postReactions.forEach((reaction) => {
        const type = ReactionTypeMap[reaction.type];
        if (type && reactionCounts[type]) {
          reactionCounts[type].count++;
          if (userId && reaction.userId === userId) {
            reactionCounts[type].userReacted = true;
          }
        }
      });

      // Используем данные из reactionsSummaries для count, но userReacted из postReactions
      post.reactionsSummaries.forEach((summary) => {
        const reactionType = typeof summary.reactionType === 'number' 
          ? ReactionTypeMap[summary.reactionType] || 'like'
          : summary.reactionType;
        
        if (reactionCounts[reactionType]) {
          reactionCounts[reactionType].count = summary.count;
        }
      });

      // Формируем массив реакций
      reactions = [
        {
          type: "like" as ReactionType,
          count: reactionCounts.like?.count ?? 0,
          userReacted: reactionCounts.like?.userReacted ?? false,
        },
        {
          type: "dislike" as ReactionType,
          count: reactionCounts.dislike?.count ?? 0,
          userReacted: reactionCounts.dislike?.userReacted ?? false,
        },
      ];
    } catch {
      // Если не удалось загрузить реакции, используем только данные из reactionsSummaries
      reactions = post.reactionsSummaries.map((summary) => {
        const reactionType = typeof summary.reactionType === 'number' 
          ? ReactionTypeMap[summary.reactionType] || 'like'
          : summary.reactionType;
        return {
          type: reactionType,
          count: summary.count,
          userReacted: false,
        };
      });
    }

    // Создаем excerpt из content (первые 150 символов)
    const excerpt =
      post.content.length > 150
        ? post.content.substring(0, 150) + "..."
        : post.content;

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt,
      image: imageUrl || undefined,
      author,
      reactions,
      category: this.getCategoryName(post.categoryId),
      tags: [],
      createdAt: post.postDate,
      commentCount: post.commentsCount,
    };
  }

  /**
   * Преобразовать массив PostStatsDto в полный формат Post
   */
  async adaptStatsDtosToFullPosts(posts: PostStatsDto[]): Promise<Post[]> {
    if (!posts || !Array.isArray(posts)) {
      console.warn("Invalid posts array:", posts);
      return [];
    }

    const adaptedPosts = await Promise.all(
      posts.map((post) => this.adaptStatsDtoToFullPost(post))
    );

    return adaptedPosts.filter(
      (post): post is Post => post !== null
    );
  }

  /**
   * Обработка ошибок
   */
  private handlePostError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || defaultMessage;

        switch (status) {
          case 400:
            throw new Error("Invalid post data.");
          case 401:
            throw new Error("Unauthorized. Please login again.");
          case 403:
            throw new Error("Forbidden. You don't have permission.");
          case 404:
            throw new Error("Post not found.");
          case 409:
            throw new Error("Post with this title already exists.");
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
export const postApi = new PostApi();

// Для использования с кастомным URL
export default PostApi;
