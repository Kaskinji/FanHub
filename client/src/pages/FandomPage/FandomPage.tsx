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
          postsPreviews = await postApi.adaptToPostPreviews(posts);
        } catch (err) {
          console.error("Error fetching posts:", err);
          // Если не удалось загрузить посты, оставляем пустой массив
          postsPreviews = [];
        }
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

  if (loading) {
    return (
      <div className={styles.page}>
        <Header onSearch={() => {}} />
        <div className={styles.loading}>
          <p>Loading fandom data...</p>
        </div>
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
        <ShowMoreButton variant="light" onClick={handleShowEvents} />
        <SectionTitle title="Popular Posts" />
        <Posts
          posts={fandomData.postsPreviews}
          fandomId={fandomData.id}
          fandomName={fandomData.title}
        />
        <ShowMoreButton variant="light" onClick={handleShowMore} />
      </main>
    </div>
  );
}
