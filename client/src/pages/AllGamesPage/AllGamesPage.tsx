import Header from "../../components/Header/Header";
import SearchInput from "../../components/UI/SearchInput/SearchInput";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";
import styles from "../AllGamesPage/AllGamesPage.module.scss";
import Button from "../../components/UI/buttons/Button/Button"
import type { GamePreview } from "../../types/AllGamesPageData";
import GameCard from "../MainPage/GameCard/GameCard";
import { useGames } from "../../hooks/useGames";
import { useEffect } from "react";

export default function AllGamesPage() {
  const {
    games,
    loading,
    error,
    genres,
    selectedGenre,
    showGenreFilter,
    loadGames,
    searchGames,
    filterByGenre,
    toggleGenreFilter,
    resetFilters,
    clearError
  } = useGames();

  useEffect(() => {
    loadGames();
  }, []);

  
  const handleSearch = (query: string) => {
    searchGames(query);
  };

  const handleGenreSelect = (genre: string) => {
    filterByGenre(genre);
  };

  if (error) {
    return (
      <div className={styles.page}>
        <Header onSearch={handleSearch} onSignIn={() => {}} />
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
          <Button onClick={() => {
            clearError();
            loadGames();
          }}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header onSearch={handleSearch} onSignIn={() => {}} />
      <Content 
        games={games}
        loading={loading}
        genres={genres}
        selectedGenre={selectedGenre}
        showGenreFilter={showGenreFilter}
        onSearch={handleSearch}
        onGenreSelect={handleGenreSelect}
        onToggleFilter={toggleGenreFilter}
        onResetFilters={resetFilters}
      />
    </div>
  );
}

/* ================= CONTENT ================= */
interface ContentProps {
  games: GamePreview[];
  loading: boolean;
  genres: string[];
  selectedGenre: string;
  showGenreFilter: boolean;
  onSearch: (query: string) => void;
  onGenreSelect: (genre: string) => void;
  onToggleFilter: () => void;
  onResetFilters: () => void;
}
function Content({   
  games, 
  loading, 
  genres, 
  selectedGenre, 
  showGenreFilter,
  onSearch, 
  onGenreSelect,
  onToggleFilter,
  onResetFilters  
}: ContentProps) {
  return (
    <main className={styles.content}>
      <Top 
        onSearch={onSearch}
        onToggleFilter={onToggleFilter}
        showGenreFilter={showGenreFilter}
      />
      
      {/* Фильтр по жанрам (показывается/скрывается) */}
      {showGenreFilter && (
        <GenreFilter 
          genres={genres}
          selectedGenre={selectedGenre}
          onSelect={onGenreSelect}
          onClose={onToggleFilter}
        />
      )}
      
      {/* Панель активных фильтров */}
      <ActiveFilters 
        selectedGenre={selectedGenre}
        onReset={onResetFilters}
      />
      
      <Games games={games} loading={loading}/>
    </main>
  );
}

interface ActiveFiltersProps {
  selectedGenre: string;
  onReset: () => void;
}

function ActiveFilters({ selectedGenre, onReset }: ActiveFiltersProps) {
  if (selectedGenre === 'all') {
    return null;
  }

  return (
    <div className={styles.activeFilters}>
      <div className={styles.activeFilterTag}>
        <span className={styles.filterLabel}>Genre:</span>
        <span className={styles.filterValue}>{selectedGenre}</span>
        <button className={styles.removeFilter} onClick={onReset}>
          ×
        </button>
      </div>
    </div>
  );
}

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string;
  onSelect: (genre: string) => void;
  onClose: () => void;
}

function GenreFilter({ genres, selectedGenre, onSelect, onClose }: GenreFilterProps) {
  return (
    <div className={styles.genreFilterPanel}>
      <div className={styles.genreFilterHeader}>
        <h3 className={styles.genreFilterTitle}>Filter by Genre</h3>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      <div className={styles.genreFilterGrid}>
        <button
          className={`${styles.genreOption} ${selectedGenre === 'all' ? styles.selected : ''}`}
          onClick={() => onSelect('all')}
        >
          All Games
        </button>
        {genres.map(genre => (
          <button
            key={genre}
            className={`${styles.genreOption} ${selectedGenre === genre ? styles.selected : ''}`}
            onClick={() => onSelect(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================= TOP SECTION ================= */

interface TopProps {
   onSearch: (query: string) => void;
  onToggleFilter: () => void;
  showGenreFilter: boolean;
}

function Top({ onSearch, onToggleFilter, showGenreFilter }: TopProps) {
  return (
    <div className={styles.top}>
      <div className={styles.topHeader}>
        <h1 className={styles.pageTitle}>All Games</h1>
        <div className={styles.controls}>
          <Button
            variant={"light"}
            onClick={onToggleFilter}
            className={styles.filterButton}
          >
            {showGenreFilter ? "Hide Filters" : "Filter by Genre"}
          </Button>
          <div className={styles.searchWrapper}>
            <SearchInput 
              placeholder="Search games..."
              withIcon={true}
              onSearch={onSearch}
              variant="head"
              size="medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
/* ================= gameS SECTION ================= */
interface AllGamesProps {
  games: GamePreview[];
  loading: boolean;
}
function Games({ games, loading }: AllGamesProps) {
  if (loading) {
    return (
      <section className={styles.gamesSection}>
        <SectionTitle title="Games" />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading games...</p>
        </div>
      </section>
    );
  }
  if (games.length === 0) {
    return (
      <section className={styles.gamesSection}>
        <SectionTitle title="Games" />
        <div className={styles.noGames}>
          <p>No games found</p>
        </div>
      </section>
    );
  }
  return (
    <section className={styles.gamesSection}>
      <SectionTitle title="Games" />
      <div className={styles.gamesGrid}>
        {games.map((game: GamePreview) => (
          <GameCard
            key={game.id}
            id={game.id}
            name={game.name}
            imageUrl={game.imageUrl}
          />
        ))}
      </div>
    </section>
  );
}