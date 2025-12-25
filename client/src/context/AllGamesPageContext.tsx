import { createContext } from "react";
import type { GamePreview } from "../types/AllGamesPageData";

interface AllGamesContextType {
  data: GamePreview[];
  isLoading: boolean;
  error?: string;
  setSearchQuery: (query: string) => void; // Делаем опциональным
}

export const AllGamesContext = createContext<AllGamesContextType | undefined>(undefined);