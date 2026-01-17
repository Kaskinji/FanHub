import type { FC } from "react";
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
import type { GameReadDto } from "../../api/GameApi";
import SearchDropdown from "../../components/UI/SearchDropdown/SearchDropdown";
import type { RefObject } from "react";

type MainPageViewProps = {
  searchQuery: string;
  games: GamePreview[];
  allGamesData: GameReadDto[];
  fandoms: FandomPreview[];
  loading: boolean;
  loadingFandoms: boolean;
  error: string | null;
  fandomsError: string | null;
  searchResults: GameReadDto[];
  isSearching: boolean;
  searchContainerRef: RefObject<HTMLDivElement>;
  handleSearchChange: (query: string) => void;
  handleSearchSubmit: () => void;
  handleSearch: () => void;
  handleGameClick: (game: GameReadDto) => void;
  handleShowMore: () => void;
  handleRetry: () => void;
}

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

export const MainPageView: FC<MainPageViewProps> = ({
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
}) => {
  return (
    <div className={styles.mainPage}>
      <Header onSearch={handleSearch} allGames={allGamesData} />
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

