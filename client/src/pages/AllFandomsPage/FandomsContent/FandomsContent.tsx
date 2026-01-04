// FandomsContent/FandomsContent.tsx
import type { FandomReadDto } from "../../../api/FandomApi";
import ErrorState from "../../../components/ErrorState/ErrorState";
import SectionTitle from "../../../components/UI/SectionTitle/SectionTitle";
import { AddButton } from "../../../components/UI/buttons/AddButton/AddButton";
import type { FandomPreview } from "../../../types/Fandom";
import FandomCard from "../../MainPage/FandomCard/FandomCard";
import styles from "./FandomsContent.module.scss";
import { getImageUrl } from "../../../utils/urlUtils";

interface FandomsProps {
  fandoms: FandomReadDto[];
  loading: boolean;
  error: string | null;
  gameTitle?: string | null;
  onAddFandomClick?: () => void; // Колбек для открытия формы
}

export const FandomsContent = ({ 
  fandoms, 
  loading, 
  error, 
  gameTitle,
  onAddFandomClick 
}: FandomsProps) => {
  const convertToPreview = (fandom: FandomReadDto): FandomPreview => ({
    id: fandom.id,
    name: fandom.name,
    imageUrl: fandom.coverImage ? getImageUrl(fandom.coverImage) : undefined, 
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
          <AddButton
            text="Add"
            onClick={onAddFandomClick}
          />
        )}
      </div>

      {/* Пустое состояние */}
      {!hasFandoms ? (
        <div className={styles.emptyState}>
          <p>No fandoms found</p>
          <p className={styles.emptySubtext}>
              Be the first who'll create a fandom for <strong>{`${gameTitle}`}!</strong>
          </p>
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