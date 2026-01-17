
import type { FandomReadDto } from "../../../api/FandomApi";
import ErrorState from "../../../components/ErrorState/ErrorState";
import SectionTitle from "../../../components/UI/SectionTitle/SectionTitle";
import { AddButton } from "../../../components/UI/buttons/AddButton/AddButton";
import type { FandomPreview } from "../../../types/Fandom";
import FandomCard from "../../MainPage/FandomCard/FandomCard";
import styles from "./FandomsContent.module.scss";
import { getImageUrl } from "../../../utils/urlUtils";

type FandomWithStats = FandomReadDto | import("../../../api/FandomApi").FandomStatsDto;

type FandomsProps = {
  fandoms: FandomWithStats[];
  loading: boolean;
  error: string | null;
  gameTitle?: string | null;
  onAddFandomClick?: () => void; 
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
      {}
      <div className={styles.sectionHeader}>
        <SectionTitle title={`Fandoms ${hasFandoms && !loading ? `(${fandoms.length})` : ''}`} />
        {onAddFandomClick && !loading && (
          <AddButton
            text="Add"
            onClick={onAddFandomClick}
          />
        )}
      </div>

      {}
      {error ? (
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      ) : loading ? (
        
        <div className={styles.fandomsGrid}>
          {renderFandomSkeletons(6)}
        </div>
      ) : !hasFandoms ? (
        
        <div className={styles.emptyState}>
          <p>No fandoms found</p>
        </div>
      ) : (
        
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