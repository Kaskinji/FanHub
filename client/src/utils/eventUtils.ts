import type { EventReadDto } from "../api/EventApi";

export type EventStatus = "Ongoing" | "Upcoming" | "Ended";

export const getEventStatus = (event: EventReadDto): EventStatus => {
  const now = new Date();
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  if (now < startDate) {
    return "Upcoming";
  } else if (now >= startDate && now <= endDate) {
    return "Ongoing";
  } else {
    return "Ended";
  }
};

export const getStatusPriority = (status: EventStatus): number => {
  switch (status) {
    case "Ongoing":
      return 1;
    case "Upcoming":
      return 2;
    case "Ended":
      return 3;
    default:
      return 4;
  }
};

export const sortEventsByStatus = (events: EventReadDto[]): EventReadDto[] => {
  const eventsWithStatus = events.map((event) => ({
    event,
    status: getEventStatus(event),
  }));

  eventsWithStatus.sort((a, b) => {
    const priorityA = getStatusPriority(a.status);
    const priorityB = getStatusPriority(b.status);
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    return new Date(a.event.startDate).getTime() - new Date(b.event.startDate).getTime();
  });

  return eventsWithStatus.map(({ event }) => event);
};

