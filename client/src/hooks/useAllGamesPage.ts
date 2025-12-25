import { useContext } from "react";
import { AllGamesContext } from "../context/AllGamesPageContext";

export const useAllGames = () => {
  const context = useContext(AllGamesContext);
  
  if (!context) {
    throw new Error(
      "useAllGames must be used within AllGamesProvider"
    );
  }
  
  return context;
};