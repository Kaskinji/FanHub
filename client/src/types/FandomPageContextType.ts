import type { FandomPageData } from "./FandomPageData";

export interface FandomPageContextType {
  fandom: FandomPageData;
  isLoading: boolean;
  error: string | undefined;
}