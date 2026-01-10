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
import { CustomSelect } from "../../components/UI/CustomSelect/CustomSelect";


export default function AllGamesPage() {
  const {
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
      <Header onSearch={handleSearch} onSignIn={() => {}} allGames={allGames} />
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
        searchQuery={searchQuery}
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
  searchQuery: string;
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
  searchQuery,
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

        searchQuery={searchQuery}

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
  searchQuery: string;
  sortOption: 'default' | 'date-asc' | 'date-desc';
  onSortChange: (option: 'default' | 'date-asc' | 'date-desc') => void;
}

function Top({ onSearch, onToggleFilter, showGenreFilter, searchQuery, sortOption, onSortChange }: TopProps) {
  const [searchValue, setSearchValue] = useState(searchQuery);
  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "date-desc", label: "Newest First" },
    { value: "date-asc", label: "Oldest First" },
  ];

  // Синхронизируем локальное состояние с пропом (например, при сбросе фильтров)
  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  const handleChange = (query: string) => {
    setSearchValue(query);
    onSearch(query); // Фильтрация происходит сразу при изменении
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
  // Функция для рендеринга skeleton-карточек игр
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
}