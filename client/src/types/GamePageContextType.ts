import type { GamePageData } from "./GamePageData";

export interface GamePageContextType {
  game: GamePageData;
  isLoading: boolean;
  error: string | undefined;
}