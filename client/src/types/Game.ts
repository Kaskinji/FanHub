export interface Game {
    id: number;
    name: string;
    imageUrl?: string;
}
export interface GameContextData {
  gameId: number;
  gameTitle: string;
}