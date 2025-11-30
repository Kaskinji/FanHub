import type { FC } from "react";
import styles from "./Footer.module.scss";

const Footer: FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <span className={styles.copyright}>
                         2024 FanHub. Aboba.
                    </span>
                    <div className={styles.links}>
                        <a href="/about" className={styles.link}>About us</a>
                        <a href="/terms" className={styles.link}>Conditions</a>
                        <a href="/privacy" className={styles.link}>Ñonfidentiality</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;