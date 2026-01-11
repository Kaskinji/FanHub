import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import styles from "./GamePage.module.scss";
import Button from "../../components/UI/buttons/Button/Button";
import type { GameReadDto, GameStatsDto } from "../../api/GameApi";
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
    
    // Параллельно загружаем игру со статистикой и популярные фандомы (лимит 2)
    const [gameResponse, popularFandomsResponse] = await Promise.all([
      gameApi.getGameWithStatsById(gameId),
      fandomApi.getPopularFandomsByGame(gameId, 2)
    ]);
    
    // Форматируем данные
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

  // Обработка ESC для закрытия формы
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showGameForm) {
        e.preventDefault();
        // Убираем фокус с активного элемента, чтобы кнопка не выделялась
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

  // Функция для рендеринга скелетон-карточек фандомов
  const renderFandomSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <div key={`skeleton-fandom-${index}`} className={styles.fandomCardSkeleton}>
        <div className={styles.fandomCardSkeletonImage} />
        <div className={styles.fandomCardSkeletonContent}>
          <div className={styles.fandomCardSkeletonTitle} />
          <div className={styles.fandomCardSkeletonText} />
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header onSearch={handleSearch} />
        <main className={styles.contentSkeleton}>
          {/* Скелетон для GameCard */}
          <section className={styles.gameCardSkeleton}>
            <div className={styles.gameCardSkeletonLeft}>
              <div className={styles.gameCardSkeletonTitleImage} />
              <div className={styles.gameCardSkeletonStats}>
                <div className={styles.gameCardSkeletonStat} />
              </div>
            </div>
            <div className={styles.gameCardSkeletonRight}>
              <div className={styles.gameCardSkeletonDescription}>
                <div className={styles.gameCardSkeletonLine} />
                <div className={styles.gameCardSkeletonLine} />
                <div className={styles.gameCardSkeletonLine} />
                <div className={styles.gameCardSkeletonLineShort} />
              </div>
              <div className={styles.gameCardSkeletonDetails}>
                <div className={styles.gameCardSkeletonDetail} />
                <div className={styles.gameCardSkeletonDetail} />
                <div className={styles.gameCardSkeletonDetail} />
                <div className={styles.gameCardSkeletonDetail} />
              </div>
            </div>
          </section>
          
          {/* SectionTitle скелетон */}
          <div className={styles.sectionTitleSkeleton} />
          
          {/* Скелетоны для Fandoms */}
          <section className={styles.fandomsSkeleton}>
            {renderFandomSkeletons(2)}
          </section>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Header onSearch={handleSearch} />
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
        <Header onSearch={handleSearch} />
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
      <Header onSearch={handleSearch} />
         {showGameForm && (
        <div 
          className={styles.formContainer}
          onClick={(e) => {
            // Закрываем форму при клике на overlay (вне формы)
            if (e.target === e.currentTarget) {
              // Убираем фокус с активного элемента, чтобы кнопка не выделялась
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
              setShowGameForm(false);
            }
          }}
        >
          <GameForm
            gameId={gameData.id}
            onCancel={() => {
              // Убираем фокус с активного элемента при закрытии через Cancel
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
              setShowGameForm(false);
            }}
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