// TitleCard.tsx
import type { FC } from "react";
import styles from "./TitleCard.module.scss";

export interface TitleCardProps {
  title: string;
  image: string;
}

export const TitleCard: FC<TitleCardProps> = ({ title, image }) => {
  return (
    <div className={styles.titleCard}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.imageContainer}>
        <img 
          src={image} 
          alt={`${title} cover`} 
          className={styles.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/default-game.jpg';
          }}
        />
      </div>
    </div>
  );
};