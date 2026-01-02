import type { FC, MouseEvent } from "react";
import styles from "./BaseCard.module.scss";
import { getImageUrl } from "../../utils/urlUtils";

interface BaseCardProps {
    id: number;
    title: string;
    imageUrl?: string;
    className?: string;

    // ✅ Одна внешняя функция вместо onClick + onNavigate
    onAction?: (event: MouseEvent, id: number) => void;

    // Визуальные настройки
    showOverlay?: boolean;
    overlayContent?: React.ReactNode;
    placeholderChar?: string;
    isClickable?: boolean;

    // Атрибуты
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

    const getPlaceholderContent = () => {
        if (placeholderChar) return placeholderChar;
        return title.charAt(0).toUpperCase();
    };

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
                        src={getImageUrl(imageUrl)}
                        alt={title}
                        className={styles.cardImage}
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className={styles.cardPlaceholder}>
                        {getPlaceholderContent()}
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
