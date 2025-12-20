// context/GameContext.tsx
import { createContext } from 'react';
import type { GamePageContextType } from '../types/GamePageContextType';


export const GamePageContext = createContext<GamePageContextType | undefined>(undefined);

