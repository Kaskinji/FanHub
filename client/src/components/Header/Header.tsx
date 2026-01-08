import { useEffect, useState, useRef, useCallback, type FC } from "react";
import Logo from "../UI/Logo/Logo";
import Button from "../UI/buttons/Button/Button";
import SearchInput from "../UI/SearchInput/SearchInput";
import { Avatar } from "../UI/Avatar/Avatar";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";
import styles from "../Header/Header.module.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNotificationHub } from "../../hooks/useNotificationHub";
import { getImageUrl } from "../../utils/urlUtils";
import { gameApi } from "../../api/GameApi";
import type { GameReadDto } from "../../api/GameApi";
import SearchDropdown from "../UI/SearchDropdown/SearchDropdown";

// Импорт SVG файлов
import notificationIcon from "../../assets/notification.svg";
import notificationAlertIcon from "../../assets/notification-alert.svg";

interface HeaderProps {
  onSearch: (query: string) => void;
  onSignIn?: () => void; // Сделаем необязательным
}

const Header: FC<HeaderProps> = ({ onSearch, onSignIn }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { hasNewNotification, checkUnreadNotifications } = useNotificationHub(
    isAuthenticated,
    user?.id ? Number(user.id) : undefined
  );

  // Состояния для поиска игр
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GameReadDto[]>([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleNotificationsUpdated = () => {
    // Проверяем, остались ли непрочитанные уведомления после обновления
    checkUnreadNotifications();
  };

  const handleCloseNotifications = () => {
    setIsNotificationOpen(false);
  };

  useEffect(() => {}, [user?.avatar]);

  // Поиск игр с debounce
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearchDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    setIsSearchDropdownOpen(true);
    try {
      const results = await gameApi.searchGamesByName(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching games:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Обработчик изменения поискового запроса
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);

      // Очищаем предыдущий таймаут
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Устанавливаем новый таймаут для debounce (300ms)
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 300);
    },
    [performSearch]
  );

  // Обработчик отправки формы поиска
  const handleSearchSubmit = useCallback(
    (query: string) => {
      onSearch(query);
      setIsSearchDropdownOpen(false);
      setSearchQuery("");
    },
    [onSearch]
  );

  // Обработчик клика на результат поиска
  const handleGameClick = useCallback(
    (game: GameReadDto) => {
      navigate(`/game/${game.id}`, {
        state: { game },
      });
      setIsSearchDropdownOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    },
    [navigate]
  );

  // Закрытие выпадающего списка при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Очистка таймаута при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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

  // Резервируем место для userSection, чтобы высота не менялась
  const rightSectionContent = isAuthenticated && user ? (
    <div className={styles.userSection}>
      <div
        className={styles.userInfo}
        onClick={handleProfileClick}
        title="Go to profile"
      >
        <span className={styles.userName}>{user.name}</span>
        <Avatar
          src={user.avatar ? getImageUrl(user.avatar) : undefined}
          alt={user.name}
          size="small"
          onClick={handleProfileClick}
          className={styles.headerAvatar}
        />
      </div>
      <div className={styles.notificationButtonWrapper}>
        <button
          className={styles.notificationButton}
          onClick={handleNotificationClick}
          title="Notifications"
          aria-label="Notifications"
        >
          {hasNewNotification ? (
            <img
              src={notificationAlertIcon}
              alt="Unread notifications"
              className={styles.notificationAlertIcon}
            />
          ) : (
            <img
              src={notificationIcon}
              alt="Notifications"
              className={styles.notificationNormalIcon}
            />
          )}
        </button>
        <NotificationDropdown
          isOpen={isNotificationOpen}
          onClose={handleCloseNotifications}
          onNotificationsUpdated={handleNotificationsUpdated}
        />
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
  );

  return (
    <header className={styles.header}>
      <div className={styles.leftSection} onClick={handleLogoClick}>
        <Logo size="small" showText={true} />
      </div>

      <div className={styles.centerSection}>
        <div className={styles.searchContainer} ref={searchContainerRef}>
          <SearchInput
            placeholder="Search games..."
            onSearch={handleSearchSubmit}
            variant="head"
            size="small"
            theme="dark"
            withIcon={true}
            className={styles.heroSearch}
            value={searchQuery}
            onChange={handleSearchChange}
            isDropdownOpen={isSearchDropdownOpen}
          />
          <SearchDropdown
            isOpen={isSearchDropdownOpen}
            isSearching={isSearching}
            searchResults={searchResults}
            onGameClick={handleGameClick}
            theme="dark"
          />
        </div>
      </div>

      <div className={styles.rightSection}>
        {rightSectionContent}
      </div>
    </header>
  );
};

export default Header;
