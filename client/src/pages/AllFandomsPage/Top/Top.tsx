import { useState, useEffect } from "react";
import SearchInput from "../../../components/UI/SearchInput/SearchInput";
import styles from "./Top.module.scss";
import subscriberIcon from "../../../assets/subscriberIcon.svg";
import postIcon from "../../../assets/postIcon.svg";

type TopProps = {
  onSearch: (query: string) => void;
  gameTitle: string;
  gameId?: number;
  searchQuery: string;
  sortBy: 'name' | 'subscribers' | 'posts' | null;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortType: 'name' | 'subscribers' | 'posts') => void;
  hasStats: boolean;
}

export const Top = ({ onSearch, gameTitle, searchQuery, sortBy, sortOrder, onSortChange, hasStats }: TopProps)  => {
  const [searchValue, setSearchValue] = useState(searchQuery);

  
  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  const handleChange = (query: string) => {
    setSearchValue(query);
    onSearch(query); 
  };

  const handleSubmit = (query: string) => {
    onSearch(query);
  };

  const getSortIcon = (type: 'name' | 'subscribers' | 'posts') => {
    if (sortBy !== type) {
      
      return <span className={styles.sortIcon}>⇅</span>;
    }
    
    return sortOrder === 'asc' ? (
      <span className={styles.sortIcon}>↑</span>
    ) : (
      <span className={styles.sortIcon}>↓</span>
    );
  };

  return (
    <div className={styles.top}>
      <div className={styles.topHeader}>
        <div className={styles.gameInfo}>
          <span className={styles.gameLabel}>Game:</span>
          <span className={styles.gameName}>{gameTitle || "All Games"}</span>
        </div>
        <div className={styles.controls}>
          {hasStats && (
            <div className={styles.sortButtons}>
              <button
                className={`${styles.sortButton} ${sortBy === 'subscribers' ? styles.sortButtonActive : ''}`}
                onClick={() => onSortChange('subscribers')}
                title="Sort by subscribers"
                aria-label="Sort by subscribers"
              >
                <img src={subscriberIcon} alt="Subscribers" className={styles.sortButtonIcon} />
                {getSortIcon('subscribers')}
              </button>
              <button
                className={`${styles.sortButton} ${sortBy === 'posts' ? styles.sortButtonActive : ''}`}
                onClick={() => onSortChange('posts')}
                title="Sort by posts"
                aria-label="Sort by posts"
              >
                <img src={postIcon} alt="Posts" className={styles.sortButtonIcon} />
                {getSortIcon('posts')}
              </button>
              <button
                className={`${styles.sortButton} ${sortBy === 'name' ? styles.sortButtonActive : ''}`}
                onClick={() => onSortChange('name')}
                title="Sort by name"
                aria-label="Sort by name"
              >
                <span className={styles.sortButtonLabel}>A-Z</span>
                {getSortIcon('name')}
              </button>
            </div>
          )}
          <div className={styles.searchWrapper}>
            <SearchInput
              placeholder="Search fandoms..."
              withIcon={true}
              onSearch={handleSubmit}
              onChange={handleChange}
              value={searchValue}
              variant="head"
              size="medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
}