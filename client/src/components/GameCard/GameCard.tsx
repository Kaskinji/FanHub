// GameCard.tsx
import type { FC } from "react";
import styles from "./GameCard.module.scss";

interface GameCardProps {
    id: number;
    name: string;
    imageUrl?: string;
    className?: string;
}

const GameCard: FC<GameCardProps> = ({
    name,
    imageUrl,
    className
}) => {
    return (
        <div className={`${styles.gameCard} ${className || ''}`}>
            <div className={styles.imageContainer}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className={styles.gameImage}
                    />
                ) : (
                    <div className={styles.gamePlaceholder}>
                        {name.charAt(0)}
                    </div>
                )}
            </div>
            <div className={styles.nameOverlay}>
                <span className={styles.gameName}>{name}</span>
            </div>
        </div>
    );
};

export default GameCard;