import type { FC, MouseEvent } from "react";
import { FirstLetter } from "../UI/FirstLetter/FirstLetter";
import styles from "./BaseCard.module.scss";
import { getImageUrl } from "../../utils/urlUtils";

interface BaseCardProps {
    id: number;
    title: string;
    imageUrl?: string;
    className?: string;

    
    onAction?: (event: MouseEvent, id: number) => void;

    
    showOverlay?: boolean;
    overlayContent?: React.ReactNode;
    placeholderChar?: string;
    isClickable?: boolean;

    
    "data-testid"?: string;
}

const BaseCard: FC<BaseCardProps> = ({
    id,
    title,
    imageUrl,
    className = "",
    onAction,
    showOverlay = true,
    overlayContent,
    placeholderChar,
    isClickable: externalIsClickable,
    "data-testid": testId
}) => {
    const handleClick = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        onAction?.(event, id);
    };

    const isClickable = externalIsClickable ?? Boolean(onAction);

    const cardClasses = [
        styles.baseCard,
        isClickable ? styles.clickable : "",
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={cardClasses}
            onClick={isClickable ? handleClick : undefined}
            data-id={id}
            data-testid={testId || `base-card-${id}`}
            role={isClickable ? "button" : "article"}
            tabIndex={isClickable ? 0 : undefined}
            aria-label={title}
        >
            <div className={styles.imageContainer}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className={styles.cardImage}
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className={styles.cardPlaceholder}>
                        {placeholderChar ? (
                            placeholderChar
                        ) : (
                            <FirstLetter text={title} fontSize="3.5rem" />
                        )}
                    </div>
                )}
            </div>

            {showOverlay && (
                <div className={styles.nameOverlay}>
                    {overlayContent || (
                        <span className={styles.cardTitle}>{title}</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default BaseCard;
