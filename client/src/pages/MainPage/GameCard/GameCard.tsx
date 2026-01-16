import type { FC, MouseEvent } from "react";
import BaseCard from "../../../components/BaseCard/BaseCard";
import { useNavigate } from "react-router-dom";
import styles from "./GameCard.module.scss";
import type { GamePreview } from "../../../types/AllGamesPageData";
import type { GameReadDto } from "../../../api/GameApi";

type GameCardProps = {
  gamePreview: GamePreview; 
  gameFull?: GameReadDto;  
  className?: string;
}

const GameCard: FC<GameCardProps> = ({
    gamePreview,
    gameFull,
    className,
}) => {

        const navigate = useNavigate();
    if (!gamePreview) {
        console.warn('GameCard: gamePreview is undefined');
        return null; 
    }
    
    const cardClasses = [
        styles.gameCard,
        className || ""
    ]
        .filter(Boolean)
        .join(" ");

     const handleAction = (event: MouseEvent, id: number) => {
    if (gameFull) {
      navigate(`/game/${id}`, {
        state: { game: gameFull }
      });
    } else {
      navigate(`/game/${id}`);
    }
  };

    return (
      <div className={styles.gameCardWrapper}>
        <BaseCard
        id={gamePreview.id}
        title={gamePreview.name}
        imageUrl={gamePreview.imageUrl}
        className={cardClasses}
        onAction={handleAction}
        data-testid={`game-card-${gamePreview.id}`}
      />
        </div>
    );
};

export default GameCard;
