import { useEffect, type FC } from "react";
import Logo from "../UI/Logo/Logo";
import Button from "../UI/buttons/Button/Button";
import SearchInput from "../UI/SearchInput/SearchInput";
import { Avatar } from "../UI/Avatar/Avatar";
import styles from "../Header/Header.module.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getImageUrl } from "../../utils/urlUtils";

interface HeaderProps {
  onSearch: (query: string) => void;
  onSignIn?: () => void; // Сделаем необязательным
}

const Header: FC<HeaderProps> = ({ onSearch, onSignIn }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Функция для входа
  const handleSignIn = () => {
    if (onSignIn) {
      // Если передали извне - используем кастомную логику
      onSignIn();
    } else {
      // Иначе используем навигацию по умолчанию
      navigate("/login");
    }
  };

  useEffect(() => {
  }, [user?.avatar]);

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
              <Avatar
                src={user.avatar ? getImageUrl(user.avatar) : undefined}
                alt={user.name}
                size="small"
                onClick={handleProfileClick}
                className={styles.headerAvatar}
              />
              <span className={styles.userName}>{user.name}</span>
            </div>
          </div>
        ) : (
          <Button
            variant="light"
            onClick={handleSignIn}
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