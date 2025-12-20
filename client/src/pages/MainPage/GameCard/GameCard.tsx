import type { FC, MouseEvent } from "react";
import BaseCard from "../../../components/BaseCard/BaseCard";
import { useNavigate } from "react-router-dom";
import styles from "./GameCard.module.scss";

interface GameCardProps {
    id: number;
    name: string;
    imageUrl?: string;
    className?: string;
    onClick?: (id: number, name: string) => void;
}

const GameCard: FC<GameCardProps> = ({
    id,
    name,
    imageUrl,
    className,
    onClick,
}) => {
    const navigate = useNavigate();

    const cardClasses = [
        styles.gameCard,
        className || ""
    ]
        .filter(Boolean)
        .join(" ");

    const handleAction = (event: MouseEvent, id: number) => {
        if (onClick) {
            onClick(id, name);
            return;
        }

        // Иначе стандартная навигация
        navigate(`/game/${id}`);
    };

    return (
      <div className={styles.gameCardWrapper}>
        <BaseCard
            id={id}
            title={name}
            imageUrl={imageUrl}
            className={cardClasses}
            onAction={handleAction}
            data-testid={`game-card-${id}`}
        />
        </div>
    );
};

export default GameCard;
