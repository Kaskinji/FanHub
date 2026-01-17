import { useEffect, useState } from "react";
import { useGames } from "../../hooks/useGames";
import { useAuth } from "../../hooks/useAuth";
import { Role } from "../../types/enums/Roles";

export const useAllGamesPage = () => {
  const {
    games,
    gamesData,
    allGames,
    loading,
    error,
    genres,
    selectedGenre,
    searchQuery,
    showGenreFilter,
    sortOption,
    loadGames,
    searchGames,
    filterByGenre,
    toggleGenreFilter,
    resetFilters,
    clearError,
    setSort
  } = useGames();

  const { user } = useAuth();
  const isAdmin = user?.role === Role.Admin;
  const [showGameForm, setShowGameForm] = useState(false);

  useEffect(() => {
    loadGames();
  }, []);

  const handleSearch = (query: string) => {
    searchGames(query);
  };

  const handleGenreSelect = (genre: string) => {
    filterByGenre(genre);
  };

  const handleGameCreated = () => {
    setShowGameForm(false);
    loadGames();
  };

  return {
    games,
    gamesData,
    allGames,
    loading,
    error,
    genres,
    selectedGenre,
    searchQuery,
    showGenreFilter,
    sortOption,
    isAdmin,
    showGameForm,
    handleSearch,
    handleGenreSelect,
    handleGameCreated,
    clearError,
    loadGames,
    toggleGenreFilter,
    resetFilters,
    setSort,
    setShowGameForm,
  };
};

