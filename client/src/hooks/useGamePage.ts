import { useContext } from 'react';
import { GamePageContext } from '../context/GamePageContext';

export const useGamePage = () => {
  const context = useContext(GamePageContext);
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
};