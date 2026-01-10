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

  // Функция для рендеринга skeleton-карточек фандомов
  const renderFandomSkeletons = (count: number = 6) => {
    return Array.from({ length: count }).map((_, index) => (
      <div key={`fandom-skeleton-${index}`} className={styles.fandomSkeleton}>
        <div className={styles.fandomSkeletonImage} />
        <div className={styles.fandomSkeletonOverlay}>
          <div className={styles.fandomSkeletonTitle} />
        </div>
      </div>
    ));
  };

  const hasFandoms = fandoms.length > 0;

  return (
    <section className={styles.fandomsSection}>
      {/* Заголовок с кнопкой добавления */}
      <div className={styles.sectionHeader}>
        <SectionTitle title={`Fandoms ${hasFandoms && !loading ? `(${fandoms.length})` : ''}`} />
        {onAddFandomClick && !loading && (
          <AddButton
            text="Add"
            onClick={onAddFandomClick}
          />
        )}
      </div>

      {/* Состояние ошибки */}
      {error ? (
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      ) : loading ? (
        /* Skeleton при загрузке */
        <div className={styles.fandomsGrid}>
          {renderFandomSkeletons(6)}
        </div>
      ) : !hasFandoms ? (
        /* Пустое состояние */
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