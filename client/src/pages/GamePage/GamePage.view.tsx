import type { FC } from "react";
import Header from "../../components/Header/Header";
import styles from "./GamePage.module.scss";
import Button from "../../components/UI/buttons/Button/Button";
import type { GamePageData } from "../../types/GamePageData";
import GameForm from "../AllGamesPage/GameForm/GameForm";
import { Content } from "./Content/Content";

type GamePageViewProps = {
  gameData: GamePageData | null;
  loading: boolean;
  error: string | null;
  showGameForm: boolean;
  isAdmin: boolean;
  handleSearch: (query: string) => void;
  handleShowMore: () => void;
  handleRetry: () => void;
  handleBackToGames: () => void;
  handleGameUpdated: () => void;
  handleCloseGameForm: () => void;
  setShowGameForm: (show: boolean) => void;
}

const renderFandomSkeletons = (count: number) => {
  return Array.from({ length: count }).map((_, index) => (
    <div key={`skeleton-fandom-${index}`} className={styles.fandomCardSkeleton}>
      <div className={styles.fandomCardSkeletonImage} />
      <div className={styles.fandomCardSkeletonContent}>
        <div className={styles.fandomCardSkeletonTitle} />
        <div className={styles.fandomCardSkeletonText} />
      </div>
    </div>
  ));
};

export const GamePageView: FC<GamePageViewProps> = ({
  gameData,
  loading,
  error,
  showGameForm,
  isAdmin,
  handleSearch,
  handleShowMore,
  handleRetry,
  handleBackToGames,
  handleGameUpdated,
  handleCloseGameForm,
  setShowGameForm,
}) => {
  if (loading) {
    return (
      <div className={styles.page}>
        <Header onSearch={handleSearch} />
        <main className={styles.contentSkeleton}>
          <section className={styles.gameCardSkeleton}>
            <div className={styles.gameCardSkeletonLeft}>
              <div className={styles.gameCardSkeletonTitleImage} />
              <div className={styles.gameCardSkeletonStats}>
                <div className={styles.gameCardSkeletonStat} />
              </div>
            </div>
            <div className={styles.gameCardSkeletonRight}>
              <div className={styles.gameCardSkeletonDescription}>
                <div className={styles.gameCardSkeletonLine} />
                <div className={styles.gameCardSkeletonLine} />
                <div className={styles.gameCardSkeletonLine} />
                <div className={styles.gameCardSkeletonLineShort} />
              </div>
              <div className={styles.gameCardSkeletonDetails}>
                <div className={styles.gameCardSkeletonDetail} />
                <div className={styles.gameCardSkeletonDetail} />
                <div className={styles.gameCardSkeletonDetail} />
                <div className={styles.gameCardSkeletonDetail} />
              </div>
            </div>
          </section>
          <div className={styles.sectionTitleSkeleton} />
          <section className={styles.fandomsSkeleton}>
            {renderFandomSkeletons(2)}
          </section>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Header onSearch={handleSearch} />
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
        <Header onSearch={handleSearch} />
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
      <Header onSearch={handleSearch} />
      {showGameForm && (
        <div 
          className={styles.formContainer}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
              setShowGameForm(false);
            }
          }}
        >
          <GameForm
            gameId={gameData.id}
            onCancel={handleCloseGameForm}
            onSuccess={handleGameUpdated}
          />
        </div>
      )}
      <Content 
        game={gameData} 
        onShowMore={handleShowMore}
        isAdmin={isAdmin}
        onEditGame={() => setShowGameForm(true)}
      />
    </div>
  );
};

