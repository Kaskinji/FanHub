import type { ButtonHTMLAttributes, FC } from "react";
import styles from "./ShowMoreButton.module.scss";
import classNames from "classnames";

interface ShowMoreButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "light" | "dark";
    withArrow?: boolean;
}

const ShowMoreButton: FC<ShowMoreButtonProps> = ({
    children = "Show More",
    className,
    variant = "dark",
    withArrow = true,
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

    return (
        <button 
            className={finalClassName} 
            data-theme={variant}
            {...props}
        >
            <span className={styles.showMoreButton__text}>{children}</span>
            {withArrow && (
                <span className={styles.showMoreButton__arrow}>&gt;&gt;</span>
            )}
        </button>
    );
};

export default ShowMoreButton;