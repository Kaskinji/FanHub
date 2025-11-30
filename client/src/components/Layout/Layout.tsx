import type { FC, ReactNode } from "react";
import styles from "../Layout/Layout.module.scss";

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.layout}>
                <main className={styles.main}>
                    {children}
                </main>
        </div>
    );
};

export default Layout;