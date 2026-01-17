import type { FC } from "react";
import type { GameReadDto } from "../../../api/GameApi";
import { getImageUrl } from "../../../utils/urlUtils";
import styles from "./SearchDropdown.module.scss";
import classNames from "classnames";

export interface SearchDropdownProps {
  isOpen: boolean;
  isSearching: boolean;
  searchResults: GameReadDto[];
  onGameClick: (game: GameReadDto) => void;
  theme?: "light" | "dark";
  searchQuery?: string;
}

const SearchDropdown: FC<SearchDropdownProps> = ({
  isOpen,
  isSearching,
  searchResults,
  onGameClick,
  theme = "dark",
  searchQuery = "",
}) => {
  if (!isOpen) return null;

  const sortSearchResults = (results: GameReadDto[], query: string): GameReadDto[] => {
    if (!query.trim()) return results;
    
    const lowerQuery = query.toLowerCase();
    
    const resultsWithQuery = results.filter(game => 
      game.title.toLowerCase().includes(lowerQuery)
    );
    
    return resultsWithQuery.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      
      if (titleA === lowerQuery && titleB !== lowerQuery) return -1;
      if (titleA !== lowerQuery && titleB === lowerQuery) return 1;
      if (titleA === lowerQuery && titleB === lowerQuery) return 0;
      
      const startsWithA = titleA.startsWith(lowerQuery);
      const startsWithB = titleB.startsWith(lowerQuery);
      
      if (startsWithA && !startsWithB) return -1;
      if (!startsWithA && startsWithB) return 1;
      if (startsWithA && startsWithB) {
        return titleA.length - titleB.length;
      }
      
      const positionA = titleA.indexOf(lowerQuery);
      const positionB = titleB.indexOf(lowerQuery);
      
      if (positionA !== positionB) {
        return positionA - positionB;
      }
      
      return titleA.length - titleB.length;
    });
  };

  const sortedResults = sortSearchResults(searchResults, searchQuery);

  const dropdownClassName = classNames(styles.searchDropdown, {
    [styles.searchDropdownLight]: theme === "light",
    [styles.searchDropdownDark]: theme === "dark",
  });

  return (
    <div className={dropdownClassName}>
      {isSearching ? (
        <div className={styles.searchLoading}>Searching...</div>
      ) : sortedResults.length > 0 ? (
        <div className={styles.searchResults}>
          {sortedResults.map((game) => (
            <div
              key={game.id}
              className={styles.searchResultItem}
              onClick={() => onGameClick(game)}
            >
              {game.coverImage ? (
                <img
                  src={getImageUrl(game.coverImage)}
                  alt={game.title}
                  className={styles.searchResultImage}
                />
              ) : (
                <div className={styles.searchResultPlaceholder}>
                  {game.title.charAt(0).toUpperCase()}
                </div>
              )}
              <div className={styles.searchResultInfo}>
                <div className={styles.searchResultTitle}>{game.title}</div>
                {game.genre && (
                  <div className={styles.searchResultGenre}>{game.genre}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.searchNoResults}>No games found</div>
      )}
    </div>
  );
};

export default SearchDropdown;