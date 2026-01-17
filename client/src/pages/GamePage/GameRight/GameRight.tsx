import type { GamePageData } from "../../../types/GamePageData";
import styles from "./GameRight.module.scss";

type GameRightProps = {
  game: GamePageData;
};

export const GameRight = ({ game }: GameRightProps) => {
  return (
    <div className={styles.gameRight}>
      <div className={styles.infoBox}>
        <h3 className={styles.infoTitle}>About the game:</h3>
        <p>{game.description}</p>
      </div>

      <div className={styles.infoBox}>
        <div className={styles.detailBox}>
          <p className={styles.infoTitle}>
            Genre:
          </p>
          <p className={styles.detailText}>
            {game.details.genre}
          </p>
        </div>
        <div className={styles.detailBox}>
          <p className={styles.infoTitle}>
            Publisher:
          </p>
          <p className={styles.detailText}>
            {game.details.publisher}
          </p>
        </div>
        <div className={styles.detailBox}>
          <p className={styles.infoTitle}>
            Developer:
          </p>
          <p className={styles.detailText}>
            {game.details.developer}
          </p>
        </div>
        <div className={styles.detailBox}>
          <p className={styles.infoTitle}>
            Release date:
          </p>
          <p className={styles.detailText}>
            {game.details.releaseDate}
          </p>
        </div>
      </div>
    </div>
  );
};

