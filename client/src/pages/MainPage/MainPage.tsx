import type { FC } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
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
import { gameApi, type GameReadDto } from "../../api/GameApi";
import { fandomApi } from "../../api/FandomApi";
import { getImageUrl } from "../../utils/urlUtils";
import SearchDropdown from "../../components/UI/SearchDropdown/SearchDropdown";

type MainPageProps = {
  onSearch: () => void;
};

const MainPage: FC<MainPageProps> = ({ onSearch = () => {} }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<GamePreview[]>([]);
  const [allGamesData, setAllGamesData] = useState<GameReadDto[]>([]); // Все игры для поиска
  const [fandoms, setFandoms] = useState<FandomPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFandoms, setLoadingFandoms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fandomsError, setFandomsError] = useState<string | null>(null);
  
  // Состояния для поиска игр
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
        
        // Сохраняем все игры для поиска в Header
        setAllGamesData(gamesData);
        
        // только первые 6 для отображения
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

  // Поиск игр с debounce
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

  // Обработчик изменения поискового запроса
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Очищаем предыдущий таймаут
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Устанавливаем новый таймаут для debounce (300ms)
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  }, [performSearch]);

  // Обработчик отправки формы поиска
  const handleSearchSubmit = useCallback((query: string) => {
    onSearch();
    setSearchQuery("");
    setSearchResults([]);
  }, [onSearch]);

  // Обработчик поиска для Header
  const handleSearch = useCallback(() => {
    // Просто вызываем onSearch для Header
    onSearch();
  }, [onSearch]);

  // Обработчик клика на результат поиска
  const handleGameClick = useCallback((game: GameReadDto) => {
    navigate(`/game/${game.id}`, {
      state: { game }
    });
    setSearchQuery("");
    setSearchResults([]);
  }, [navigate]);

  // Закрытие выпадающего списка при клике вне его
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

  // Очистка таймаута при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleShowMore = () => {
    navigate(`/allgames`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Функция для рендеринга скелетон-карточек
  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <div key={`skeleton-${index}`} className={styles.cardSkeleton}>
        <div className={styles.cardSkeletonImage} />
        <div className={styles.cardSkeletonContent}>
          <div className={styles.cardSkeletonTitle} />
          <div className={styles.cardSkeletonSubtitle} />
        </div>
      </div>
    ));
  };

  return (
    <div className={styles.mainPage}>
      <Header onSearch={handleSearch} onSignIn={handleSignIn} allGames={allGamesData} />
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.logoWrapper}>
            <Logo size="large" showText={true} className={styles.heroLogo} />
          </div>
          
          <p className={styles.heroSubtitle}>Find your community</p>
          <div className={styles.centerSection}>
            <div className={styles.searchContainer} ref={searchContainerRef}>
              <SearchInput
                placeholder="Search games"
                variant="secondary"
                size="large"
                theme="light"
                withIcon={true}
                className={styles.heroSearch}
                onSearch={handleSearchSubmit}
                value={searchQuery}
                onChange={handleSearchChange}
                isDropdownOpen={searchQuery.trim().length > 0}
              />
              <SearchDropdown
                isOpen={searchQuery.trim().length > 0}
                isSearching={isSearching}
                searchResults={searchResults}
                onGameClick={handleGameClick}
                searchQuery={searchQuery}
                theme="light"
              />
            </div>
          </div>
        </section>
        <section className={styles.gameSection}>
          <SectionTitle title="Games" />
          
          {error ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{error}</p>
              <button 
                className={styles.retryButton}
                onClick={handleRetry}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className={styles.gamesGrid}>
                {loading ? (
                  renderSkeletons(6)
                ) : games.length === 0 ? (
                  <div className={styles.noGames}>
                    <p>No games found</p>
                  </div>
                ) : (
                  games.map((game) => (
                    <GameCard
                      key={game.id}
                      gamePreview={game}
                      className={styles.gameCardItem}
                    />
                  ))
                )}
              </div>
              {!loading && games.length > 0 && (
                <ShowMoreButton 
                  variant="light" 
                  onClick={handleShowMore}
                />
              )}
            </>
          )}
        </section>
        <section className={styles.fandomsSection}>
          <SectionTitle title="Top Fandoms" />
          
          {fandomsError ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{fandomsError}</p>
              <button 
                className={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className={styles.fandomsGrid}>
              {loadingFandoms ? (
                renderSkeletons(6)
              ) : fandoms.length === 0 ? (
                <div className={styles.noGames}>
                  <p>No fandoms found</p>
                </div>
              ) : (
                fandoms.map((fandom) => (
                  <FandomCard 
                    key={fandom.id} 
                    id={fandom.id}
                    name={fandom.name}
                    imageUrl={fandom.imageUrl}
                  />
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MainPage;