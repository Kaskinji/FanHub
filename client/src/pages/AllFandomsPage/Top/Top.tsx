import SearchInput from "../../../components/UI/SearchInput/SearchInput";
import styles from "./Top.module.scss";

interface TopProps {
  onSearch: (query: string) => void;
  gameTitle: string;
  gameId?: number;
  searchQuery: string;
}

export const Top = ({ onSearch, gameTitle }: TopProps)  => {
  return (
    <div className={styles.top}>
      <div className={styles.topHeader}>
        <div className={styles.gameInfo}>
          <span className={styles.gameLabel}>Game:</span>
          <span className={styles.gameName}>{gameTitle || "All Games"}</span>
        </div>
        <div className={styles.searchWrapper}>
          <SearchInput
            placeholder="Search fandoms..."
            withIcon={true}
            onSearch={onSearch}
            variant="head"
            size="medium"
          />
        </div>
      </div>
    </div>
  );
}