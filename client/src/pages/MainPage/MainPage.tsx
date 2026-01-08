import type { FC } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Logo from "../../components/UI/Logo/Logo";
import styles from "./MainPage.module.scss";
import SearchInput from "../../components/UI/SearchInput/SearchInput";
import type { FandomPreview } from "../../types/Fandom";
import type { GamePreview } from "../../types/AllGamesPageData";
import GameCard from "../MainPage/GameCard/GameCard";
import FandomCard from "./FandomCard/FandomCard";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";
import ShowMoreButton from "../../components/UI/buttons/ShowMoreButton/ShowMoreButton";
import { gameApi } from "../../api/GameApi";
import { fandomApi } from "../../api/FandomApi";
import { getImageUrl } from "../../utils/urlUtils";

type MainPageProps = {
  onSearch: () => void;
};

const MainPage: FC<MainPageProps> = ({ onSearch = () => {} }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<GamePreview[]>([]);
  const [fandoms, setFandoms] = useState<FandomPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFandoms, setLoadingFandoms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fandomsError, setFandomsError] = useState<string | null>(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const gamesData = await gameApi.getGames();
        
        // только первые 6
        const firstSixGames = gamesData.slice(0, 6);
        
        // Преобразуем в GamePreview
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
        
        // Загружаем топ 6 популярных фандомов
        const fandomsData = await fandomApi.getPopularFandoms(6);
        
        // Преобразуем FandomReadDto в FandomPreview
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const filteredFandoms = fandoms.filter((fandom) =>
    fandom.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShowMore = () => {
    navigate(`/allgames`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className={styles.mainPage}>
      <Header onSearch={handleSearch} onSignIn={handleSignIn} />
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.logoWrapper}>
            <Logo size="large" showText={true} className={styles.heroLogo} />
          </div>
          
          <p className={styles.heroSubtitle}>Find your community</p>
          <div className={styles.centerSection}>
            <SearchInput
              placeholder="Search games"
              variant="secondary"
              size="large"
              withIcon={true}
              className={styles.heroSearch}
              onSearch={onSearch}
            />
          </div>
        </section>
        <section className={styles.gameSection}>
          <SectionTitle title="Games" />
          
          {loading ? (
            <div className={styles.loadingContainer}>
              <p>Loading games...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{error}</p>
              <button 
                className={styles.retryButton}
                onClick={handleRetry}
              >
                Retry
              </button>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className={styles.noGames}>
              <p>No games found</p>
            </div>
          ) : (
            <>
              <div className={styles.gamesGrid}>
                {filteredGames.map((game) => (
                   <GameCard
                    key={game.id}
                    gamePreview={game}
                    className={styles.gameCardItem}
                  />
                ))}
              </div>
              <ShowMoreButton 
                variant="light" 
                onClick={handleShowMore}
              />
            </>
          )}
        </section>
        <section className={styles.fandomsSection}>
          <SectionTitle title="Top Fandoms" />
          
          {loadingFandoms ? (
            <div className={styles.loadingContainer}>
              <p>Loading fandoms...</p>
            </div>
          ) : fandomsError ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{fandomsError}</p>
              <button 
                className={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : filteredFandoms.length === 0 ? (
            <div className={styles.noGames}>
              <p>No fandoms found</p>
            </div>
          ) : (
            <div className={styles.fandomsGrid}>
              {filteredFandoms.map((fandom) => (
                <FandomCard 
                  key={fandom.id} 
                  id={fandom.id}
                  name={fandom.name}
                  imageUrl={fandom.imageUrl}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MainPage;
