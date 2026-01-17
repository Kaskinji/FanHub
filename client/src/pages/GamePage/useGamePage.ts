import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import type { GameReadDto, GameStatsDto } from "../../api/GameApi";
import { gameApi } from "../../api/GameApi";
import type { GamePageData } from "../../types/GamePageData";
import { useAuth } from "../../hooks/useAuth";
import { Role } from "../../types/enums/Roles";
import { fandomApi } from "../../api/FandomApi";
import type { FandomReadDto } from "../../api/FandomApi";
import type { FandomPreview } from "../../types/Fandom";
import { getImageUrl } from "../../utils/urlUtils";

type GameLocationState = {
  game: GameReadDto;
};

export const useGamePage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [gameData, setGameData] = useState<GamePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGameForm, setShowGameForm] = useState(false);

  const { user } = useAuth();
  const isAdmin = user?.role === Role.Admin;

  const formatGameData = (game: GameStatsDto, popularFandoms: FandomReadDto[]): GamePageData => {
    const formattedFandoms: FandomPreview[] = popularFandoms.map(fandom => ({
      id: fandom.id,
      name: fandom.name,
      description: fandom.description,
      imageUrl: fandom.coverImage ? getImageUrl(fandom.coverImage) : undefined,
    }));

    return {
      id: game.id,
      title: game.title,
      description: game.description,
      coverImage: game.coverImage || undefined,
      stats: {
        fandoms: game.fandomsCount,
        posts: 0,
      },
      details: {
        genre: game.genre,
        publisher: game.publisher,
        developer: game.developer,
        releaseDate: new Date(game.releaseDate).toLocaleDateString('ru-RU'),
      },
      fandoms: formattedFandoms
    };
  };

  const loadGameData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let gameId: number;
      const state = location.state as GameLocationState | undefined;

      if (state?.game) {
        console.log('Using game from navigation state:', state.game);
        gameId = state.game.id;
      } else {
        if (!id) {
          throw new Error('Game ID is missing');
        }

        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
          throw new Error('Invalid game ID');
        }
        gameId = parsedId;
      }

      console.log('Loading game by ID:', gameId);
      
      const [gameResponse, popularFandomsResponse] = await Promise.all([
        gameApi.getGameWithStatsById(gameId),
        fandomApi.getPopularFandomsByGame(gameId, 2)
      ]);
      
      const formattedGame = formatGameData(gameResponse, popularFandomsResponse);
      setGameData(formattedGame);

    } catch (err) {
      console.error('Error loading game:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load game';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id, location.state]);

  useEffect(() => {
    loadGameData();
  }, [loadGameData]);

  const handleSearch = (query: string) => {
    console.log("Search in game:", query);
  };

  const handleShowMore = () => {
    if (gameData) {
      navigate(`/allfandoms/${gameData.id}`);
    }
  };

  const handleRetry = () => {
    loadGameData();
  };

  const handleBackToGames = () => {
    navigate('/allgames');
  };

  const handleGameUpdated = () => {
    setShowGameForm(false);
    loadGameData();
  };

  const handleCloseGameForm = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setShowGameForm(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showGameForm) {
        e.preventDefault();
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        setShowGameForm(false);
      }
    };

    if (showGameForm) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [showGameForm]);

  return {
    gameData,
    loading,
    error,
    showGameForm,
    isAdmin,
    handleSearch,
    handleShowMore,
    handleRetry,
    handleBackToGames,
    handleGameUpdated,
    handleCloseGameForm,
    setShowGameForm,
  };
};

