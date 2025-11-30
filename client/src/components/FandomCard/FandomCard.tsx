// FandomCard.tsx
import type { FC } from "react";
import styles from "./FandomCard.module.scss";

interface FandomCardProps {
    id: number;
    name: string;
    imageUrl?: string;
    className?: string;
}

const FandomCard: FC<FandomCardProps> = ({
    name,
    imageUrl,
    className
}) => {
    return (
        <div className={`${styles.fandomCard} ${className || ''}`}>
            <div className={styles.imageContainer}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className={styles.fandomImage}
                    />
                ) : (
                    <div className={styles.fandomPlaceholder}>
                        {name.charAt(0)}
                    </div>
                )}
            </div>
            <div className={styles.nameOverlay}>
                <span className={styles.fandomName}>{name}</span>
            </div>
        </div>
    );
};

export default FandomCard;