import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { FandomPreview } from "../../types/Fandom";
import type { GamePreview } from "../../types/AllGamesPageData";
import { gameApi, type GameReadDto } from "../../api/GameApi";
import { fandomApi } from "../../api/FandomApi";
import { getImageUrl } from "../../utils/urlUtils";

type MainPageProps = {
  onSearch: () => void;
};

export const useMainPage = ({ onSearch = () => {} }: MainPageProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<GamePreview[]>([]);
  const [allGamesData, setAllGamesData] = useState<GameReadDto[]>([]);
  const [fandoms, setFandoms] = useState<FandomPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFandoms, setLoadingFandoms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fandomsError, setFandomsError] = useState<string | null>(null);
  
  const [searchResults, setSearchResults] = useState<GameReadDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const gamesData = await gameApi.getGames();
        
        setAllGamesData(gamesData);
        
        const firstSixGames = gamesData.slice(0, 6);
        
        const gamePreviews = gameApi.adaptToGamePreviews(firstSixGames);
        
        setGames(gamePreviews);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load games';
        setError(errorMessage);
        console.error('Error loading games for main page:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  useEffect(() => {
    const loadFandoms = async () => {
      try {
        setLoadingFandoms(true);
        setFandomsError(null);
        
        const fandomsData = await fandomApi.getPopularFandoms(6);
        
        const fandomPreviews: FandomPreview[] = fandomsData.map((fandom) => ({
          id: fandom.id,
          name: fandom.name,
          imageUrl: fandom.coverImage ? getImageUrl(fandom.coverImage) : undefined,
        }));
        
        setFandoms(fandomPreviews);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load fandoms';
        setFandomsError(errorMessage);
        console.error('Error loading fandoms for main page:', err);
      } finally {
        setLoadingFandoms(false);
      }
    };

    loadFandoms();
  }, []);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await gameApi.searchGamesByName(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching games:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  }, [performSearch]);

  const handleSearchSubmit = useCallback(() => {
    onSearch();
    setSearchQuery("");
    setSearchResults([]);
  }, [onSearch]);

  const handleSearch = useCallback(() => {
    onSearch();
  }, [onSearch]);

  const handleGameClick = useCallback((game: GameReadDto) => {
    navigate(`/game/${game.id}`, {
      state: { game }
    });
    setSearchQuery("");
    setSearchResults([]);
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleShowMore = () => {
    navigate(`/allgames`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return {
    searchQuery,
    games,
    allGamesData,
    fandoms,
    loading,
    loadingFandoms,
    error,
    fandomsError,
    searchResults,
    isSearching,
    searchContainerRef,
    handleSearchChange,
    handleSearchSubmit,
    handleSearch,
    handleGameClick,
    handleShowMore,
    handleRetry,
  };
};

