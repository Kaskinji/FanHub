import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import ShowMoreButton from "../../components/UI/buttons/ShowMoreButton/ShowMoreButton";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";
import styles from "./GamePage.module.scss";
import { TitleCard } from "../../components/TitleCard/TitleCard";
import Button from "../../components/UI/buttons/Button/Button";
import type { GameReadDto } from "../../api/GameApi";
import { gameApi } from "../../api/GameApi";
import type { GamePageData } from "../../types/GamePageData";
import { useAuth } from "../../hooks/useAuth";
import GameForm from "../AllGamesPage/GameForm/GameForm";
import { Role } from "../../types/enums/Roles";
import postIcon from "../../assets/postIcon.svg";
import fandomIcon from "../../assets/fandom.svg"
import { fandomApi } from "../../api/FandomApi";
import type { FandomReadDto } from "../../api/FandomApi";
import type { FandomPreview } from "../../types/Fandom";
import { getImageUrl } from "../../utils/urlUtils";

interface GameLocationState {
  game: GameReadDto;
}

export default function GamePage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [gameData, setGameData] = useState<GamePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGameForm, setShowGameForm] = useState(false);

  const { user } = useAuth();
  const isAdmin = user?.role === Role.Admin;

  useEffect(() => {
    loadGameData();
  }, [id, location.state]);

  const loadGameData = async () => {
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
};

  const formatGameData = (game: GameReadDto, fandoms: FandomReadDto[]): GamePageData => {

  const formattedFandoms: FandomPreview[] = fandoms.map(fandom => ({
    id: fandom.id,
    gameId: fandom.gameId,
    name: fandom.name,
    description: fandom.description,
    imageUrl: getImageUrl(fandom.coverImage) || '/images/default-fandom.jpg',
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

  const handleGameUpdated = (gameId: number) => {
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
}

/* ================= CONTENT ================= */
interface ContentProps {
  game: GamePageData;
  onShowMore: () => void;
  isAdmin: boolean;
  onEditGame: () => void;
}

function Content({ game, onShowMore,  isAdmin, onEditGame }: ContentProps) {
  return (
    <main className={styles.content}>
      <GameCard 
        game={game} 
        isAdmin={isAdmin}
        onEditGame={onEditGame} />
      <SectionTitle title="Fandoms" />
      <Fandoms fandoms={game.fandoms} />
      {game.fandoms.length > 0 && (
        <ShowMoreButton 
          variant="light" 
          onClick={onShowMore}
        />
      )}
    </main>
  );
}

/* ================= GAME CARD ================= */
interface GameCardProps {
  game: GamePageData;
  isAdmin: boolean;
  onEditGame: () => void;
}

function GameCard({ game, isAdmin, onEditGame }: GameCardProps) {
  return (
    <section className={styles.gameCard}>
      <div className={styles.gameLeft}>
        <div className={styles.cardTitle}>
            <TitleCard className={styles.gameTitleCard} title={game.title} image={game.coverImage} />
            <div className={styles.statsWrapper}>
              {/* Кнопка управления для админа */}
              {isAdmin && (
                <button 
                  className={styles.manageButton} 
                  onClick={onEditGame}
                >
                  Manage Game
                </button>
              )}
              
              {/* Статистика */}
              <div className={styles.gameStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{game.stats.fandoms}</span>
                  <img 
                    className={styles.statIcon}
                    src={fandomIcon}
                    alt="Fandoms" 
                  />
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{game.stats.posts}</span>
                  <img 
                    className={styles.statIcon}
                    src={postIcon}
                    alt="Posts" 
                  />
                </div>
              </div>
            </div>
          </div>
        
    
      </div>
      <GameRight game={game} />
    </section>
  );
}

interface GameRightProps {
  game: GamePageData;
}

function GameRight({ game }: GameRightProps) {
  return (
    <div className={styles.gameRight}>
      <div className={styles.infoBox}>
        <h3 className={styles.infoTitle}>About the game:</h3>
        <p>{game.description}</p>
      </div>

      <div className={styles.infoBox}>
        <div className={styles.detailBox}>
          <p className={styles.infoTitle}>
            Genre:
          </p>
          <p className={styles.detailText}>
            {game.details.genre}
          </p>
        </div>
        <div className={styles.detailBox}>
          <p className={styles.infoTitle}>
            Publisher:
          </p>
          <p className={styles.detailText}>
            {game.details.publisher}
          </p>
        </div>
        <div className={styles.detailBox}>
          <p className={styles.infoTitle}>
            Developer:
          </p>
          <p className={styles.detailText}>
            {game.details.developer}
          </p>
        </div>
        <div className={styles.detailBox}>
          <p className={styles.infoTitle}>
            Release date:
          </p>
          <p className={styles.detailText}>
            {game.details.releaseDate}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= FANDOMS ================= */
interface FandomsProps {
  fandoms: GamePageData['fandoms'];
}

function Fandoms({ fandoms }: FandomsProps) {
  if (fandoms.length === 0) {
    return (
      <div className={styles.noFandoms}>
        <p>No fandoms yet. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <section className={styles.fandoms}>
      {fandoms.map((fandom) => (
        <FandomCard
          key={fandom.id}
          title={fandom.name}
          text={fandom.description}
          image={fandom.imageUrl}
        />
      ))}
    </section>
  );
}

interface FandomCardProps {
  title: string;
  text: string;
  image: string;
}

function FandomCard({ title, text, image }: FandomCardProps) {
  return (
    <div className={styles.fandomCard}>
      <img 
        src={image} 
        alt={title} 
        className={styles.fandomImage}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/images/default-fandom.jpg';
        }}
      />
      <div className={styles.fandomInfo}>
        <h4 className={styles.fandomTitle}>{title}</h4>
        <p className={styles.fandomDescription}>{text}</p>
      </div>
    </div>
  );
}