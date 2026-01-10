// FandomsContent/FandomsContent.tsx
import type { FandomReadDto } from "../../../api/FandomApi";
import ErrorState from "../../../components/ErrorState/ErrorState";
import SectionTitle from "../../../components/UI/SectionTitle/SectionTitle";
import { AddButton } from "../../../components/UI/buttons/AddButton/AddButton";
import type { FandomPreview } from "../../../types/Fandom";
import FandomCard from "../../MainPage/FandomCard/FandomCard";
import styles from "./FandomsContent.module.scss";
import { getImageUrl } from "../../../utils/urlUtils";

type FandomWithStats = FandomReadDto | import("../../../api/FandomApi").FandomStatsDto;

interface FandomsProps {
  fandoms: FandomWithStats[];
  loading: boolean;
  error: string | null;
  gameTitle?: string | null;
  onAddFandomClick?: () => void; // Колбек для открытия формы
}

export const FandomsContent = ({ 
  fandoms, 
  loading, 
  error, 
  onAddFandomClick 
}: FandomsProps) => {
  const convertToPreview = (fandom: FandomWithStats): FandomPreview => ({
    id: fandom.id,
    name: fandom.name,
    imageUrl: fandom.coverImage ? getImageUrl(fandom.coverImage) : undefined, 
  });

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

  if (loading) {
    return (
      <section className={styles.fandomsSection}>
        <div className={styles.sectionHeader}>
          <SectionTitle title="Fandoms" />
          {onAddFandomClick && (
            <AddButton
              text="Add"
              onClick={onAddFandomClick}
            />
          )}
        </div>
        <div className={styles.fandomsGrid}>
          {renderSkeletons(5)}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.fandomsSection}>
        <div className={styles.sectionHeader}>
        <SectionTitle title="Fandoms" />

        </div>
       
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