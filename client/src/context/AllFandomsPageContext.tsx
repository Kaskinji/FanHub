import { createContext } from "react";
import type { FandomPreview } from "../types/AllFandomsPageData";

interface AllFandomsContextType {
  data: FandomPreview[];
  isLoading: boolean;
  error?: string;
  setSearchQuery: (query: string) => void; // Делаем опциональным
}

export const AllFandomsContext = createContext<AllFandomsContextType | undefined>(undefined);