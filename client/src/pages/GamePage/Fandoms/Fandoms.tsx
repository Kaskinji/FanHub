import type { GamePageData } from "../../../types/GamePageData";
import { FandomCard } from "../FandomCard/FandomCard";
import styles from "./Fandoms.module.scss";

type FandomsProps = {
  fandoms: GamePageData["fandoms"];
};

export const Fandoms = ({ fandoms }: FandomsProps) => {
  if (fandoms.length === 0) {
    return (
      <div className={styles.noFandoms}>
        <p>No fandoms yet. Be the first to create one!</p>
      </div>
    );
  }

  const displayedFandoms = fandoms.slice(0, 2);
  const isSingleFandom = displayedFandoms.length === 1;

  return (
    <section className={`${styles.fandoms} ${isSingleFandom ? styles.singleFandom : ''}`}>
      {displayedFandoms.map((fandom) => (
        <FandomCard
          key={fandom.id}
          id={fandom.id}
          title={fandom.name}
          text={fandom.description || ""}
          image={fandom.imageUrl || ""}
        />
      ))}
    </section>
  );
};
