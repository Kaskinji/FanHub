import type { InputHTMLAttributes, FC } from "react";
import styles from "./Input.module.scss";
import classNames from "classnames";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    isError?: boolean;
}

const Input: FC<InputProps> = ({
    className,
    isError = false,
    ...props
}) => {
    const finalClassName = classNames(
        styles.input,
        {
            [styles["input--error"]]: isError,
        },
        className
    );

    return <input {...props} className={finalClassName} />;
};

export default Input;