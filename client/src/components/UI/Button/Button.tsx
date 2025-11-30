import type { ButtonHTMLAttributes, FC } from "react";
import styles from "./Button.module.scss";
import classNames from "classnames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isInverted?: boolean;
}

const Button: FC<ButtonProps> = ({
    children,
    className,
    isInverted = false,
    ...props
}) => {
    const finalClassName = classNames(
        styles.button,
        {
            [styles["button--inverted"]]: isInverted,
            [styles["button--disabled"]]: props.disabled,
        },
        className,
    );

    return (
        <button className={finalClassName} {...props}>
            {children}
        </button>
    );
};

export default Button;