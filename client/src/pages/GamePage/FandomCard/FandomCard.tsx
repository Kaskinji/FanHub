import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FandomCard.module.scss";
import { FirstLetter } from "../../../components/UI/FirstLetter/FirstLetter";

type FandomCardProps = {
  id: number;
  title: string;
  text: string;
  image?: string | null;
};

export const FandomCard = ({ id, title, text, image }: FandomCardProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  console.log(image);
  const hasImage = image && image !== "";

  const handleClick = () => {
    navigate(`/fandom/${id}`);
  };

  return (
    <div className={styles.fandomCard} onClick={handleClick}>
      {hasImage && !imageError ? (
        <img 
          src={image} 
          alt={title} 
          className={styles.fandomImage}
          onError={() => {
            setImageError(true);
          }}
        />
      ) : (
        <div className={styles.fandomImagePlaceholder}>
          <FirstLetter text={title} fontSize="2.5rem" />
        </div>
      )}
      <div className={styles.fandomInfo}>
        <h4 className={styles.fandomTitle}>{title}</h4>
        <p className={styles.fandomDescription}>{text}</p>
      </div>
    </div>
  );
};

