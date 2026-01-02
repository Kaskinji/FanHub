import type { FC } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Logo from "../../components/UI/Logo/Logo";
import styles from "./MainPage.module.scss";
import SearchInput from "../../components/UI/SearchInput/SearchInput";
import type { Fandom } from "../../types/Fandom";
import type { GamePreview } from "../../types/AllGamesPageData";
import GameCard from "../MainPage/GameCard/GameCard";
import FandomCard from "./FandomCard/FandomCard";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";
import ShowMoreButton from "../../components/UI/buttons/ShowMoreButton/ShowMoreButton";
import { gameApi } from "../../api/GameApi";

type MainPageProps = {
  onSearch: () => void;
};

const MainPage: FC<MainPageProps> = ({ onSearch = () => {} }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<GamePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MOCK_FANDOMS: Fandom[] = [
    { id: 1, name: "Minecrafters", description: "" },
    { id: 2, name: "HN fans", description: "" },
    { id: 3, name: "Dota 2 Fans", description: "" },
    { id: 4, name: "The Witcher", description: "" },
    { id: 5, name: "TF enjoyers", description: "" },
    { id: 6, name: "GTA lovers", description: "" },
  ];

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const filteredFandoms = MOCK_FANDOMS.filter((fandom) =>
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
          <div className={styles.fandomsGrid}>
            {filteredFandoms.map((fandom) => (
              <FandomCard key={fandom.id} {...fandom} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
