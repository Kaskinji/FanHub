import React, { type ReactNode } from "react";
import type { GamePageData } from "../types/GamePageData";
import { GamePageContext } from "./GamePageContext";

interface GamePageProviderProps {
  children: ReactNode;
  gameData: GamePageData;
}

export const GamePageProvider: React.FC<GamePageProviderProps> = ({ 
  children, 
  gameData 
}) => {
  const value = {
    game: gameData,
    isLoading: false,
    error: undefined
  };

  return (
    <GamePageContext.Provider value={value}>
      {children}
    </GamePageContext.Provider>
  );
};