export interface Post {
  id: number;
  title: string;
  content: string; // Полный текст поста
  excerpt?: string; // Краткое описание для превью
  image?: string;
  author: {
    id: number;
    username: string;
    avatar?: string;
  };
  reactions: Reaction[];
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  commentCount: number;
}

export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt?: string;
  reactions?: Reaction[];
  replies?: Comment[]; // Для вложенных комментариев
}

export interface Reaction {
  type: 'like' | 'fire' | 'heart' | 'laugh' | 'sad';
  count: number;
  userReacted?: boolean;
}

export interface PostsContextData {
  fandomId: number;
  fandomName: string;
}