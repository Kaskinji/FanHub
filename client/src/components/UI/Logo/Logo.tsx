import type { FC } from "react";
import styles from "./Logo.module.scss";
import logoImage from "../../../assets/Logo.png"
interface LogoProps {
    size?: "small" | "medium" | "large";
    showText?: boolean;
    className?: string;
}

const Logo: FC<LogoProps> = ({
    size = "medium",
    showText = true,
    className
}) => {
    return (
        <div className={`${styles.logo} ${styles[`logo--${size}`]} ${className || ''}`}>
            <div className={styles.logoIcon}>
                <img
                    src={logoImage}
                    alt="FanHub Logo"
                    className={styles.logoImage}
                />
            </div>
            {showText && (
                <h1 className={styles.logoText}>
                    FanHub
                </h1>
            )}
        </div>
    );
};

export default Logo;