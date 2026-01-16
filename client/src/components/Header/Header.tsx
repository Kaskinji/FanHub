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


import notificationIcon from "../../assets/notification.svg";
import notificationAlertIcon from "../../assets/notification-alert.svg";

interface HeaderProps {
  onSearch: (query: string) => void;
  allGames?: GameReadDto[]; 
}

const Header: FC<HeaderProps> = ({ onSearch, allGames }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { hasNewNotification, checkUnreadNotifications } = useNotificationHub(
    isAuthenticated,
    user?.id ? Number(user.id) : undefined
  );

  
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

  
  const handleSignIn = () => {
    navigate("/login");
  };

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleNotificationsUpdated = () => {
    
    checkUnreadNotifications();
  };

  const handleCloseNotifications = () => {
    setIsNotificationOpen(false);
  };

  useEffect(() => {}, [user?.avatar]);

  
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearchDropdownOpen(false);
      return;
    }

    setIsSearchDropdownOpen(true);
    
    
    if (allGames && allGames.length > 0) {
      const lowerQuery = query.toLowerCase().trim();
      const results = allGames.filter(game => 
        game.title.toLowerCase().includes(lowerQuery)
      );
      setSearchResults(results);
      setIsSearching(false);
      return;
    }
    
    
    setIsSearching(true);
    try {
      const results = await gameApi.searchGamesByName(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching games:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [allGames]);

  
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);

      
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      
      
      const debounceDelay = allGames && allGames.length > 0 ? 0 : 150;
      
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, debounceDelay);
    },
    [performSearch, allGames]
  );

  
  const handleSearchSubmit = useCallback(
    (query: string) => {
      onSearch(query);
      setIsSearchDropdownOpen(false);
      setSearchQuery("");
    },
    [onSearch]
  );

  
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

  
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

   const rightSectionContent = isLoading ? (
    <div className={styles.userSectionSkeleton}>
      <div className={styles.skeletonUserInfo}>
        <div className={styles.skeletonUserName} />
        <div className={styles.skeletonAvatar} />
      </div>
      <div className={styles.skeletonNotificationButton} />
    </div>
  ) : isAuthenticated && user ? (
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
            searchQuery={searchQuery}
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
