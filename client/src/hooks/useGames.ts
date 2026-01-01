// hooks/useGames.ts
import { useState, useCallback } from 'react';
import { gameApi } from '../api/GameApi';
import type { GamePreview } from '../types/AllGamesPageData';
import { getGameImage } from '../utils/gameImage';

export const useGames = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredGames, setFilteredGames] = useState<GamePreview[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);


  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const gamesData = await gameApi.getGames();
      console.log('Games data from API:', gamesData);
      
      const gamePreviews = gamesData.map(game => ({
        id: game.id,
        name: game.title,
        imageUrl: getGameImage(game.coverImage, game.title)
      }));

      setFilteredGames(gamePreviews); 
      const uniqueGenres = Array.from(
        new Set(gamesData.map(game => game.genre).filter(Boolean))
      ).sort();

      setGenres(uniqueGenres);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load games';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


   const filterByGenreAPI = useCallback(async (genre: string) => {
    try {
      setLoading(true);
      setSelectedGenre(genre);
      setShowGenreFilter(false);
      
      if (genre === 'all') {
        await loadGames();
      } else {
       

        const gamesData = await gameApi.searchGamesByGenre(genre);
        const gamePreviews = gamesData.map(game => ({
          id: game.id,
          name: game.title,
          imageUrl: getGameImage(game.coverImage, game.title)
        }));
        
        setFilteredGames(gamePreviews);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to filter games';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadGames]);


  const toggleGenreFilter = useCallback(() => {
    setShowGenreFilter(prev => !prev);
  }, []);

  
  const resetFilters = useCallback(async () => {
    setSelectedGenre('all');
    setShowGenreFilter(false);
    await loadGames();
  }, [loadGames]);

  const searchGames = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setSelectedGenre('all');
      
      if (!query.trim()) {
        await loadGames();
      } else {
        const gamesData = await gameApi.searchGamesByName(query);
        const gamePreviews = gamesData.map(game => ({
          id: game.id,
          name: game.title,
          imageUrl: getGameImage(game.coverImage, game.title)
        }));
        setFilteredGames(gamePreviews);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search games';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadGames]);

   return {
    games: filteredGames,
    loading,
    error,
    genres,
    selectedGenre,
    showGenreFilter,
    loadGames,
    searchGames,
    filterByGenre: filterByGenreAPI, 
    toggleGenreFilter,
    resetFilters,
    clearError: () => setError(null),
  };
};