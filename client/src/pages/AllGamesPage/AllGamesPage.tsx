import Header from "../../components/Header/Header";
import SearchInput from "../../components/UI/SearchInput/SearchInput";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";
import styles from "../AllGamesPage/AllGamesPage.module.scss";
import { useAllGames } from "../../hooks/useAllGamesPage";
import type { GamePreview } from "../../types/AllGamesPageData";
import GameCard from "../MainPage/GameCard/GameCard";
import { AllGamesPageProvider } from "../../context/AllGamesPageProvider";

const mockGames: GamePreview[] = [
  { id: 1, name: "Rdr2", imageUrl: "/images/windows.jpg"},
  { id: 2, name: "Hollow knight", imageUrl: "/images/hollow-knight.jpg"},
  { id: 3, name: "Dota 2", imageUrl: "/images/dota.jpg"},
  { id: 4, name: "Witcher", imageUrl: "/images/witcher-wiki.jpg"},
  { id: 5, name: "Skyrim", imageUrl: "/images/minecraft.jpg" },
  { id: 6, name: "GT", imageUrl: "/images/gta.jpg" },
  { id: 7, name: "The Last Of Us", imageUrl: "/images/winter-champion.jpg" },
  { id: 8, name: "DayZ", imageUrl: "/images/witcher-flower.jpg" },
  { id: 9, name: "Rdr2", imageUrl: "/images/windows.jpg"},
  { id: 10, name: "Hollow knight", imageUrl: "/images/hollow-knight.jpg"},
  { id: 11, name: "Dota 2", imageUrl: "/images/dota.jpg"},
  { id: 12, name: "Witcher", imageUrl: "/images/witcher-wiki.jpg"},
  { id: 13, name: "Skyrm", imageUrl: "/images/minecraft.jpg" },
  { id: 14, name: "GTA", imageUrl: "/images/gta.jpg" },
  { id: 15, name: "The Last Of Us", imageUrl: "/images/winter-champion.jpg" },
  { id: 16, name: "DayZ", imageUrl: "/images/witcher-flower.jpg" },
];

export default function AllGamesPage() {
  return (
    <AllGamesPageProvider gamesData={mockGames}>
      <div className={styles.page}>
        <Header onSearch={() => {}} onSignIn={() => {}} />
        <Content />
      </div>
    </AllGamesPageProvider>
  );
}

/* ================= CONTENT ================= */

function Content() {
  const { setSearchQuery } = useAllGames();
  return (
    <main className={styles.content}>
      <Top onSearch={setSearchQuery} />
      <Games />
    </main>
  );
}

/* ================= TOP SECTION ================= */

interface TopProps {
  onSearch: (query: string) => void;
}

function Top({ onSearch }: TopProps) {

  return (
    <div className={styles.top}>
      <div className={styles.topHeader}>
        <div className={styles.searchWrapper}>
          <SearchInput 
            placeholder="Search games..."
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
/* ================= gameS SECTION ================= */

function Games() {
  return (
    <section className={styles.gamesSection}>
      <SectionTitle title="Games" />
      <div className={styles.gamesGrid}>
        {mockGames.map((game: GamePreview) => (
          <GameCard
            key={game.id}
            id={game.id}
            name={game.name}
            imageUrl={game.imageUrl
            }
          />
        ))}
      </div>
    </section>
  );
}