import type { ButtonHTMLAttributes, FC } from "react";
import styles from "./ShowMoreButton.module.scss";
import classNames from "classnames";

interface ShowMoreButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "light" | "dark";
    withArrow?: boolean;
    text?: string;
}

const ShowMoreButton: FC<ShowMoreButtonProps> = ({
    children,
    className,
    variant = "dark",
    withArrow = true,
    text,
    ...props
}) => {
    const finalClassName = classNames(
        styles.showMoreButton,
        {
            [styles["showMoreButton--light"]]: variant === "light",
            [styles["showMoreButton--dark"]]: variant === "dark",
            [styles["showMoreButton--with-arrow"]]: withArrow,
            [styles["showMoreButton--disabled"]]: props.disabled,
        },
        className,
    );

    
    const displayText = text || children || "Show More";

    return (
        <button 
            className={finalClassName} 
            data-theme={variant}
            {...props}
        >
            <span className={styles.showMoreButton__text}>{displayText}</span>
            {withArrow && (
                <span className={styles.showMoreButton__arrow}>&gt;&gt;</span>
            )}
        </button>
    );
};

export default ShowMoreButton;