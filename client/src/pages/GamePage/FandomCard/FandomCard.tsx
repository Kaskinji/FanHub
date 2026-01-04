import { useState } from "react";
import styles from "./FandomCard.module.scss";
import { FirstLetter } from "../../../components/UI/FirstLetter/FirstLetter";

type FandomCardProps = {
  title: string;
  text: string;
  image?: string | null;
};

export const FandomCard = ({ title, text, image }: FandomCardProps) => {
  const [imageError, setImageError] = useState(false);
  console.log(image);
  const hasImage = image && image !== "";

  return (
    <div className={styles.fandomCard}>
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

