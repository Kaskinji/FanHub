import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import ShowMoreButton from "../../components/UI/buttons/ShowMoreButton/ShowMoreButton";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";
import type { FandomPageData } from "../../types/FandomPageData";
import type { FandomContextData } from "../../types/Fandom";
import { fandomApi, type FandomStatsDto } from "../../api/FandomApi";
import { subscriptionApi } from "../../api/SubscriptionApi";
import { postApi } from "../../api/PostApi";
import { eventApi } from "../../api/EventApi";
import { FandomCard } from "./FandomCard/FandomCard";
import { Posts } from "./Posts/Posts";
import { Events } from "./Events/Events";
import ErrorState from "../../components/ErrorState/ErrorState";
import styles from "./FandomPage.module.scss";

export default function FandomPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fandomData, setFandomData] = useState<FandomPageData | null>(null);
  const [initialIsCreator, setInitialIsCreator] = useState<boolean | null>(
    null
  );
  const [initialSubscriptionId, setInitialSubscriptionId] = useState<
    number | null | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasEvents, setHasEvents] = useState<boolean>(false);

  useEffect(() => {
    const fetchFandomData = async () => {
      if (!id) {
        setError("Fandom ID is not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fandomStats: FandomStatsDto =
          await fandomApi.getFandomWithStatsById(parseInt(id));

        let creatorResult: boolean | null = null;
        let subscriptionResult: number | null | undefined = undefined;

        try {
          creatorResult = await fandomApi.checkCreator(fandomStats.id);
        } catch (err) {
          console.error("Error checking creator status:", err);
          creatorResult = null;
        }

        try {
          subscriptionResult = await subscriptionApi.getCurrentUserSubscription(
            fandomStats.id
          );
        } catch (err) {
          console.error("Error checking subscription:", err);
          subscriptionResult = undefined;
        }

        // Загружаем популярные посты для фандома
        let postsPreviews: FandomPageData["postsPreviews"] = [];
        try {
          const posts = await postApi.getPopularPostsByFandom(
            fandomStats.id,
            3
          );
          postsPreviews = await postApi.adaptStatsDtosToPostPreviews(posts);
        } catch (err) {
          console.error("Error fetching posts:", err);
          // Если не удалось загрузить посты, оставляем пустой массив
          postsPreviews = [];
        }

        // Проверяем наличие событий
        let eventsExist = false;
        try {
          const events = await eventApi.getEvents(fandomStats.id);
          eventsExist = events.length > 0;
        } catch (err) {
          console.error("Error fetching events:", err);
          eventsExist = false;
        }
        setHasEvents(eventsExist);
        const transformedData: FandomPageData = {
          id: fandomStats.id,
          title: fandomStats.name,
          description: fandomStats.description,
          coverImage: fandomStats.coverImage || "",
          rules: fandomStats.rules,
          subscribersCount: fandomStats.subscribersCount,
          postsCount: fandomStats.postsCount,
          postsPreviews: postsPreviews,
          eventsPreviews: [],
        };

        setFandomData(transformedData);
        setInitialIsCreator(creatorResult);
        setInitialSubscriptionId(subscriptionResult);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load fandom data"
        );
        console.error("Error fetching fandom:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFandomData();
  }, [id]);

  // Функция для рендеринга скелетон-карточек постов
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

  // Функция для рендеринга скелетон-карточек событий
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

  if (loading) {
    return (
      <div className={styles.page}>
        <Header onSearch={() => {}} />
        <main className={styles.contentSkeleton}>
          {/* Скелетон для FandomCard */}
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
          
          {/* SectionTitle скелетон */}
          <div className={styles.sectionTitleSkeleton} />
          
          {/* Скелетоны для Events */}
          <section className={styles.eventsSkeleton}>
            {renderEventSkeletons(2)}
          </section>
          
          {/* SectionTitle скелетон */}
          <div className={styles.sectionTitleSkeleton} />
          
          {/* Скелетоны для Posts */}
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

  const handleShowMore = () => {
    navigate(`/posts`, {
      state: {
        fandomId: fandomData.id,
        fandomName: fandomData.title,
      } as FandomContextData,
    });
  };

  const handleShowEvents = () => {
    navigate(`/fandom/${fandomData.id}/events`);
  };

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
          <ShowMoreButton text="Go to posts"variant="light" onClick={handleShowMore} />
        ): <ShowMoreButton variant="light" onClick={handleShowMore} />}
      </main>
    </div>
  );
}
