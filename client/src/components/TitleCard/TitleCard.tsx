import type { FC } from "react";
import styles from "./TitleCard.module.scss"

export interface TitleCardProps {
  title: string;
  image: string;
}

export const TitleCard: FC<TitleCardProps> = ({ title, image }) => {
  return (
    <div className={styles.gameLeft}>
      <h1>{title}</h1>

      <div className={styles.cover}>
        <img src={image} alt={`${title} image`} />
      </div>
    </div>
  );
};