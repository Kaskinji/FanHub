// hooks/useGames.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import { gameApi } from '../api/GameApi';
import type { GameReadDto } from '../api/GameApi';

export const useGames = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allGamesData, setAllGamesData] = useState<GameReadDto[]>([]); // Исходный список всех игр
  const [gamesData, setGamesData] = useState<GameReadDto[]>([]); // Отфильтрованные игры
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(''); // Поисковый запрос
  const [showGenreFilter, setShowGenreFilter] = useState(false);

  // Функция сортировки (та же логика, что в SearchDropdown)
  const sortGames = (games: GameReadDto[], query: string): GameReadDto[] => {
    if (!query.trim()) return games;
    
    const lowerQuery = query.toLowerCase();
    
    // Сортируем игры по релевантности
    return [...games].sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      
      // Точное совпадение - высший приоритет
      if (titleA === lowerQuery && titleB !== lowerQuery) return -1;
      if (titleA !== lowerQuery && titleB === lowerQuery) return 1;
      if (titleA === lowerQuery && titleB === lowerQuery) return 0;
      
      // Начинается с запроса - высокий приоритет
      const startsWithA = titleA.startsWith(lowerQuery);
      const startsWithB = titleB.startsWith(lowerQuery);
      
      if (startsWithA && !startsWithB) return -1;
      if (!startsWithA && startsWithB) return 1;
      
      // Если оба начинаются с запроса - сортируем по длине (короче первым)
      if (startsWithA && startsWithB) {
        return titleA.length - titleB.length;
      }
      
      // По позиции первого вхождения (раньше = выше)
      const positionA = titleA.indexOf(lowerQuery);
      const positionB = titleB.indexOf(lowerQuery);
      
      if (positionA !== positionB) {
        return positionA - positionB;
      }
      
      // Если позиция одинаковая - сортируем по длине (короче первым)
      return titleA.length - titleB.length;
    });
  };

  // Применяем фильтры локально к загруженным играм
  const filteredGames = useMemo(() => {
    let filtered = [...allGamesData];
    
    // Фильтр по жанру
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(game => game.genre === selectedGenre);
    }
    
    // Фильтр по названию
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(game => 
        game.title.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Применяем сортировку, если есть поисковый запрос
    if (searchQuery.trim()) {
      filtered = sortGames(filtered, searchQuery);
    }
    
    return filtered;
  }, [allGamesData, selectedGenre, searchQuery]);

  // Обновляем gamesData когда изменяются фильтры
  useEffect(() => {
    setGamesData(filteredGames);
  }, [filteredGames]);

  // Преобразуем GameReadDto[] → GamePreview[] (оптимизировано через useMemo)
  const gamesPreview = useMemo(() => 
    gameApi.adaptToGamePreviews(gamesData),
    [gamesData]
  );

  // Извлекаем уникальные жанры из всех загруженных игр (оптимизировано через useMemo)
  const genres = useMemo(() => 
    Array.from(new Set(allGamesData.map(game => game.genre).filter(Boolean))).sort(),
    [allGamesData]
  );
  
  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const gamesData = await gameApi.getGames();
      setAllGamesData(gamesData); // Сохраняем исходный список
      // Фильтры применятся автоматически через useMemo
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load games';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const filterByGenreAPI = useCallback((genre: string) => {
    setSelectedGenre(genre);
    setShowGenreFilter(false);
    // Фильтрация происходит автоматически через useMemo
  }, []);

  const searchGames = useCallback((query: string) => {
    setSearchQuery(query);
    // Фильтрация происходит автоматически через useMemo
    // Жанр не сбрасывается, сохраняется выбранный
  }, []);

  const getGameById = useCallback((id: number): GameReadDto | undefined => {
    return gamesData.find(game => game.id === id);
  }, [gamesData]);

  const toggleGenreFilter = useCallback(() => {
    setShowGenreFilter(prev => !prev);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedGenre('all');
    setSearchQuery('');
    setShowGenreFilter(false);
    // Фильтрация происходит автоматически через useMemo
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Для отображения списка (GamePreview[])
    games: gamesPreview,
    
    // Для навигации (GameReadDto[])
    gamesData, // Отфильтрованные игры
    
    // Все загруженные игры (для поиска в Header)
    allGames: allGamesData,
    
    // UI состояния
    loading,
    error,
    genres,
    selectedGenre,
    searchQuery,
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