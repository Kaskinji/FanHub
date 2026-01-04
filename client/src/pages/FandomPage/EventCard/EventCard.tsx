import { useNavigate } from "react-router-dom";
import { FirstLetter } from "../../../components/UI/FirstLetter/FirstLetter";
import styles from "./EventCard.module.scss";

interface EventCardProps {
  title: string;
  image?: string;
  fandomId?: number;
}

export function EventCard({ title, image, fandomId }: EventCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (fandomId) {
      navigate(`/fandom/${fandomId}/events`);
    }
  };

  return (
    <div className={styles.eventCard} onClick={handleClick}>
      {image ? (
        <img src={image} alt={title} className={styles.eventImage} />
      ) : (
        <div className={styles.eventImagePlaceholder}>
          <FirstLetter text={title} fontSize="3rem" />
        </div>
      )}
      <div className={styles.eventContent}>
        <h4>{title}</h4>
      </div>
    </div>
  );
}

export default EventCard;

