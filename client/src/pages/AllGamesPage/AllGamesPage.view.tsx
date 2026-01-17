import type { FC } from "react";
import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import SearchInput from "../../components/UI/SearchInput/SearchInput";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";
import styles from "../AllGamesPage/AllGamesPage.module.scss";
import Button from "../../components/UI/buttons/Button/Button";
import { AddButton } from "../../components/UI/buttons/AddButton/AddButton";
import type { GamePreview } from "../../types/AllGamesPageData";
import GameCard from "../MainPage/GameCard/GameCard";
import GameForm from "../../pages/AllGamesPage/GameForm/GameForm";
import { CustomSelect } from "../../components/UI/CustomSelect/CustomSelect";
import type { GameReadDto } from "../../api/GameApi";

type AllGamesPageViewProps = {
  games: GamePreview[];
  gamesData: GameReadDto[];
  allGames: GameReadDto[];
  loading: boolean;
  error: string | null;
  genres: string[];
  selectedGenre: string;
  searchQuery: string;
  showGenreFilter: boolean;
  sortOption: 'default' | 'date-asc' | 'date-desc';
  isAdmin: boolean;
  showGameForm: boolean;
  handleSearch: (query: string) => void;
  handleGenreSelect: (genre: string) => void;
  handleGameCreated: () => void;
  clearError: () => void;
  loadGames: () => void;
  toggleGenreFilter: () => void;
  resetFilters: () => void;
  setSort: (option: 'default' | 'date-asc' | 'date-desc') => void;
  setShowGameForm: (show: boolean) => void;
}

type ActiveFiltersProps = {
  selectedGenre: string;
  onReset: () => void;
}

const ActiveFilters = ({ selectedGenre, onReset }: ActiveFiltersProps) => {
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
};

type GenreFilterProps = {
  genres: string[];
  selectedGenre: string;
  onSelect: (genre: string) => void;
  onClose: () => void;
}

const GenreFilter = ({ genres, selectedGenre, onSelect, onClose }: GenreFilterProps) => {
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
};

type TopProps = {
  onSearch: (query: string) => void;
  onToggleFilter: () => void;
  showGenreFilter: boolean;
  searchQuery: string;
  sortOption: 'default' | 'date-asc' | 'date-desc';
  onSortChange: (option: 'default' | 'date-asc' | 'date-desc') => void;
}

const Top = ({ onSearch, onToggleFilter, showGenreFilter, searchQuery, sortOption, onSortChange }: TopProps) => {
  const [searchValue, setSearchValue] = useState(searchQuery);
  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "date-desc", label: "Newest First" },
    { value: "date-asc", label: "Oldest First" },
  ];

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  const handleChange = (query: string) => {
    setSearchValue(query);
    onSearch(query);
  };

  const handleSubmit = (query: string) => {
    onSearch(query);
  };

  return (
    <div className={styles.top}>
      <div className={styles.topHeader}>
        <h1 className={styles.pageTitle}></h1>
       
        <div className={styles.controls}>
        <CustomSelect
            label="Sort by:"
            options={sortOptions}
            value={sortOption}
            onChange={(value) => onSortChange(value as 'default' | 'date-asc' | 'date-desc')}
          />
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
              onSearch={handleSubmit}
              onChange={handleChange}
              value={searchValue}
              variant="head"
              size="medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

type GamesProps = {
  games: GamePreview[];
  gamesData: GameReadDto[];
  loading: boolean;
  isAdmin: boolean;
  onAddGameClick: () => void;
}

const Games = ({ games, gamesData, loading, isAdmin, onAddGameClick }: GamesProps) => {
  const renderGameSkeletons = (count: number = 6) => {
    return Array.from({ length: count }).map((_, index) => (
      <div key={`game-skeleton-${index}`} className={styles.gameSkeleton}>
        <div className={styles.gameSkeletonImage} />
        <div className={styles.gameSkeletonOverlay}>
          <div className={styles.gameSkeletonTitle} />
        </div>
      </div>
    ));
  };

  if (games.length === 0 && !loading) {
    return (
      <section className={styles.gamesSection}>
        <div className={styles.sectionHeader}>
          <SectionTitle title="Games" />
          {isAdmin && (
            <AddButton
              text="Add"
              onClick={onAddGameClick}
            />
          )}
        </div>
        <div className={styles.noGames}>
          <p>No games found</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className={styles.gamesSection}>
      <div className={styles.sectionHeader}>
        <SectionTitle title="Games" />
        {isAdmin && !loading && (
          <AddButton
            text="Add"
            onClick={onAddGameClick}
          />
        )}
      </div>
      <div className={styles.gamesGrid}>
        {loading ? (
          renderGameSkeletons(6)
        ) : (
          games.map((gamePreview) => {
            const gameFull = gamesData.find(g => g.id === gamePreview.id);
            return (
              <GameCard
                key={gamePreview.id}
                gamePreview={gamePreview}
                gameFull={gameFull}
              />
            );
          })
        )}
      </div>
    </section>
  );
};

export const AllGamesPageView: FC<AllGamesPageViewProps> = ({
  games,
  gamesData,
  allGames,
  loading,
  error,
  genres,
  selectedGenre,
  searchQuery,
  showGenreFilter,
  sortOption,
  isAdmin,
  showGameForm,
  handleSearch,
  handleGenreSelect,
  handleGameCreated,
  clearError,
  loadGames,
  toggleGenreFilter,
  resetFilters,
  setSort,
  setShowGameForm,
}) => {
  if (error) {
    return (
      <div className={styles.page}>
        <Header onSearch={handleSearch} />
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
      <Header onSearch={handleSearch} allGames={allGames} />
      {showGameForm && (
        <div className={styles.formContainer}>
          <GameForm
            onCancel={() => setShowGameForm(false)}
            onSuccess={handleGameCreated}
          />
        </div>
      )}
      <main className={styles.content}>
        <Top 
          onSearch={handleSearch}
          onToggleFilter={toggleGenreFilter}
          showGenreFilter={showGenreFilter}
          searchQuery={searchQuery}
          sortOption={sortOption}
          onSortChange={setSort}
        />
        
        {showGenreFilter && (
          <GenreFilter 
            genres={genres}
            selectedGenre={selectedGenre}
            onSelect={handleGenreSelect}
            onClose={toggleGenreFilter}
          />
        )}
        
        <ActiveFilters 
          selectedGenre={selectedGenre}
          onReset={resetFilters}
        />
        
        <Games 
          games={games}
          gamesData={gamesData}
          loading={loading}
          isAdmin={isAdmin}
          onAddGameClick={() => setShowGameForm(true)}
        />
      </main>
    </div>
  );
};

