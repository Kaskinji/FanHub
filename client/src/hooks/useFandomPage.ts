import { useContext } from 'react';
import { FandomPageContext } from '../context/FandomPageContext';

export const useFandomPage = () => {
  const context = useContext(FandomPageContext);
  
  if (context === undefined) {
    throw new Error('useFandom must be used within a FandomProvider');
  }
  
  return context;
};