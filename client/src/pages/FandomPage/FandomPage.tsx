import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import ShowMoreButton from "../../components/UI/buttons/ShowMoreButton/ShowMoreButton";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";
import { TitleCard } from "../../components/TitleCard/TitleCard";
import type { FandomPageData } from "../../types/FandomPageData";
import type { FandomContextData } from "../../types/Fandom";
import { fandomApi, type FandomStatsDto } from "../../api/FandomApi";
import { subscriptionApi } from "../../api/SubscriptionApi";
import postIcon from "../../assets/postIcon.svg";
import subscriberIcon from "../../assets/subscriberIcon.svg";
import styles from "./FandomPage.module.scss";
import InfoBox from "../../components/UI/InfoBox/InfoBox";
import ErrorMessage from "../../components/UI/ErrorMessage/ErrorMessage";
import ErrorState from "../../components/ErrorState/ErrorState";

// Моковые данные для постов и ивентов
const mockPosts = [
  {
    id: 1,
    title: "Guide for 100% completion",
    image: "/images/geralt.jpg",
    author: {
      id: 101,
      username: "GeraltOfRivia",
      avatar: "/images/geralt-avatar.jpg",
    },
    reactions: [
      { type: "like" as const, count: 42 },
      { type: "fire" as const, count: 15 },
    ],
  },
  {
    id: 2,
    title: "The best decks for gwent",
    image: "/images/geralt2.jpg",
    author: {
      id: 102,
      username: "Plotva",
      avatar: "/images/plotva-avatar.jpg",
    },
    reactions: [
      { type: "like" as const, count: 89 },
      { type: "fire" as const, count: 32 },
    ],
  },
  {
    id: 3,
    title: "Top 10 alcohol in Novigrad",
    image: "/images/geralt3.jpg",
    author: {
      id: 103,
      username: "Zoltan",
      avatar: "/images/zoltan-avatar.jpg",
    },
    reactions: [
      { type: "like" as const, count: 156 },
      { type: "fire" as const, count: 45 },
    ],
  },
];

const mockEvents = [
  {
    id: 1,
    title: "Fanart contest",
    image: "/images/tousant.jpg",
  },
  {
    id: 2,
    title: "Quiz the Witcher Bestiary",
    image: "/images/ivasik.jpg",
  },
];

export default function FandomPage() {
  const { id } = useParams<{ id: string }>();
  const [fandomData, setFandomData] = useState<FandomPageData | null>(null);
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
        // Получаем данные фандома со статистикой
        const fandomStats: FandomStatsDto =
          await fandomApi.getFandomWithStatsById(parseInt(id));

        // Преобразуем данные из API в формат страницы
        const transformedData: FandomPageData = {
          id: fandomStats.id,
          title: fandomStats.name,
          description: fandomStats.description,
          coverImage: fandomStats.coverImage,
          rules: fandomStats.rules,
          subscribersCount: fandomStats.subscribersCount,
          postsCount: fandomStats.postsCount,
          postsPreviews: mockPosts, // Используем моковые посты
          eventsPreviews: mockEvents, // Используем моковые ивенты
        };

        setFandomData(transformedData);
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

            <ErrorState className={styles.errorStateWrapper} error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!fandomData) {
    return (
      <div className={styles.page}>
        <Header onSearch={() => {}} />
        <ErrorState error={"Fandom is not found"} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header onSearch={() => {}} />
      <Content fandom={fandomData} />
    </div>
  );
}

/* ================= CONTENT ================= */

interface ContentProps {
  fandom: FandomPageData;
}

function Content({ fandom }: ContentProps) {
  const navigate = useNavigate();

  const handleShowMore = () => {
    navigate(`/posts`, {
      state: {
        fandomId: fandom.id,
        fandomName: fandom.title,
      } as FandomContextData,
    });
  };

  return (
    <main className={styles.content}>
      <FandomCard fandom={fandom} />
      <SectionTitle title="Events" />
      <Events events={fandom.eventsPreviews} />
      <ShowMoreButton variant="light" />
      <SectionTitle title="Popular Posts" />
      <Posts posts={fandom.postsPreviews} />
      <ShowMoreButton variant="light" onClick={handleShowMore} />
    </main>
  );
}

/* ================= FANDOM CARD ================= */
interface FandomCardProps {
  fandom: FandomPageData;
}

