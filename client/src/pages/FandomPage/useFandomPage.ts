import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { FandomPageData } from "../../types/FandomPageData";
import type { FandomContextData } from "../../types/Fandom";
import { fandomApi, type FandomStatsDto } from "../../api/FandomApi";
import { subscriptionApi } from "../../api/SubscriptionApi";
import { postApi } from "../../api/PostApi";
import { eventApi } from "../../api/EventApi";

export const useFandomPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fandomData, setFandomData] = useState<FandomPageData | null>(null);
  const [initialIsCreator, setInitialIsCreator] = useState<boolean | null>(null);
  const [initialSubscriptionId, setInitialSubscriptionId] = useState<number | null | undefined>(undefined);
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
        const fandomStats: FandomStatsDto = await fandomApi.getFandomWithStatsById(parseInt(id));

        let creatorResult: boolean | null = null;
        let subscriptionResult: number | null | undefined = undefined;

        try {
          creatorResult = await fandomApi.checkCreator(fandomStats.id);
        } catch (err) {
          console.error("Error checking creator status:", err);
          creatorResult = null;
        }

        try {
          subscriptionResult = await subscriptionApi.getCurrentUserSubscription(fandomStats.id);
        } catch (err) {
          console.error("Error checking subscription:", err);
          subscriptionResult = undefined;
        }

        let postsPreviews: FandomPageData["postsPreviews"] = [];
        try {
          const posts = await postApi.getPopularPostsByFandom(fandomStats.id, 3);
          postsPreviews = await postApi.adaptStatsDtosToPostPreviews(posts);
        } catch (err) {
          console.error("Error fetching posts:", err);
          postsPreviews = [];
        }

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
        setError(err instanceof Error ? err.message : "Failed to load fandom data");
        console.error("Error fetching fandom:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFandomData();
  }, [id]);

  const handleShowMore = () => {
    if (!fandomData) return;
    navigate(`/fandom/${fandomData.id}/posts`, {
      state: {
        fandomId: fandomData.id,
        fandomName: fandomData.title,
      } as FandomContextData,
    });
  };

  const handleShowEvents = () => {
    if (!fandomData) return;
    navigate(`/fandom/${fandomData.id}/events`);
  };

  return {
    fandomData,
    initialIsCreator,
    initialSubscriptionId,
    loading,
    error,
    hasEvents,
    handleShowMore,
    handleShowEvents,
  };
};

