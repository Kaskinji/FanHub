// components/Header/MainHeader.tsx
import type { FC } from "react";
import Logo from "../UI/Logo/Logo";
import Button from "../UI/Button/Button";
import SearchInput from "../UI/SearchInput/SearchInput";
import styles from "../Header/Header.module.scss";

interface MainHeaderProps {
    onSearch: (query: string) => void;
    onSignIn: () => void;
}

const MainHeader: FC<MainHeaderProps> = ({ onSearch, onSignIn }) => {
    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <Logo size="small" showText={true} />
            </div>

            <div className={styles.centerSection}>
                <SearchInput
                    placeholder="Search Fandoms..."
                    onSearch={onSearch}
                    variant="head"
                    size="large"
                    withIcon={true}
                    className={styles.heroSearch}
                />
            </div>

            <div className={styles.rightSection}>
                <Button
                    isInverted
                    onClick={onSignIn}
                    className={styles.signInButton}
                >
                    Sign in
                </Button>
            </div>
        </header>
    );
};

export default MainHeader;