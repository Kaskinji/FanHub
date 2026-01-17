import type { FC } from "react";
import Header from "../../components/Header/Header";
import styles from "../AllFandomsPage/AllFandomsPage.module.scss";
import type { FandomReadDto, FandomStatsDto } from "../../api/FandomApi";
import { Top } from "./Top/Top.tsx";
import { FandomsContent } from "./FandomsContent/FandomsContent.tsx";
import { FandomForm } from "./FandomForm/FandomForm";

type FandomWithStats = FandomReadDto | FandomStatsDto;

type AllFandomsPageViewProps = {
  filteredFandoms: FandomWithStats[];
  selectedGame: string | null;
  loading: boolean;
  error: string | null;
  gameId: number | undefined;
  searchQuery: string;
  sortBy: 'name' | 'subscribers' | 'posts' | null;
  sortOrder: 'asc' | 'desc';
  showAddForm: boolean;
  handleSearch: (query: string) => void;
  handleSortChange: (sortType: 'name' | 'subscribers' | 'posts') => void;
  handleAddFandomClick: () => void;
  handleFandomCreated: () => void;
  handleCancelForm: () => void;
}

export const AllFandomsPageView: FC<AllFandomsPageViewProps> = ({
  filteredFandoms,
  selectedGame,
  loading,
  error,
  gameId,
  searchQuery,
  sortBy,
  sortOrder,
  showAddForm,
  handleSearch,
  handleSortChange,
  handleAddFandomClick,
  handleFandomCreated,
  handleCancelForm,
}) => {
  return (
    <div className={styles.page}>
      {showAddForm && (
        <div className={styles.formContainer}>
          <FandomForm
            gameId={gameId}
            onCancel={handleCancelForm}
            onSuccess={handleFandomCreated}
          />
        </div>
      )}
      <Header onSearch={() => {}} />
      <main className={styles.content}>
        <Top
          onSearch={handleSearch}
          gameTitle={selectedGame || ""}
          gameId={gameId}
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          hasStats={gameId !== undefined} 
        />
        
        <FandomsContent
          fandoms={filteredFandoms}
          loading={loading}
          error={error}
          gameTitle={selectedGame}
          onAddFandomClick={handleAddFandomClick}
        />
      </main>
    </div>
  );
};

