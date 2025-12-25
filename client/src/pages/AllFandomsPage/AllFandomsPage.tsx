import Header from "../../components/Header/Header";
import SearchInput from "../../components/UI/SearchInput/SearchInput";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";
import styles from "../AllFandomsPage/AllFandomsPage.module.scss";
import { useAllFandoms } from "../../hooks/useAllFandomsPage";
import type { FandomPreview } from "../../types/AllFandomsPageData";
import FandomCard from "../MainPage/FandomCard/FandomCard";
import { AllFandomsPageProvider } from "../../context/AllFandomsPageProvider";

const mockFandoms: FandomPreview[] = [
  { id: 1, name: "Rdr Community", imageUrl: "/images/windows.jpg"},
  { id: 2, name: "Hollow knight guys", imageUrl: "/images/hollow-knight.jpg"},
  { id: 3, name: "Dota 2 wiki", imageUrl: "/images/dota.jpg"},
  { id: 4, name: "Witcher wiki", imageUrl: "/images/witcher-wiki.jpg"},
  { id: 5, name: "Skyrim community", imageUrl: "/images/minecraft.jpg" },
  { id: 6, name: "GTA lovers", imageUrl: "/images/gta.jpg" },
  { id: 7, name: "The Winter Champion", imageUrl: "/images/winter-champion.jpg" },
  { id: 8, name: "Witcher lower", imageUrl: "/images/witcher-flower.jpg" },
  { id: 1, name: "Rdr Community", imageUrl: "/images/windows.jpg"},
  { id: 2, name: "Hollow knight guys", imageUrl: "/images/hollow-knight.jpg"},
  { id: 3, name: "Dota 2 wiki", imageUrl: "/images/dota.jpg"},
  { id: 4, name: "Witcher wiki", imageUrl: "/images/witcher-wiki.jpg"},
  { id: 5, name: "Skyrim community", imageUrl: "/images/minecraft.jpg" },
  { id: 6, name: "GTA lovers", imageUrl: "/images/gta.jpg" },
  { id: 7, name: "The Winter Champion", imageUrl: "/images/winter-champion.jpg" },
  { id: 8, name: "Witcher lower", imageUrl: "/images/witcher-flower.jpg" },
  { id: 1, name: "Rdr Community", imageUrl: "/images/windows.jpg"},
  { id: 2, name: "Hollow knight guys", imageUrl: "/images/hollow-knight.jpg"},
  { id: 3, name: "Dota 2 wiki", imageUrl: "/images/dota.jpg"},
  { id: 4, name: "Witcher wiki", imageUrl: "/images/witcher-wiki.jpg"},
  { id: 5, name: "Skyrim community", imageUrl: "/images/minecraft.jpg" },
  { id: 6, name: "GTA lovers", imageUrl: "/images/gta.jpg" },
  { id: 7, name: "The Winter Champion", imageUrl: "/images/winter-champion.jpg" },
  { id: 8, name: "Witcher lower", imageUrl: "/images/witcher-flower.jpg" },
];

export default function AllFandomsPage() {
  return (
    <AllFandomsPageProvider fandomsData={mockFandoms}>
      <div className={styles.page}>
        <Header onSearch={() => {}} onSignIn={() => {}} />
        <Content />
      </div>
    </AllFandomsPageProvider>
  );
}

/* ================= CONTENT ================= */

function Content() {
  const { setSearchQuery } = useAllFandoms();
  return (
    <main className={styles.content}>
      <Top onSearch={setSearchQuery} />
      <Fandoms />
    </main>
  );
}

/* ================= TOP SECTION ================= */

interface TopProps {
  onSearch: (query: string) => void;
}

function Top({ onSearch }: TopProps) {
  const selectedGame = "The Witcher 3: Wild Hunt"; // В будущем брать из контекста/API

  return (
    <div className={styles.top}>
      <div className={styles.topHeader}>
        <div className={styles.gameInfo}>
        <span className={styles.gameLabel}>Game:</span>
        <span className={styles.gameName}>{selectedGame}</span>
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
/* ================= FANDOMS SECTION ================= */

function Fandoms() {
  return (
    <section className={styles.fandomsSection}>
      <SectionTitle title="Fandoms" />
      <div className={styles.fandomsGrid}>
        {mockFandoms.map((fandom: FandomPreview) => (
          <FandomCard
            key={fandom.id}
            id={fandom.id}
            name={fandom.name}
            imageUrl={fandom.imageUrl
            }
          />
        ))}
      </div>
    </section>
  );
}