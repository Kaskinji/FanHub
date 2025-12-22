import type { FC } from "react";
import Logo from "../UI/Logo/Logo";
import Button from "../UI/buttons/Button/Button";
import SearchInput from "../UI/SearchInput/SearchInput";
import styles from "../Header/Header.module.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
    onSearch: (query: string) => void;
    onSignIn: () => void;
}

const Header: FC<HeaderProps> = ({ onSearch, onSignIn }) => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout, isLoading } = useAuth();

    const handleLogoClick = () => {
        navigate(isAuthenticated ? "/main" : "/");
    };

    const handleProfileClick = () => {
        navigate("/profile");
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Показываем лоадер пока проверяется аутентификация
    if (isLoading) {
        return (
            <header className={styles.header}>
                <div className={styles.leftSection} onClick={handleLogoClick}>
                    <Logo size="small" showText={true} />
                </div>
                <div className={styles.centerSection}>
                    <div className={styles.loadingPlaceholder}>Loading...</div>
                </div>
                <div className={styles.rightSection}>
                    <div className={styles.authLoading}>Checking auth...</div>
                </div>
            </header>
        );
    }

    return (
        <header className={styles.header}>
            <div className={styles.leftSection} onClick={handleLogoClick}>
                <Logo size="small" showText={true} />
            </div>

            <div className={styles.centerSection}>
                <SearchInput
                    placeholder="Search games..."
                    onSearch={onSearch}
                    variant="head"
                    size="small"
                    theme="dark"
                    withIcon={true}
                    className={styles.heroSearch}
                />
            </div>

            <div className={styles.rightSection}>
                {isAuthenticated && user ? (
                    <div className={styles.userSection}>
                        <div 
                            className={styles.userInfo}
                            onClick={handleProfileClick}
                            title="Go to profile"
                        >
                            {user.avatar ? (
                                <img 
                                    src={user.avatar} 
                                    alt={user.name} 
                                    className={styles.avatar}
                                />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className={styles.userName}>{user.name}</span>
                        </div>
                        <Button
                            variant="light"
                            onClick={handleLogout}
                            className={styles.logoutButton}
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="light"
                        onClick={onSignIn}
                        className={styles.signInButton}
                    >
                        Sign in
                    </Button>
                )}
            </div>
        </header>
    );
};

export default Header;