function FandomCard({ fandom }: FandomCardProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(
    null
  );
  const [subscribersCount, setSubscribersCount] = useState(
    fandom.subscribersCount
  );

  // Проверяем подписку пользователя при загрузке
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const subscription = await subscriptionApi.getCurrentUserSubscription(
          fandom.id
        );
        if (subscription !== null ) {
          console.log("result:", subscription)
          setIsSubscribed(true);
          setSubscriptionId(subscription);
        } else {
          setIsSubscribed(false);
        }
      } catch (err) {
        console.error("Error checking subscription:", err);
      }
    };

    checkSubscription();
  }, [fandom.id]);

  const handleSubscribe = async () => {
    if (loading) return;

    setLoading(true);
    setSubscriptionError(null);

    try {
      if (isSubscribed && subscriptionId) {
        await subscriptionApi.deleteSubscription(subscriptionId);
        setIsSubscribed(false);
        setSubscriptionId(null);
        setSubscribersCount((prev) => prev - 1);
      } else {
        const newSubscriptionId = await subscriptionApi.createSubscription({
          fandomId: fandom.id,
        });
        setIsSubscribed(true);
        setSubscriptionId(newSubscriptionId);
        setSubscribersCount((prev) => prev + 1);
      }
    } catch (err) {
      setSubscriptionError(
        err instanceof Error ? err.message : "Failed to update subscription"
      );
      console.error("Subscription error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {subscriptionError && (
        <ErrorMessage message={subscriptionError} onClose={() => setSubscriptionError(null)}/>
      )}
      <section className={styles.fandomCard}>
        <div className={styles.fandomLeft}>
          <div className={styles.cardTitle}>
            <TitleCard
              className={styles.fandomTitleCard}
              title={fandom.title}
              image={fandom.coverImage}
            />
            <div className={styles.statsWrapper}>
              <button
                className={`${styles.subscribeButton} ${isSubscribed ? styles.subscribed : ""}`}
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading
                  ? "Loading..."
                  : isSubscribed
                    ? "Unsubscribe"
                    : "Subscribe"}
              </button>

              <div className={styles.fandomStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{subscribersCount}</span>
                  <img
                    className={styles.statIcon}
                    src={subscriberIcon}
                    alt="Subscribers"
                  />
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{fandom.postsCount}</span>
                  <img className={styles.statIcon} src={postIcon} alt="Posts" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <FandomRight fandom={fandom} />
      </section>
    </>
  );
}

interface FandomRightProps {
  fandom: FandomPageData;
}

function FandomRight({ fandom }: FandomRightProps) {
  return (
    <div className={styles.fandomRight}>
      <InfoBox title="ℹ️ Description" info={fandom.description} />
      <InfoBox title="⚠️ Rules" info={fandom.rules} />
    </div>
  );
}

/* ================= POSTS ================= */
interface PostProps {
  posts: FandomPageData["postsPreviews"];
}

function Posts({ posts }: PostProps) {
  return (
    <section className={styles.posts}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          title={post.title}
          image={post.image}
          author={post.author}
          reactions={post.reactions}
        />
      ))}
    </section>
  );
}

interface PostCardProps {
  title: string;
  image: string;
  author: {
    id: number;
    username: string;
    avatar?: string;
  };
  reactions?: Array<{ type: "like" | "fire"; count: number }>;
}

function PostCard({ title, image, author, reactions }: PostCardProps) {
  return (
    <div className={styles.postCard}>
      <img src={image} alt={title} className={styles.postImage} />
      <div className={styles.postContent}>
        <h4>{title}</h4>
        <div className={styles.postMeta}>
          <div className={styles.reactions}>
            {reactions?.map((reaction, index) => (
              <span key={index} className={styles.reaction}>
                {reaction.type === "like" ? "👍" : "🔥"} {reaction.count}
              </span>
            ))}
          </div>
          <div className={styles.author}>
            {author.avatar && (
              <img
                src={author.avatar}
                alt={author.username}
                className={styles.avatar}
              />
            )}
            <span>{author.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= EVENTS ================= */
interface EventsProps {
  events: FandomPageData["eventsPreviews"];
}

function Events({ events }: EventsProps) {
  return (
    <section className={styles.events}>
      {events.map((event) => (
        <EventCard key={event.id} title={event.title} image={event.image} />
      ))}
    </section>
  );
}

interface EventCardProps {
  title: string;
  image?: string;
}

function EventCard({ title, image }: EventCardProps) {
  return (
    <div className={styles.eventCard}>
      {image && <img src={image} alt={title} className={styles.eventImage} />}
      <div className={styles.eventContent}>
        <h4>{title}</h4>
      </div>
    </div>
  );
}
