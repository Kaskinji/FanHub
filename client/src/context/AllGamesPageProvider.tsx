import type { GamePreview } from "../types/AllGamesPageData";
import { AllGamesContext } from "../context/AllGamesPageContext";
import React, { type ReactNode } from "react";

interface AllGamesProviderProps {
  children: ReactNode;
  gamesData: GamePreview[]; 
}

export const AllGamesPageProvider: React.FC<AllGamesProviderProps> = ({ 
  children,
  gamesData 
}) => {

  const setSearchQuery = (query: string) => {
    console.log("Searching for:", query);
  };
  
  const value = {
    data: gamesData,
    isLoading: false,
    error: undefined,
     setSearchQuery,
      // setCategory, setPage, setSortBy
  };

  return (
    <AllGamesContext.Provider value={value}>
      {children}
    </AllGamesContext.Provider>
  );
};