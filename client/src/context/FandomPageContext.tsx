import { createContext } from 'react';
import type { FandomPageContextType } from '../types/FandomPageContextType';


export const FandomPageContext = createContext<FandomPageContextType | undefined>(undefined);

