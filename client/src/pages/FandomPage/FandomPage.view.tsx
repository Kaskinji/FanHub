import type { FC } from "react";
import Header from "../../components/Header/Header";
import ShowMoreButton from "../../components/UI/buttons/ShowMoreButton/ShowMoreButton";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";
import type { FandomPageData } from "../../types/FandomPageData";
import { FandomCard } from "./FandomCard/FandomCard";
import { Posts } from "./Posts/Posts";
import { Events } from "./Events/Events";
import ErrorState from "../../components/ErrorState/ErrorState";
import styles from "./FandomPage.module.scss";

type FandomPageViewProps = {
  fandomData: FandomPageData | null;
  initialIsCreator: boolean | null;
  initialSubscriptionId: number | null | undefined;
  loading: boolean;
  error: string | null;
  hasEvents: boolean;
  handleShowMore: () => void;
  handleShowEvents: () => void;
}

const renderPostSkeletons = (count: number) => {
  return Array.from({ length: count }).map((_, index) => (
    <div key={`skeleton-post-${index}`} className={styles.postCardSkeleton}>
      <div className={styles.postCardSkeletonImage} />
      <div className={styles.postCardSkeletonContent}>
        <div className={styles.postCardSkeletonTitle} />
        <div className={styles.postCardSkeletonReactions} />
        <div className={styles.postCardSkeletonMeta} />
      </div>
    </div>
  ));
};

const renderEventSkeletons = (count: number) => {
  return Array.from({ length: count }).map((_, index) => (
    <div key={`skeleton-event-${index}`} className={styles.eventCardSkeleton}>
      <div className={styles.eventCardSkeletonImage} />
      <div className={styles.eventCardSkeletonContent}>
        <div className={styles.eventCardSkeletonTitle} />
      </div>
    </div>
  ));
};

export const FandomPageView: FC<FandomPageViewProps> = ({
  fandomData,
  initialIsCreator,
  initialSubscriptionId,
  loading,
  error,
  hasEvents,
  handleShowMore,
  handleShowEvents,
}) => {
  if (loading) {
    return (
      <div className={styles.page}>
        <Header onSearch={() => {}} />
        <main className={styles.contentSkeleton}>
          <section className={styles.fandomCardSkeleton}>
            <div className={styles.fandomCardSkeletonLeft}>
              <div className={styles.fandomCardSkeletonTitleImage} />
              <div className={styles.fandomCardSkeletonStats}>
                <div className={styles.fandomCardSkeletonStat} />
              </div>
            </div>
            <div className={styles.fandomCardSkeletonRight}>
              <div className={styles.fandomCardSkeletonInfoBox} />
              <div className={styles.fandomCardSkeletonInfoBox} />
            </div>
          </section>
          <div className={styles.sectionTitleSkeleton} />
          <section className={styles.eventsSkeleton}>
            {renderEventSkeletons(2)}
          </section>
          <div className={styles.sectionTitleSkeleton} />
          <section className={styles.postsSkeleton}>
            {renderPostSkeletons(3)}
          </section>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Header onSearch={() => {}} />
        <ErrorState
          className={styles.errorStateWrapper}
          error={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!fandomData) {
    return (
      <div className={styles.page}>
        <Header onSearch={() => {}} />
        <ErrorState
          error={"Fandom is not found"}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header onSearch={() => {}} />
      <main className={styles.content}>
        <FandomCard
          fandom={fandomData}
          initialIsCreator={initialIsCreator}
          initialSubscriptionId={initialSubscriptionId}
        />
        <SectionTitle title="Events" />
        <Events fandomId={fandomData.id} />
        {hasEvents ? (
          <ShowMoreButton variant="light" onClick={handleShowEvents} />
        ) : initialIsCreator === true ? (
          <ShowMoreButton text="Go to Events" variant="light" onClick={handleShowEvents} />
        ) : null}
        <SectionTitle title="Popular Posts" />
        <Posts
          posts={fandomData.postsPreviews}
          fandomId={fandomData.id}
          fandomName={fandomData.title}
        />
        {(fandomData.postsPreviews.length == 0 || fandomData.postsCount == 0) ? (
          <ShowMoreButton text="Go to posts" variant="light" onClick={handleShowMore} />
        ) : <ShowMoreButton variant="light" onClick={handleShowMore} />}
      </main>
    </div>
  );
};

