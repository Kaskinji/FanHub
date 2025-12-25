import React, { type ReactNode } from "react";
import type { FandomPageData } from "../types/FandomPageData";
import { FandomPageContext } from "./FandomPageContext";

interface FandomPageProviderProps {
  children: ReactNode;
  fandomData: FandomPageData;
}

export const FandomPageProvider: React.FC<FandomPageProviderProps> = ({ 
  children, 
  fandomData 
}) => {
  const value = {
    fandom: fandomData,
    isLoading: false,
    error: undefined
  };

  return (
    <FandomPageContext.Provider value={value}>
      {children}
    </FandomPageContext.Provider>
  );
};