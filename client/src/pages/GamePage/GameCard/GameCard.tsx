import { TitleCard } from "../../../components/TitleCard/TitleCard";
import type { GamePageData } from "../../../types/GamePageData";
import { GameRight } from "../GameRight/GameRight";
import fandomIcon from "../../../assets/group.svg";
import styles from "./GameCard.module.scss";

type GameCardProps = {
  game: GamePageData;
  isAdmin: boolean;
  onEditGame: () => void;
};

export const GameCard = ({ game, isAdmin, onEditGame }: GameCardProps) => {
  return (
    <section className={styles.gameCard}>
      <div className={styles.gameLeft}>
        <div className={styles.cardTitle}>
              <TitleCard className={styles.gameTitleCard} title={game.title} image={game.coverImage || ""} />
            <div className={styles.statsWrapper}>
              {isAdmin && (
                <button 
                  className={styles.manageButton} 
                  onClick={onEditGame}
                >
                  Manage Game
                </button>
              )}
              
              <div className={styles.gameStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{game.stats.fandoms}</span>
                  <span className={styles.statName}>Fandoms</span>
                  <img 
                    className={styles.statIcon}
                    src={fandomIcon}
                    alt="Fandoms" 
                    />
                    
                </div>
              </div>
            </div>
          </div>
      </div>
      <GameRight game={game} />
    </section>
  );
};

