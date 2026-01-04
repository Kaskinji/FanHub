import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import styles from "./GamePage.module.scss";
import Button from "../../components/UI/buttons/Button/Button";
import type { GameReadDto } from "../../api/GameApi";
import { gameApi } from "../../api/GameApi";
import type { GamePageData } from "../../types/GamePageData";
import { useAuth } from "../../hooks/useAuth";
import GameForm from "../AllGamesPage/GameForm/GameForm";
import { Role } from "../../types/enums/Roles";
import { fandomApi } from "../../api/FandomApi";
import type { FandomReadDto } from "../../api/FandomApi";
import type { FandomPreview } from "../../types/Fandom";
import { getImageUrl } from "../../utils/urlUtils";
import { Content } from "./Content/Content";

type GameLocationState = {
  game: GameReadDto;
};

const GamePage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [gameData, setGameData] = useState<GamePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGameForm, setShowGameForm] = useState(false);

  const { user } = useAuth();
  const isAdmin = user?.role === Role.Admin;

  const loadGameData = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    let gameId: number;
    const state = location.state as GameLocationState | undefined;

    // Получаем ID игры
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
    
    // Параллельно загружаем игру и фандомы
    const [gameResponse, fandomsResponse] = await Promise.all([
      gameApi.getGameById(gameId),
      fandomApi.searchFandomsByNameAndGame(gameId)
    ]);
    
    // Форматируем данные
    const formattedGame = formatGameData(gameResponse, fandomsResponse);
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

  const formatGameData = (game: GameReadDto, fandoms: FandomReadDto[]): GamePageData => {

  const formattedFandoms: FandomPreview[] = fandoms.map(fandom => ({
    id: fandom.id,
    gameId: fandom.gameId,
    name: fandom.name,
    description: fandom.description,
    imageUrl: fandom.coverImage ? getImageUrl(fandom.coverImage) : undefined,
    creationDate: fandom.creationDate,
    rules: fandom.rules,
    subscribersCount: 0, 
    postsCount: 0      
  }));

  return {
    id: game.id,
    title: game.title,
    description: game.description,
    coverImage: game.coverImage,
    stats: {
      fandoms: fandoms.length,
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
    navigate('/games');
  };

  const handleGameUpdated = () => {
    setShowGameForm(false);
    loadGameData();
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header onSearch={handleSearch} onSignIn={() => {}} />
        <div className={styles.loadingContainer}>
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Header onSearch={handleSearch} onSignIn={() => {}} />
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
          <div className={styles.errorActions}>
            <Button onClick={handleRetry}>
              Retry
            </Button>
            <Button 
              variant="light" 
              onClick={handleBackToGames}
              className={styles.backButton}
            >
              Back to Games
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className={styles.page}>
        <Header onSearch={handleSearch} onSignIn={() => {}} />
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>Game not found</p>
          <Button onClick={handleBackToGames}>
            Back to Games
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header onSearch={handleSearch} onSignIn={() => {}} />
         {showGameForm && (
        <div className={styles.formContainer}>
          <GameForm
            gameId={gameData.id}
            onCancel={() => setShowGameForm(false)}
            onSuccess={handleGameUpdated}
          />
        </div>
      )}
      <Content 
        game={gameData} 
        onShowMore={handleShowMore}
        isAdmin={isAdmin}
        onEditGame={() => setShowGameForm(true)}
      />
    </div>
  );
};

export default GamePage;