
import { useState, useCallback, useMemo, useEffect } from 'react';
import { gameApi } from '../api/GameApi';
import type { GameReadDto } from '../api/GameApi';

export type SortOption = 'default' | 'date-asc' | 'date-desc';

export const useGames = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allGamesData, setAllGamesData] = useState<GameReadDto[]>([]); 
  const [gamesData, setGamesData] = useState<GameReadDto[]>([]); 
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(''); 
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('default');

  
  const sortedGamesData = useMemo(() => {
    if (sortOption === 'default') {
      return gamesData;
    }
    
    const sorted = [...gamesData];
    sorted.sort((a, b) => {
      const dateA = new Date(a.releaseDate).getTime();
      const dateB = new Date(b.releaseDate).getTime();
      
      if (sortOption === 'date-asc') {
        return dateA - dateB; 
      } else {
        return dateB - dateA; 
      }
    });
    
    return sorted;
  }, [gamesData, sortOption]);

  
  const sortGames = (games: GameReadDto[], query: string): GameReadDto[] => {
    if (!query.trim()) return games;
    
    const lowerQuery = query.toLowerCase();
    
    
    return [...games].sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      
      
      if (titleA === lowerQuery && titleB !== lowerQuery) return -1;
      if (titleA !== lowerQuery && titleB === lowerQuery) return 1;
      if (titleA === lowerQuery && titleB === lowerQuery) return 0;
      
      
      const startsWithA = titleA.startsWith(lowerQuery);
      const startsWithB = titleB.startsWith(lowerQuery);
      
      if (startsWithA && !startsWithB) return -1;
      if (!startsWithA && startsWithB) return 1;
      
      
      if (startsWithA && startsWithB) {
        return titleA.length - titleB.length;
      }
      
      
      const positionA = titleA.indexOf(lowerQuery);
      const positionB = titleB.indexOf(lowerQuery);
      
      if (positionA !== positionB) {
        return positionA - positionB;
      }
      
      
      return titleA.length - titleB.length;
    });
  };

  
  const filteredGames = useMemo(() => {
    let filtered = [...allGamesData];
    
    
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(game => game.genre === selectedGenre);
    }
    
    
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(game => 
        game.title.toLowerCase().includes(lowerQuery)
      );
    }
    
    
    if (searchQuery.trim()) {
      filtered = sortGames(filtered, searchQuery);
    }
    
    return filtered;
  }, [allGamesData, selectedGenre, searchQuery]);

  
  useEffect(() => {
    setGamesData(filteredGames);
  }, [filteredGames]);

  
  const gamesPreview = useMemo(() => 
    gameApi.adaptToGamePreviews(sortedGamesData),
    [sortedGamesData]
  );

  
  const genres = useMemo(() => 
    Array.from(new Set(allGamesData.map(game => game.genre).filter(Boolean))).sort(),
    [allGamesData]
  );
  
  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const gamesData = await gameApi.getGames();
      setAllGamesData(gamesData); 
      
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
    
  }, []);

  const searchGames = useCallback((query: string) => {
    setSearchQuery(query);
    
    
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
    
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setSort = useCallback((option: SortOption) => {
    setSortOption(option);
  }, []);

  return {
    
    games: gamesPreview,
    
    
    gamesData, 
    
    
    allGames: allGamesData,
    
    
    loading,
    error,
    genres,
    selectedGenre,
    searchQuery,
    showGenreFilter,
    sortOption,
    
    
    loadGames,
    searchGames,
    filterByGenre: filterByGenreAPI,
    toggleGenreFilter,
    resetFilters,
    clearError,
    getGameById,
    setSort,
  };
};