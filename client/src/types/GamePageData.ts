export interface GamePageData {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  stats: {
    fandoms: number;
    posts: number;
  };
  details: {
    genre: string;
    publisher: string;
    developer: string;
    releaseDate: string;
  };
  fandoms: Array<{
    id: number;
    title: string;
    description: string;
    image: string;
  }>;
}