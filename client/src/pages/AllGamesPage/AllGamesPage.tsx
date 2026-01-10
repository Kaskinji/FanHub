import Header from "../../components/Header/Header";
import SearchInput from "../../components/UI/SearchInput/SearchInput";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";
import styles from "../AllGamesPage/AllGamesPage.module.scss";
import Button from "../../components/UI/buttons/Button/Button";
import { AddButton } from "../../components/UI/buttons/AddButton/AddButton";
import type { GamePreview } from "../../types/AllGamesPageData";
import GameCard from "../MainPage/GameCard/GameCard";
import { useGames } from "../../hooks/useGames";
import { useEffect, useState } from "react";
import type { GameReadDto } from "../../api/GameApi";
import { useAuth } from "../../hooks/useAuth";
import { Role } from "../../types/enums/Roles";
import GameForm from "../../pages/AllGamesPage/GameForm/GameForm";
import arrowBottomIcon from "../../assets/arrow-bottom.svg";


export default function AllGamesPage() {
  const {
    games,
    gamesData,
    loading,
    error,
    genres,
    selectedGenre,
    showGenreFilter,
    sortOption,
    loadGames,
    searchGames,
    filterByGenre,
    toggleGenreFilter,
    resetFilters,
    clearError,
    setSort
  } = useGames();

  const { user } = useAuth();
  const isAdmin = user?.role === Role.Admin;
  const [showGameForm, setShowGameForm] = useState(false);

  useEffect(() => {
    loadGames();
  }, []);

  
  const handleSearch = (query: string) => {
    searchGames(query);
  };

  const handleGenreSelect = (genre: string) => {
    filterByGenre(genre);
  };

  const handleGameCreated = () => {
    setShowGameForm(false);
    loadGames(); // Перезагружаем игры после создания
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
        {showGameForm && (
        <div className={styles.formContainer}>
          <GameForm
            onCancel={() => setShowGameForm(false)}
            onSuccess={handleGameCreated}
          />
        </div>
      )}
      <Content 
        games={games}
        gamesData={gamesData}
        loading={loading}
        genres={genres}
        isAdmin={isAdmin}
        selectedGenre={selectedGenre}
        showGenreFilter={showGenreFilter}
        sortOption={sortOption}
        onSearch={handleSearch}
        onGenreSelect={handleGenreSelect}
        onToggleFilter={toggleGenreFilter}
        onResetFilters={resetFilters}
        onSortChange={setSort}
        onAddGameClick={() => setShowGameForm(true)}
      />
    </div>
  );
}

/* ================= CONTENT ================= */
interface ContentProps {
  games: GamePreview[];
  gamesData: GameReadDto[];
  loading: boolean;
  genres: string[];
  isAdmin: boolean;
  selectedGenre: string;
  showGenreFilter: boolean;
  sortOption: 'default' | 'date-asc' | 'date-desc';
  onSearch: (query: string) => void;
  onGenreSelect: (genre: string) => void;
  onToggleFilter: () => void;
  onResetFilters: () => void;
  onSortChange: (option: 'default' | 'date-asc' | 'date-desc') => void;
  onAddGameClick: () => void;
}
function Content({   
  games, 
  loading, 
  gamesData,
  genres, 
  selectedGenre, 
  showGenreFilter,
  sortOption,
  isAdmin,
  onSearch, 
  onGenreSelect,
  onToggleFilter,
  onResetFilters,
  onSortChange,
  onAddGameClick   
}: ContentProps) {
  return (
    <main className={styles.content}>
      <Top 
        onSearch={onSearch}
        onToggleFilter={onToggleFilter}
        showGenreFilter={showGenreFilter}
        sortOption={sortOption}
        onSortChange={onSortChange}
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
      
      <Games 
        games={games}
        gamesData={gamesData} // ← Передаем
        loading={loading}
        isAdmin={isAdmin}
        onAddGameClick={onAddGameClick}
      />
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
  sortOption: 'default' | 'date-asc' | 'date-desc';
  onSortChange: (option: 'default' | 'date-asc' | 'date-desc') => void;
}

function Top({ onSearch, onToggleFilter, showGenreFilter, sortOption, onSortChange }: TopProps) {
  return (
    <div className={styles.top}>
      <div className={styles.topHeader}>
        <h1 className={styles.pageTitle}></h1>
       
        <div className={styles.controls}>
        <div className={styles.sortWrapper}>
            <label className={styles.sortLabel}>Sort by:</label>
            <select 
              className={styles.sortSelect}
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as 'default' | 'date-asc' | 'date-desc')}
              style={{ '--arrow-icon': `url(${arrowBottomIcon})` } as React.CSSProperties}
            >
                <option value="default">Default</option>
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
            </select>
          </div>
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
  gamesData: GameReadDto[]; // ← Добавляем полные данные
  loading: boolean;
   isAdmin: boolean;
  onAddGameClick: () => void;
}
function Games({ games, gamesData, loading,  isAdmin, onAddGameClick  }: AllGamesProps) {
  if (loading) {
    return (
      <section className={styles.gamesSection}>
        
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
      <div className={styles.sectionHeader}>
        <SectionTitle title="Games" />
        {isAdmin && (
          <AddButton
            text="Add"
            onClick={onAddGameClick}
          />
        )}
      </div>
      <div className={styles.gamesGrid}>
        {games.map((gamePreview) => {
          const gameFull = gamesData.find(g => g.id === gamePreview.id);
          return (
            <GameCard
              key={gamePreview.id}
              gamePreview={gamePreview}
              gameFull={gameFull}
            />
          );
        })}
      </div>
    </section>
  );
}