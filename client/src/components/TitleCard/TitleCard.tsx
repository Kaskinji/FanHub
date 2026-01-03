// TitleCard.tsx
import type { FC } from "react";
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
  const firstLetter = title.charAt(0).toUpperCase();
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
          {firstLetter}
        </div>
      </div>
    </div>
  );
};

// Использование
<TitleCard 
  title="Game Title" 
  image="/cover.jpg" 
  coverStyle={{ 
    border: '3px solid red', 
    borderRadius: '12px',
    boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)'
  }}
/>