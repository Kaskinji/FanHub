import { useEffect, useState } from "react";
import { TitleCard } from "../../../components/TitleCard/TitleCard";
import { FandomForm } from "../../AllFandomsPage/FandomForm/FandomForm";
import InfoBox from "../../../components/UI/InfoBox/InfoBox";
import ErrorMessage from "../../../components/UI/ErrorMessage/ErrorMessage";
import { fandomApi } from "../../../api/FandomApi";
import { subscriptionApi } from "../../../api/SubscriptionApi";
import type { FandomPageData } from "../../../types/FandomPageData";
import postIcon from "../../../assets/postIcon.svg";
import subscriberIcon from "../../../assets/subscriberIcon.svg";
import styles from "./FandomCard.module.scss";

interface FandomCardProps {
  fandom: FandomPageData;
  initialIsCreator?: boolean | null;
  initialSubscriptionId?: number | null | undefined;
}

export function FandomCard({ fandom, initialIsCreator, initialSubscriptionId }: FandomCardProps) {
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [subscribersCount, setSubscribersCount] = useState(fandom.subscribersCount);
  const [isCreator, setIsCreator] = useState(false);
  const [showManageForm, setShowManageForm] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    if (initialIsCreator !== undefined) setIsCreator(Boolean(initialIsCreator));

    if (initialSubscriptionId !== undefined) {
      if (initialSubscriptionId === null) {
        setIsSubscribed(false);
        setSubscriptionId(null);
      } else {
        setIsSubscribed(true);
        setSubscriptionId(initialSubscriptionId as number);
      }
      setInitialCheckDone(true);
      return;
    }

    const checkCreator = async () => {
      try {
        const result = await fandomApi.checkCreator(fandom.id);
        setIsCreator(result);
      } catch (err) {
        console.error("Error checking creator status:", err);
      }
    };

    const checkSubscription = async () => {
      try {
        const subscription = await subscriptionApi.getCurrentUserSubscription(fandom.id);
        if (subscription !== null) {
          setIsSubscribed(true);
          setSubscriptionId(subscription);
        } else {
          setIsSubscribed(false);
        }
      } catch (err) {
        console.error("Error checking subscription:", err);
      } finally {
        setInitialCheckDone(true);
      }
    };

    checkCreator();
    checkSubscription();
  }, [fandom.id, initialIsCreator, initialSubscriptionId]);

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
        const newSubscriptionId = await subscriptionApi.createSubscription({ fandomId: fandom.id });
        setIsSubscribed(true);
        setSubscriptionId(newSubscriptionId);
        setSubscribersCount((prev) => prev + 1);
      }
    } catch (err) {
      setSubscriptionError(err instanceof Error ? err.message : "Failed to update subscription");
      console.error("Subscription error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {subscriptionError && (
        <ErrorMessage message={subscriptionError} onClose={() => setSubscriptionError(null)} />
      )}
      <section className={styles.fandomCard}>
        <div className={styles.fandomLeft}>
          <div className={styles.cardTitle}>
            <TitleCard className={styles.fandomTitleCard} title={fandom.title} image={fandom.coverImage} />
            <div className={styles.statsWrapper}>
              {isCreator ? (
                <>
                  <button className={styles.manageButton} onClick={() => setShowManageForm(true)} disabled={loading}>
                    Manage Fandom
                  </button>

                  {showManageForm && (
                    <div className={styles.formContainer}>
                      <FandomForm
                        fandomId={fandom.id}
                        onCancel={() => setShowManageForm(false)}
                        onSuccess={() => {
                          setShowManageForm(false);
                          window.location.reload();
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                !initialCheckDone ? (
                  <button className={styles.subscribeButton} disabled>
                    Loading...
                  </button>
                ) : (
                  <button
                    className={`${styles.subscribeButton} ${isSubscribed ? styles.subscribed : ""}`}
                    onClick={handleSubscribe}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
                  </button>
                )
              )}

              <div className={styles.fandomStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{subscribersCount}</span>
                  <img className={styles.statIcon} src={subscriberIcon} alt="Subscribers" />
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{fandom.postsCount}</span>
                  <img className={styles.statIcon} src={postIcon} alt="Posts" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.fandomRight}>
          <InfoBox title="ℹ️ Description" info={fandom.description} className={styles.description}/>
          <InfoBox title="⚠️ Rules" info={fandom.rules} className={styles.rules} />
        </div>
      </section>
    </>
  );
}

export default FandomCard;

