import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import { eventApi } from "../../api/EventApi";
import type { EventReadDto } from "../../api/EventApi";
import { fandomApi } from "../../api/FandomApi";
import { getImageUrl } from "../../utils/urlUtils";
import { getEventStatus, sortEventsByStatus, type EventStatus } from "../../utils/eventUtils";
import { EventForm } from "./EventForm/EventForm";
import { AddButton } from "../../components/UI/buttons/AddButton/AddButton";
import { FirstLetter } from "../../components/UI/FirstLetter/FirstLetter";
import styles from "./FandomEventsPage.module.scss";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";

const FandomEventsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [events, setEvents] = useState<EventReadDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | undefined>(undefined);
  const [isCreator, setIsCreator] = useState(false);

  const fetchEvents = useCallback(async () => {
    if (!id) {
      setError("Fandom ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fandomId = parseInt(id, 10);
      const fetchedEvents = await eventApi.getEvents(fandomId);
      const sortedEvents = sortEventsByStatus(fetchedEvents);
      setEvents(sortedEvents);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkCreator = useCallback(async () => {
    if (!id) return;

    try {
      const fandomId = parseInt(id, 10);
      const creatorStatus = await fandomApi.checkCreator(fandomId);
      setIsCreator(creatorStatus);
    } catch (err) {
      console.error("Failed to check creator status:", err);
      setIsCreator(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvents();
    checkCreator();
  }, [fetchEvents, checkCreator]);

  const handleSearch = (query: string) => {
    // Handle search functionality if needed
    console.log("Search:", query);
  };

  const handleOpenEventForm = (eventId?: number) => {
    setEditingEventId(eventId);
    setShowEventForm(true);
  };

  const handleCloseEventForm = () => {
    setShowEventForm(false);
    setEditingEventId(undefined);
  };

  const handleEventFormSuccess = async () => {
    await fetchEvents();
    handleCloseEventForm();
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header onSearch={handleSearch} />
        <main className={styles.content}>
          <div className={styles.loading}>Loading events...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Header onSearch={handleSearch} />
        <main className={styles.content}>
          <div className={styles.error}>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  const fandomId = id ? parseInt(id, 10) : 0;

  return (
    <div className={styles.page}>
      <Header onSearch={handleSearch} />
      <main className={styles.content}>
        <div className={styles.headerSection}>
          <SectionTitle title="Events"/>
          {isCreator && (
            <AddButton 
              text="Add" 
              onClick={() => handleOpenEventForm()} 
            />
          )}
        </div>
        <div className={styles.eventsList}>
          {events.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No events found for this fandom.</p>
            </div>
          ) : (
            events.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                status={getEventStatus(event)}
                onEdit={isCreator ? () => handleOpenEventForm(event.id) : undefined}
              />
            ))
          )}
        </div>
      </main>
      {showEventForm && (
        <div className={styles.formOverlay}>
          <EventForm
            fandomId={fandomId}
            eventId={editingEventId}
            onCancel={handleCloseEventForm}
            onSuccess={handleEventFormSuccess}
          />
        </div>
      )}
    </div>
  );
};

type EventCardProps = {
  event: EventReadDto;
  status: EventStatus;
  onEdit?: () => void;
};

const EventCard = ({ event, status, onEdit }: EventCardProps) => {
  const imageUrl = event.imageUrl ? getImageUrl(event.imageUrl) : undefined;

  return (
    <div className={styles.eventCard} onClick={onEdit} style={{ cursor: onEdit ? 'pointer' : 'default' }}>
      <div className={styles.eventImageContainer}>
        {imageUrl ? (
          <img src={imageUrl} alt={event.title} className={styles.eventImage} />
        ) : (
          <div className={styles.eventImagePlaceholder}>
            <FirstLetter text={event.title} fontSize="3rem" />
          </div>
        )}
      </div>
      <div className={styles.eventContent}>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        <p className={styles.eventDescription}>{event.description}</p>
        <div className={styles.eventFooter}>
          <span className={`${styles.eventStatus} ${styles[`status${status}`]}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FandomEventsPage;
