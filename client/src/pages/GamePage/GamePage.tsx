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

  useEffect(() => {
    loadGameData();
  }, [id, location.state]);

  const loadGameData = async () => {
    try {
      setLoading(true);
      setError(null);

      const state = location.state as GameLocationState | undefined;
      if (state?.game) {
        console.log('Using game from navigation state:', state.game);
        const formattedGame = formatGameData(state.game);
        setGameData(formattedGame);
        setLoading(false);
        return;
      }

      if (!id) {
        throw new Error('Game ID is missing');
      }

      const gameId = parseInt(id, 10);
      if (isNaN(gameId)) {
        throw new Error('Invalid game ID');
      }

      console.log('Loading game by ID:', gameId);
      const game = await gameApi.getGameById(gameId);
      const formattedGame = formatGameData(game);
      setGameData(formattedGame);

    } catch (err) {
      console.error('Error loading game:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load game';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatGameData = (game: GameReadDto): GamePageData => {
    return {
      id: game.id,
      title: game.title,
      description: game.description,
      coverImage: gameApi.getGameImageUrl(game.coverImage ),
      stats: {
        fandoms: 1, 
        posts: 0,  
      },
      details: {
        genre: game.genre,
        publisher: game.publisher,
        developer: game.developer,
        releaseDate: new Date(game.releaseDate).toLocaleDateString('ru-RU'),
      },
      fandoms: [] 
    };
  };

  const handleSearch = (query: string) => {
    console.log("Search in game:", query);
  };

  const handleShowMore = () => {
    if (gameData) {
      navigate(`/allfandoms`, {
        state: { 
          gameId: gameData.id,
          gameTitle: gameData.title 
        } as GameData
      });
    }
  };

  const handleRetry = () => {
    loadGameData();
  };

  const handleBackToGames = () => {
    navigate('/games');
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
      <Content 
        game={gameData} 
        onShowMore={handleShowMore}
      />
    </div>
  );
}

/* ================= CONTENT ================= */
interface ContentProps {
  game: GamePageData;
  onShowMore: () => void;
}

function Content({ game, onShowMore }: ContentProps) {
  return (
    <main className={styles.content}>
      <GameCard game={game} />
      <SectionTitle title="Fandoms" />
      <Fandoms fandoms={game.fandoms} />
      <ShowMoreButton 
        variant="light" 
        onClick={onShowMore}
      />  
    </main>
  );
}

/* ================= GAME CARD ================= */
interface GameCardProps {
  game: GamePageData;
}

function GameCard({ game }: GameCardProps) {
  return (
    <section className={styles.gameCard}>
      <div className={styles.gameLeft}>
        <div className={styles.cardTitle}>
          <TitleCard title={game.title} image={game.coverImage} />
        </div>
        
        <div className={styles.stats}>
          <div className={styles.stat}>
            <strong>
              {game.stats.fandoms >= 1000
                ? `${Math.floor(game.stats.fandoms / 1000)}K`
                : game.stats.fandoms}
            </strong>
            <span>Fandoms</span>
          </div>

          <div className={styles.stat}>
            <strong>
              {game.stats.posts >= 1000
                ? `${Math.floor(game.stats.posts / 1000)}K`
                : game.stats.posts}
            </strong>
            <span>posts</span>
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
          title={fandom.title}
          text={fandom.description}
          image={fandom.image}
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