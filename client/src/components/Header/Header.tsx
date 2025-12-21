import type { FC } from "react";
import Logo from "../UI/Logo/Logo";
import Button from "../UI/buttons/Button/Button";
import SearchInput from "../UI/SearchInput/SearchInput";
import styles from "../Header/Header.module.scss";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    onSearch: (query: string) => void;
    onSignIn: () => void;
}

const Header: FC<HeaderProps> = ({ onSearch, onSignIn }) => {
    const navigate = useNavigate();
    return (
        <header className={styles.header}>
            <div className={styles.leftSection} onClick={() => navigate("/main")}>
                <Logo size="small" showText={true} />
            </div>

            <div className={styles.centerSection}>
                <SearchInput
                    placeholder="Search games..."
                    onSearch={onSearch}
                    variant="head"
                    size= "small"
                    theme="dark"
                    withIcon={true}
                    className={styles.heroSearch}
                />
            </div>

            <div className={styles.rightSection}>
                <Button
                    variant="light"
                    onClick={onSignIn}
                    className={styles.signInButton}
                >
                    Sign in
                </Button>
            </div>
        </header>
    );
};

export default Header;