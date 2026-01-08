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
}

const SearchDropdown: FC<SearchDropdownProps> = ({
  isOpen,
  isSearching,
  searchResults,
  onGameClick,
  theme = "dark",
}) => {
  if (!isOpen) return null;

  const dropdownClassName = classNames(styles.searchDropdown, {
    [styles.searchDropdownLight]: theme === "light",
    [styles.searchDropdownDark]: theme === "dark",
  });

  return (
    <div className={dropdownClassName}>
      {isSearching ? (
        <div className={styles.searchLoading}>Searching...</div>
      ) : searchResults.length > 0 ? (
        <div className={styles.searchResults}>
          {searchResults.map((game) => (
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

