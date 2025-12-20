import type { ButtonHTMLAttributes, FC } from "react";
import styles from "./Button.module.scss";
import classNames from "classnames";

type ThemeVariant = "light" | "dark";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isInverted?: boolean;
    variant?: ThemeVariant;
}

const Button: FC<ButtonProps> = ({
    children,
    className,
    isInverted = false,
    variant = "dark",
    ...props
}) => {
    const finalClassName = classNames(
        styles.button,
        {
            [styles["button--light"]]: variant === "light",
            [styles["button--dark"]]: variant === "dark",
            [styles["button--inverted"]]: isInverted,
            [styles["button--disabled"]]: props.disabled,
        },
        className,
    );

    return (
        <button 
            className={finalClassName} 
            data-theme={variant}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;