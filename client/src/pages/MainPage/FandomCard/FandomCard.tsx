import type { FC, MouseEvent } from "react";
import BaseCard from "../../../components/BaseCard/BaseCard";
import { useNavigate } from "react-router-dom";
import styles from "./FandomCard.module.scss";

interface FandomCardProps {
    id: number;
    name: string;
    imageUrl?: string;
    className?: string;
    onClick?: (id: number, name: string) => void;
}

const FandomCard: FC<FandomCardProps> = ({
    id,
    name,
    imageUrl,
    className,
    onClick,
}) => {
    const navigate = useNavigate();

    const cardClasses = [
        styles.fandomCard,
        className || ""
    ]
        .filter(Boolean)
        .join(" ");

    const handleAction = (event: MouseEvent, id: number) => {
        // Если передан внешний onClick — вызываем его
        if (onClick) {
            onClick(id, name);
            return;
        }

        // Иначе — стандартная навигация
        navigate(`/fandom/${id}`);
    };

    return (
        <BaseCard
            id={id}
            title={name}
            imageUrl={imageUrl}
            className={cardClasses}
            onAction={handleAction}
            data-testid={`fandom-card-${id}`}
        />
    );
};

export default FandomCard;
