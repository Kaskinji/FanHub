export interface Post {
  id: number;
  title: string;
  content: string; 
  excerpt?: string; 
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
  replies?: Comment[]; 
}

export interface Reaction {
  type: 'like' | 'dislike';
  count: number;
  userReacted?: boolean;
}

export interface PostsContextData {
  fandomId: number;
  fandomName: string;
  postId?: number; 
}