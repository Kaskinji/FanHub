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
  return (
    <div className={`${styles.gameLeft} ${className}`}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.cover} style={coverStyle}>
        <img 
          className={styles.titleCardImage}
          src={getImageUrl(image)} 
          alt={`${title} image`} 
        />
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