// hooks/useGames.ts
import { useState, useCallback, useMemo } from 'react';
import { gameApi } from '../api/GameApi';
import type { GameReadDto } from '../api/GameApi';

export const useGames = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gamesData, setGamesData] = useState<GameReadDto[]>([]); 
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [showGenreFilter, setShowGenreFilter] = useState(false);

  // Преобразуем GameReadDto[] → GamePreview[] (оптимизировано через useMemo)
  const gamesPreview = useMemo(() => 
    gameApi.adaptToGamePreviews(gamesData),
    [gamesData]
  );

  // Извлекаем уникальные жанры (оптимизировано через useMemo)
  const genres = useMemo(() => 
    Array.from(new Set(gamesData.map(game => game.genre).filter(Boolean))).sort(),
    [gamesData]
  );
  
  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const gamesData = await gameApi.getGames();
      setGamesData(gamesData);
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
        setGamesData(gamesData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to filter games';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadGames]);

  const searchGames = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setSelectedGenre('all');
      
      if (!query.trim()) {
        await loadGames(); // Показываем все игры если пустой поиск
      } else {
        const gamesData = await gameApi.searchGamesByName(query);
        setGamesData(gamesData); // ← Обновляем gamesData
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search games';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadGames]);

  const getGameById = useCallback((id: number): GameReadDto | undefined => {
    return gamesData.find(game => game.id === id);
  }, [gamesData]);

  const toggleGenreFilter = useCallback(() => {
    setShowGenreFilter(prev => !prev);
  }, []);

  const resetFilters = useCallback(async () => {
    setSelectedGenre('all');
    setShowGenreFilter(false);
    await loadGames();
  }, [loadGames]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Для отображения списка (GamePreview[])
    games: gamesPreview,
    
    // Для навигации (GameReadDto[])
    gamesData,
    
    // UI состояния
    loading,
    error,
    genres,
    selectedGenre,
    showGenreFilter,
    
    // Методы
    loadGames,
    searchGames,
    filterByGenre: filterByGenreAPI,
    toggleGenreFilter,
    resetFilters,
    clearError,
    getGameById,
  };
};