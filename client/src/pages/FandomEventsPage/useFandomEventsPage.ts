import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { eventApi } from "../../api/EventApi";
import type { EventReadDto } from "../../api/EventApi";
import { fandomApi } from "../../api/FandomApi";
import { getEventStatus, sortEventsByStatus, type EventStatus } from "../../utils/eventUtils";

export const useFandomEventsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [events, setEvents] = useState<EventReadDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | undefined>(undefined);
  const [isCreator, setIsCreator] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventReadDto | null>(null);

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

  const handleEventClick = (event: EventReadDto) => {
    setSelectedEvent(event);
  };

  const handleCloseEventModal = () => {
    setSelectedEvent(null);
  };

  const fandomId = id ? parseInt(id, 10) : 0;

  return {
    events,
    loading,
    error,
    showEventForm,
    editingEventId,
    isCreator,
    selectedEvent,
    fandomId,
    handleSearch,
    handleOpenEventForm,
    handleCloseEventForm,
    handleEventFormSuccess,
    handleEventClick,
    handleCloseEventModal,
  };
};

