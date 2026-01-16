import type { FC } from "react";
import Header from "../../components/Header/Header";
import { eventApi } from "../../api/EventApi";
import type { EventReadDto } from "../../api/EventApi";
import { getImageUrl } from "../../utils/urlUtils";
import { getEventStatus, type EventStatus } from "../../utils/eventUtils";
import { EventForm } from "./EventForm/EventForm";
import { AddButton } from "../../components/UI/buttons/AddButton/AddButton";
import { FirstLetter } from "../../components/UI/FirstLetter/FirstLetter";
import Button from "../../components/UI/buttons/Button/Button";
import Modal from "../../components/UI/Modal/Modal";
import styles from "./FandomEventsPage.module.scss";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";

type FandomEventsPageViewProps = {
  events: EventReadDto[];
  loading: boolean;
  error: string | null;
  showEventForm: boolean;
  editingEventId: number | undefined;
  isCreator: boolean;
  selectedEvent: EventReadDto | null;
  fandomId: number;
  handleSearch: (query: string) => void;
  handleOpenEventForm: (eventId?: number) => void;
  handleCloseEventForm: () => void;
  handleEventFormSuccess: () => Promise<void>;
  handleEventClick: (event: EventReadDto) => void;
  handleCloseEventModal: () => void;
}

const getStatusIcon = (status: EventStatus) => {
  switch (status) {
    case "Ongoing":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="10" cy="10" r="3" fill="currentColor"/>
        </svg>
      );
    case "Upcoming":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case "Ended":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return status;
  }
};

type EventCardProps = {
  event: EventReadDto;
  status: EventStatus;
  onEdit?: () => void;
  onClick?: () => void;
};

const EventCard = ({ event, status, onEdit, onClick }: EventCardProps) => {
  const imageUrl = event.imageUrl ? getImageUrl(event.imageUrl) : undefined;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  return (
    <div className={styles.eventCard} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
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
        <div className={styles.eventTitleContainer}>
          <h3 className={styles.eventTitle}>{event.title}</h3>
          {onEdit && (
            <Button 
              className={styles.editButton}
              onClick={handleEditClick}
            >
              Edit
            </Button>
          )}
        </div>
        <p className={styles.eventDescription}>{event.description}</p>
        <div className={styles.eventFooter}>
          <span className={`${styles.eventStatus} ${styles[`status${status}`]}`}>
            {getStatusIcon(status)}
            <span className={styles.statusText}>{status}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

type EventModalProps = {
  event: EventReadDto;
  status: EventStatus;
  onClose: () => void;
};

const EventModal = ({ event, status, onClose }: EventModalProps) => {
  const imageUrl = event.imageUrl ? getImageUrl(event.imageUrl) : undefined;

  return (
    <Modal isOpen={true} onClose={onClose} title={event.title} className={styles.eventModal}>
      <div className={styles.eventModalContent}>
        {imageUrl ? (
          <img src={imageUrl} alt={event.title} className={styles.eventModalImage} />
        ) : (
          <div className={styles.eventModalImagePlaceholder}>
            <FirstLetter text={event.title} fontSize="4rem" />
          </div>
        )}
        <div className={styles.eventModalDescription}>
          <p>{event.description}</p>
        </div>
        <div className={styles.eventModalStatus}>
          <span className={`${styles.eventStatus} ${styles[`status${status}`]}`}>
            <span className={styles.statusText}>{status}</span>
            {getStatusIcon(status)}
          </span>
        </div>
      </div>
    </Modal>
  );
};

const renderEventSkeletons = (count: number = 3) => {
  return Array.from({ length: count }).map((_, index) => (
    <div key={`event-skeleton-${index}`} className={styles.eventSkeleton}>
      <div className={styles.eventSkeletonImage} />
      <div className={styles.eventSkeletonContent}>
        <div className={styles.eventSkeletonTitleContainer}>
          <div className={styles.eventSkeletonTitle} />
          <div className={styles.eventSkeletonEditButton} />
        </div>
        <div className={styles.eventSkeletonDescription}>
          <div className={styles.eventSkeletonLine} />
          <div className={styles.eventSkeletonLine} />
          <div className={styles.eventSkeletonLineShort} />
        </div>
        <div className={styles.eventSkeletonFooter}>
          <div className={styles.eventSkeletonStatus} />
        </div>
      </div>
    </div>
  ));
};

export const FandomEventsPageView: FC<FandomEventsPageViewProps> = ({
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
}) => {
  return (
    <div className={styles.page}>
      <Header onSearch={handleSearch} />
      <main className={styles.content}>
        <div className={styles.headerSection}>
          <SectionTitle title="Events"/>
          {isCreator && !loading && (
            <AddButton 
              text="Add" 
              onClick={() => handleOpenEventForm()} 
            />
          )}
        </div>
        {error ? (
          <div className={styles.error}>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        ) : (
          <div className={styles.eventsList}>
            {loading ? (
              renderEventSkeletons(3)
            ) : events.length === 0 ? (
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
                  onClick={() => handleEventClick(event)}
                />
              ))
            )}
          </div>
        )}
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
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          status={getEventStatus(selectedEvent)}
          onClose={handleCloseEventModal}
        />
      )}
    </div>
  );
};

