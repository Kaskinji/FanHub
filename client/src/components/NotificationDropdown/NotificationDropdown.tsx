import { useEffect, useState, useRef, useCallback, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { fandomNotificationApi } from "../../api/FandomNotificationApi";
import { fandomApi } from "../../api/FandomApi";
import { eventApi } from "../../api/EventApi";
import type { NotificationWithViewedDto } from "../../types/NotificationViewed";
import { FandomNotificationType } from "../../types/enums/FandomNotificationType";
import { FirstLetter } from "../UI/FirstLetter/FirstLetter";
import { getImageUrl } from "../../utils/urlUtils";
import styles from "./NotificationDropdown.module.scss";
import { postApi } from "../../api/PostApi";
import type { PostsContextData } from "../../types/Post";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationsUpdated?: () => void;
}

interface NotificationData extends NotificationWithViewedDto {
  fandomName?: string;
  eventTitle?: string | null;
  eventImage?: string | null;
  postTitle?: string | null;
  postImage?: string | null;
}

const NotificationDropdown: FC<NotificationDropdownProps> = ({ 
  isOpen, 
  onClose,
  onNotificationsUpdated 
}) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<number>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevIsOpenRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      
      setPendingDeleteIds(new Set());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const loadNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fandomNotificationApi.getNotificationsWithViewed(false);
      
      
      const enrichedNotifications = await Promise.all(
        data.map(async (notification) => {
          const enriched: NotificationData = { ...notification };
          
          try {
            
            const fandom = await fandomApi.getFandomById(notification.fandomId);
            enriched.fandomName = fandom.name;
            
            
            if (notification.type === FandomNotificationType.EventCreated) {
              try {
                const event = await eventApi.getEventById(notification.notifierId);
                enriched.eventTitle = event.title;
                enriched.eventImage = event.imageUrl;
              } catch (err) {
                console.error("Failed to load event for notification:", err);
              }
            } 
            else if (notification.type === FandomNotificationType.PostCreated) {
              try {
                const post = await postApi.getPostById(notification.notifierId);
                enriched.postTitle = post.title;
                enriched.postImage = post.mediaContent;
              } catch (err) {
                console.error("Failed to load post for notification:", err);
              }
            }
          } catch (err) {
            console.error("Failed to load fandom for notification:", err);
          }
          console.log(enriched)
          return enriched;
        })
      );
      
      setNotifications(enrichedNotifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHide = (notificationId: number) => {
    
    setPendingDeleteIds((prev) => new Set([...prev, notificationId]));
  };

  const handleHideAll = () => {
    
    setPendingDeleteIds((prev) => {
      const allVisibleIds = notifications
        .filter((n) => !prev.has(n.id))
        .map((n) => n.id);
      return new Set([...prev, ...allVisibleIds]);
    });
  };

  const handleDeletePending = useCallback(async (idsToDelete: number[]) => {
    if (idsToDelete.length === 0) return;

    try {
      await fandomNotificationApi.hideNotifications({
        notificationIds: idsToDelete,
      });
      
      await loadNotifications();
      
      if (onNotificationsUpdated) {
        onNotificationsUpdated();
      }
    } catch (err) {
      console.error("Failed to delete pending notifications:", err);
    }
  }, [onNotificationsUpdated]);

  const markAllAsViewedOnClose = useCallback(async (notificationIds: number[]) => {
    try {
      await fandomNotificationApi.markNotificationsAsViewed({
        notificationIds,
      });
      
      if (onNotificationsUpdated) {
        onNotificationsUpdated();
      }
    } catch (err) {
      console.error("Failed to mark all notifications as viewed on close:", err);
    }
  }, [onNotificationsUpdated]);

  
  
  useEffect(() => {
    
    if (prevIsOpenRef.current && !isOpen) {
      const idsToDelete = Array.from(pendingDeleteIds);
      
      
      if (idsToDelete.length > 0) {
        handleDeletePending(idsToDelete);
        
        setPendingDeleteIds(new Set());
      }
      
      
      if (notifications.length > 0 && idsToDelete.length > 0) {
        const idsToDeleteSet = new Set(idsToDelete);
        const unreadNotifications = notifications.filter(
          (n) => !n.isViewed && !idsToDeleteSet.has(n.id)
        );
        if (unreadNotifications.length > 0) {
          markAllAsViewedOnClose(unreadNotifications.map((n) => n.id));
        }
      } else if (notifications.length > 0) {
        const unreadNotifications = notifications.filter((n) => !n.isViewed);
        if (unreadNotifications.length > 0) {
          markAllAsViewedOnClose(unreadNotifications.map((n) => n.id));
        }
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, notifications, markAllAsViewedOnClose, pendingDeleteIds, handleDeletePending]);

  const getNotificationTitle = (notification: NotificationData) => {
    switch (notification.type) {
      case FandomNotificationType.PostCreated:
        return notification.fandomName
          ? { prefix: "New post in ", fandomName: notification.fandomName }
          : { prefix: "New post created", fandomName: null };
      case FandomNotificationType.EventCreated:
        return notification.fandomName
          ? { prefix: "New event in ", fandomName: notification.fandomName }
          : { prefix: "New event created", fandomName: null };
      default:
        return { prefix: "New notification", fandomName: null };
    }
  };

  const getNotificationImage = (notification: NotificationData) => {
    if (notification.type === FandomNotificationType.EventCreated && notification.eventImage) {
      return getImageUrl(notification.eventImage);
    }
    if (notification.type === FandomNotificationType.PostCreated && notification.postImage) {
      return getImageUrl(notification.postImage);
    }
    return null;
  };

  const getNotificationImageFallback = (notification: NotificationData) => {
    if (notification.type === FandomNotificationType.EventCreated && notification.eventTitle) {
      return notification.eventTitle;
    }
    if (notification.type === FandomNotificationType.PostCreated && notification.postTitle) {
      return notification.postTitle;
    }
    if (notification.fandomName) {
      return notification.fandomName;
    }
    return "N";
  };

  const getNotificationContent = (notification: NotificationData) => {
    if (notification.type === FandomNotificationType.EventCreated) {
      return notification.eventTitle || "";
    }
    if (notification.type === FandomNotificationType.PostCreated) {
      return notification.postTitle || "";
    }
    return "";
  };

  const handleNotificationClick = (notification: NotificationData) => {
    if (notification.type === FandomNotificationType.EventCreated) {
      navigate(`/fandom/${notification.fandomId}/events`);
      onClose();
    } 
    else if (notification.type === FandomNotificationType.PostCreated) {
      
      navigate(`/fandom/${notification.fandomId}/posts`, {
        state: {
          fandomId: notification.fandomId,
          fandomName: notification.fandomName,
          postId: notification.notifierId, 
        } as PostsContextData,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  const visibleNotifications = notifications.filter(
    (notification) => !pendingDeleteIds.has(notification.id)
  );

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles.header}>
        <h3 className={styles.title}>Notifications</h3>
        <div className={styles.headerActions}>
          {!isLoading && visibleNotifications.length > 0 && (
            <button 
              className={styles.hideAllButton} 
              onClick={handleHideAll}
              title="Hide all notifications"
            >
              Hide all
            </button>
          )}
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
      </div>
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.notificationSkeletons}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`skeleton-${index}`} className={styles.notificationSkeletonGroup}>
                  <div className={styles.notificationSkeletonHeader} />
                  <div className={styles.notificationSkeletonItem}>
                    <div className={styles.notificationSkeletonImage} />
                    <div className={styles.notificationSkeletonContent}>
                      <div className={styles.notificationSkeletonText} />
                      <div className={styles.notificationSkeletonText} />
                    </div>
                    <div className={styles.notificationSkeletonStatus} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : visibleNotifications.length === 0 ? (
          <div className={styles.empty}>No notifications</div>
        ) : (
          <div className={styles.notificationsList}>
            {visibleNotifications.map((notification) => {
              const imageUrl = getNotificationImage(notification);
              const imageFallback = getNotificationImageFallback(notification);
              const notificationTitle = getNotificationTitle(notification);
              const notificationContent = getNotificationContent(notification);
              
              
              const isClickable = notification.type === FandomNotificationType.EventCreated || 
                                 notification.type === FandomNotificationType.PostCreated;
              
              return (
                <div key={notification.id} className={styles.notificationGroup}>
                  <div className={styles.notificationHeader}>
                    {notificationTitle.prefix}
                    {notificationTitle.fandomName && (
                      <span className={styles.fandomNameHighlight}>
                        {notificationTitle.fandomName}
                      </span>
                    )}
                  </div>
                  <div
                    className={`${styles.notificationItem} ${
                      !notification.isViewed ? styles.unread : ""
                    } ${notification.isHidden ? styles.hidden : ""} ${
                      isClickable ? styles.clickable : ""
                    }`}
                    onClick={() => isClickable && handleNotificationClick(notification)}
                  >
                    <div className={styles.notificationImageWrapper}>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={notificationContent}
                          className={styles.notificationImage}
                          onError={(e) => {
                            
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="${styles.notificationImagePlaceholder}">
                                  <div class="${styles.firstLetterContainer}">
                                    ${imageFallback.charAt(0).toUpperCase()}
                                  </div>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className={styles.notificationImagePlaceholder}>
                          <FirstLetter text={imageFallback} fontSize="1.2rem" />
                        </div>
                      )}
                    </div>
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationContentText}>
                        {notificationContent}
                      </div>
                    </div>
                    <div className={styles.notificationStatus}>
                      {!notification.isHidden && !notification.isViewed && (
                        <div className={styles.statusUnreadWrapper}>
                          <span className={styles.statusUnreadDot}></span>
                          <button
                            className={styles.statusHideButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHide(notification.id);
                            }}
                            title="Hide notification"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {!notification.isHidden && notification.isViewed && (
                        <div className={styles.statusReadWrapper}>
                          <button
                            className={styles.statusHideButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHide(notification.id);
                            }}
                            title="Hide notification"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {notification.isHidden && (
                        <span className={styles.statusHidden}>Hidden</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;