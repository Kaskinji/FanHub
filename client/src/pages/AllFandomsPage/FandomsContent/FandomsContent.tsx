// FandomsContent/FandomsContent.tsx
import type { FandomReadDto } from "../../../api/FandomApi";
import ErrorState from "../../../components/ErrorState/ErrorState";
import SectionTitle from "../../../components/UI/SectionTitle/SectionTitle";
import type { FandomPreview } from "../../../types/Fandom";
import FandomCard from "../../MainPage/FandomCard/FandomCard";
import styles from "./FandomsContent.module.scss";

interface FandomsProps {
  fandoms: FandomReadDto[];
  loading: boolean;
  error: string | null;
  gameId?: number;
  onAddFandomClick?: () => void; // Колбек для открытия формы
}

export const FandomsContent = ({ 
  fandoms, 
  loading, 
  error, 
  gameId,
  onAddFandomClick 
}: FandomsProps) => {
  const convertToPreview = (fandom: FandomReadDto): FandomPreview => ({
    id: fandom.id,
    name: fandom.name,
    imageUrl: fandom.coverImage, 
  });

  if (loading) {
    return (
      <section className={styles.fandomsSection}>
        <SectionTitle title="Fandoms" />
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading fandoms...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.fandomsSection}>
        <SectionTitle title="Fandoms" />
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      </section>
    );
  }

  const hasFandoms = fandoms.length > 0;

  return (
    <section className={styles.fandomsSection}>
      {/* Заголовок с кнопкой добавления */}
      <div className={styles.sectionHeader}>
        <SectionTitle title={`Fandoms ${hasFandoms ? `(${fandoms.length})` : ''}`} />
        {onAddFandomClick && (
          <button
            className={styles.addFandomButton}
            onClick={onAddFandomClick}
          >
            + Add Fandom
          </button>
        )}
      </div>

      {/* Пустое состояние */}
      {!hasFandoms ? (
        <div className={styles.emptyState}>
          <p>No fandoms found{gameId ? " for this game" : ""}.</p>
          <p className={styles.emptySubtext}>
            {gameId
              ? "Be the first to create a fandom for this game!"
              : "Create a new fandom to get started."}
          </p>
          {onAddFandomClick && (
            <button
              className={styles.emptyAddButton}
              onClick={onAddFandomClick}
            >
              Create Fandom
            </button>
          )}
        </div>
      ) : (
        /* Список фандомов */
        <div className={styles.fandomsGrid}>
          {fandoms.map((fandom) => (
            <FandomCard
              key={fandom.id}
              id={fandom.id}
              name={fandom.name}
              imageUrl={convertToPreview(fandom).imageUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}