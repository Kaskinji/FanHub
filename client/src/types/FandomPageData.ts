export interface FandomPageData {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  rules: string;
  subscribersCount: number;
  postsCount: number;
  postsPreviews: Array<{
    id: number;
    title: string;
    image: string | null;
    author: {
        id: number;
        username: string;
        avatar?: string;
    };
    reactions: Reaction[]; 
  }>;

  eventsPreviews: Array<{
    id: number;
    title: string;
    image?: string;
  }>;
}

export interface Reaction {
  type: 'like' | 'dislike'; 
  count: number;
}