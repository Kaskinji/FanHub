export interface FandomPageData {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  rules: string;

  postsPreviews: Array<{
    id: number;
    title: string;
    image: string;
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
  type: 'like' | 'fire'; 
  count: number;
}