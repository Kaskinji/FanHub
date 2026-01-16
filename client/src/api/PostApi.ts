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
  reactionType: ReactionType | number; 
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
  categoryId: number; 
  mediaContent?: string; 
}

export interface PostUpdateDto {
  title?: string;
  content?: string;
  categoryId?: number;
  mediaContent?: string; 
}

export class PostApi {
  private readonly baseUrl: string;
  private categoriesCache: Category[] | null = null;
  private categoriesMap: Map<number, string> = new Map();

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  
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

  
  private getCategoryName(categoryId: number): string {
    return this.categoriesMap.get(categoryId) || "General";
  }

  
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
        
        
        if (error.response?.status === 404) {
          const errorMessage = error.response?.data?.message || error.response?.statusText || 'Not Found';
          
          if (errorMessage.includes('Category')) {
            throw new Error(`Category not found. ${errorMessage}. Please select a valid category.`);
          }
          throw new Error(`Unable to create post. Endpoint not found (404). ${errorMessage}. Please check if the server endpoint /api/posts exists.`);
        }
      }
      this.handlePostError(error, "Failed to create post");
    }
  }

  
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



  
  private getImageUrl(imageUrl?: string | null): string | null {
    if (!imageUrl || imageUrl.trim() === "") {
      return null;
    }
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    return `${SERVER_CONFIG.BASE_URL}${imageUrl}`;
  }

  
  private async getPostReactionsPreview(postId: number): Promise<Array<{ type: "like" | "dislike"; count: number }>> {
    try {
      
      const postReactions = await reactionApi.getPostReactions(postId);
      
      
      const reactionCounts: Partial<Record<"like" | "dislike", number>> = {
        like: 0,
        dislike: 0
      };

      postReactions.forEach((reaction) => {
        
        const type = ReactionTypeMap[reaction.type];
        if (type === "like" || type === "dislike") {
          reactionCounts[type] = (reactionCounts[type] || 0) + 1;
        }
      });

      
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
      
      return [
        { type: 'like', count: 0 },
        { type: 'dislike', count: 0 },
      ];
    }
  }

  
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
    
    if (!post || !post.id || !post.title) {
      console.warn("Invalid post data:", post);
      return null;
    }

    
    if (!post.userId) {
      console.warn("Post missing userId:", post);
      return null;
    }

    
    const imageUrl = this.getImageUrl(post.mediaContent);

    
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

    
    const reactions = await this.getPostReactionsPreview(post.id);

    return {
      id: post.id,
      title: post.title,
      image: imageUrl,
      author,
      reactions,
    };
  }

  
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

    
    const adaptedPosts = await Promise.all(
      posts.map((post) => this.adaptToPostPreview(post))
    );

    return adaptedPosts.filter((post): post is NonNullable<typeof post> => post !== null);
  }

  
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
    
    if (!post || !post.id || !post.title) {
      console.warn("Invalid post data:", post);
      return null;
    }

    
    if (!post.userId) {
      console.warn("Post missing userId:", post);
      return null;
    }

    
    const imageUrl = this.getImageUrl(post.mediaContent);

    
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

    
    const adaptedPosts = await Promise.all(
      posts.map((post) => this.adaptStatsDtoToPostPreview(post))
    );

    return adaptedPosts.filter((post): post is NonNullable<typeof post> => post !== null);
  }

  
  async adaptToFullPost(post: PostReadDto): Promise<Post | null> {
    if (!post || !post.id || !post.title) {
      console.warn("Invalid post data:", post);
      return null;
    }

    if (!post.userId) {
      console.warn("Post missing userId:", post);
      return null;
    }

    
    await this.loadCategoriesIfNeeded();

    
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

    
    const imageUrl = this.getImageUrl(post.mediaContent);

    
    const reactions: Array<{ type: "like" | "dislike"; count: number }> = [];

    
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
      commentCount: 0, 
    };
  }

  
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

  
  async adaptStatsDtoToFullPost(post: PostStatsDto): Promise<Post | null> {
    if (!post || !post.id || !post.title) {
      console.warn("Invalid post data:", post);
      return null;
    }

    if (!post.userId) {
      console.warn("Post missing userId:", post);
      return null;
    }

    
    await this.loadCategoriesIfNeeded();

    
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

    
    const imageUrl = this.getImageUrl(post.mediaContent);

    
    let reactions: Array<{ type: "like" | "dislike"; count: number; userReacted: boolean }> = [];
    try {
      const userId = Number(localStorage.getItem("user_id")) || undefined;
      const postReactions = await reactionApi.getPostReactions(post.id);

      
      const reactionCounts: Partial<
        Record<ReactionType, { count: number; userReacted: boolean }>
      > = {
        like: { count: 0, userReacted: false },
        dislike: { count: 0, userReacted: false },
      };

      
      postReactions.forEach((reaction) => {
        const type = ReactionTypeMap[reaction.type];
        if (type && reactionCounts[type]) {
          reactionCounts[type].count++;
          if (userId && reaction.userId === userId) {
            reactionCounts[type].userReacted = true;
          }
        }
      });

      
      post.reactionsSummaries.forEach((summary) => {
        const reactionType = typeof summary.reactionType === 'number' 
          ? ReactionTypeMap[summary.reactionType] || 'like'
          : summary.reactionType;
        
        if (reactionCounts[reactionType]) {
          reactionCounts[reactionType].count = summary.count;
        }
      });

      
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


export const postApi = new PostApi();


export default PostApi;
