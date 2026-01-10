import ShowMoreButton from "../../../components/UI/buttons/ShowMoreButton/ShowMoreButton";
import SectionTitle from "../../../components/UI/SectionTitle/SectionTitle";
import type { GamePageData } from "../../../types/GamePageData";
import { GameCard } from "../GameCard/GameCard";
import { Fandoms } from "../Fandoms/Fandoms";
import styles from "./Content.module.scss";

type ContentProps = {
  game: GamePageData;
  onShowMore: () => void;
  isAdmin: boolean;
  onEditGame: () => void;
};

export const Content = ({
  game,
  onShowMore,
  isAdmin,
  onEditGame,
}: ContentProps) => {
  return (
    <main className={styles.content}>
      <GameCard game={game} isAdmin={isAdmin} onEditGame={onEditGame} />
      <SectionTitle title="Fandoms" />
      <Fandoms fandoms={game.fandoms} />
      {game.fandoms.length > 0 ? (
        <ShowMoreButton variant="light" onClick={onShowMore} />
      ) : (
        <ShowMoreButton
          text="Go to fandoms"
          variant="light"
          onClick={onShowMore}
        />
      )}
    </main>
  );
};
