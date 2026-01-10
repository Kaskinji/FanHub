import { useEffect, useState } from "react";
import { eventApi } from "../../../api/EventApi";
import { getImageUrl } from "../../../utils/urlUtils";
import { sortEventsByStatus } from "../../../utils/eventUtils";
import { EventCard } from "../EventCard/EventCard";
import styles from "./Events.module.scss";

interface EventsProps {
  fandomId: number;
}

export function Events({ fandomId }: EventsProps) {
  const [events, setEvents] = useState<Array<{ id: number; title: string; image?: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await eventApi.getEvents(fandomId);
        const sortedEvents = sortEventsByStatus(fetchedEvents);
        const topEvents = sortedEvents.slice(0, 2);
        
        const eventsPreviews = topEvents.map((event) => ({
          id: event.id,
          title: event.title,
          ...(event.imageUrl && { image: getImageUrl(event.imageUrl) }),
        }));
        
        setEvents(eventsPreviews);
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [fandomId]);

  if (loading) {
    return (
      <section className={styles.events}>
        <div>Loading events...</div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <p>No events found.</p>
    );
  }

  return (
    <section className={styles.events}>
      {events.map((event) => (
        <EventCard key={event.id} title={event.title} image={event.image} fandomId={fandomId} />
      ))}
    </section>
  );
}

export default Events;

