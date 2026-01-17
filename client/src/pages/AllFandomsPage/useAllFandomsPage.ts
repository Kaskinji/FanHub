import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { fandomApi } from "../../api/FandomApi";
import { gameApi } from "../../api/GameApi";
import type { FandomReadDto, FandomStatsDto } from "../../api/FandomApi";

type FandomWithStats = FandomReadDto | FandomStatsDto;

const hasStats = (fandom: FandomWithStats): fandom is FandomStatsDto => {
  return 'subscribersCount' in fandom && 'postsCount' in fandom;
};

export const useAllFandomsPage = () => {
  const { gameId: gameIdParam } = useParams<{ gameId?: string }>();
  const gameId = gameIdParam ? parseInt(gameIdParam, 10) : undefined;

  const [allFandoms, setAllFandoms] = useState<FandomWithStats[]>([]); 
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'subscribers' | 'posts' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); 
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const sortFandomsByName = (fandoms: FandomWithStats[], query: string): FandomWithStats[] => {
    if (!query.trim()) return fandoms;
    
    const lowerQuery = query.toLowerCase();
    
    return [...fandoms].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      if (nameA === lowerQuery && nameB !== lowerQuery) return -1;
      if (nameA !== lowerQuery && nameB === lowerQuery) return 1;
      if (nameA === lowerQuery && nameB === lowerQuery) return 0;
      
      const startsWithA = nameA.startsWith(lowerQuery);
      const startsWithB = nameB.startsWith(lowerQuery);
      
      if (startsWithA && !startsWithB) return -1;
      if (!startsWithA && startsWithB) return 1;
      
      if (startsWithA && startsWithB) {
        return nameA.length - nameB.length;
      }
      
      const positionA = nameA.indexOf(lowerQuery);
      const positionB = nameB.indexOf(lowerQuery);
      
      if (positionA !== positionB) {
        return positionA - positionB;
      }
      
      return nameA.length - nameB.length;
    });
  };

  const sortFandomsByStats = (fandoms: FandomWithStats[], sortType: 'subscribers' | 'posts', order: 'asc' | 'desc'): FandomWithStats[] => {
    return [...fandoms].sort((a, b) => {
      if (!hasStats(a)) return 1;
      if (!hasStats(b)) return -1;
      
      const multiplier = order === 'asc' ? 1 : -1;
      
      if (sortType === 'subscribers') {
        return (b.subscribersCount - a.subscribersCount) * multiplier;
      } else {
        return (b.postsCount - a.postsCount) * multiplier;
      }
    });
  };

  const filteredFandoms = useMemo(() => {
    let filtered = [...allFandoms];
    
    if (gameId) {
      filtered = filtered.filter(fandom => fandom.gameId === gameId);
    }
    
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(fandom => 
        fandom.name.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (sortBy === 'subscribers' || sortBy === 'posts') {
      filtered = sortFandomsByStats(filtered, sortBy, sortOrder);
    } else if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => {
        const result = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? result : -result;
      });
    } else if (searchQuery.trim()) {
      filtered = sortFandomsByName(filtered, searchQuery);
    }
    
    return filtered;
  }, [allFandoms, gameId, searchQuery, sortBy, sortOrder]);

  const loadFandoms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: FandomWithStats[];

      if (gameId) {
        data = await fandomApi.searchFandomsByNameAndGame(gameId, "");
      } else {
        data = await fandomApi.getFandoms();
      }

      setAllFandoms(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load fandoms";
      setError(errorMessage);
      console.error("Error loading fandoms:", err);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    const loadGameTitle = async () => {
      if (!gameId) {
        setSelectedGame(null);
        return;
      }

      try {
        const game = await gameApi.getGameById(gameId);
        setSelectedGame(game.title);
      } catch (err) {
        console.error("Failed to load game title:", err);
        setSelectedGame(null);
      }
    };

    loadGameTitle();
    loadFandoms();
  }, [loadFandoms, refreshTrigger, gameId]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSortChange = useCallback((sortType: 'name' | 'subscribers' | 'posts') => {
    if (sortBy === sortType) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortType);
      setSortOrder(sortType === 'name' ? 'asc' : 'desc');
    }
  }, [sortBy]);

  const handleAddFandomClick = () => {
    setShowAddForm(true);
  };

  const handleFandomCreated = () => {
    setShowAddForm(false);
    setRefreshTrigger(prev => prev + 1); 
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
  };

  return {
    filteredFandoms,
    selectedGame,
    loading,
    error,
    gameId,
    searchQuery,
    sortBy,
    sortOrder,
    showAddForm,
    handleSearch,
    handleSortChange,
    handleAddFandomClick,
    handleFandomCreated,
    handleCancelForm,
  };
};

