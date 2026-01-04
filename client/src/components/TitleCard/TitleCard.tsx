// TitleCard.tsx
import type { FC } from "react";
import { FirstLetter } from "../UI/FirstLetter/FirstLetter";
import styles from "./TitleCard.module.scss"
import { getImageUrl } from "../../utils/urlUtils";

export interface TitleCardProps {
  title: string;
  image: string;
  className?: string;
  coverStyle?: React.CSSProperties;
}

export const TitleCard: FC<TitleCardProps> = ({ 
  title, 
  image, 
  className,
  coverStyle
}) => {
  const hasImage = image && image.trim() !== "";

  return (
    <div className={`${styles.gameLeft} ${className}`}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.cover} style={coverStyle}>
        {hasImage ? (
          <img 
            className={styles.titleCardImage}
            src={getImageUrl(image)} 
            alt={`${title} image`}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              const placeholder = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = "flex";
            }}
          />
        ) : null}
        <div 
          className={styles.placeholder}
          style={hasImage ? { display: "none" } : undefined}
        >
          <FirstLetter text={title} fontSize="80px" />
        </div>
      </div>
    </div>
  );
};

