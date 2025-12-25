import type { FC } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Logo from "../../components/UI/Logo/Logo";
import styles from "./MainPage.module.scss";
import SearchInput from "../../components/UI/SearchInput/SearchInput";
import type { Fandom } from "../../types/Fandom";
import type { Game } from "../../types/Game";
import GameCard from "../MainPage/GameCard/GameCard";
import FandomCard from "./FandomCard/FandomCard";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";
import ShowMoreButton from "../../components/UI/buttons/ShowMoreButton/ShowMoreButton";

type MainPageProps = {
  onSearch: () => void;
};

const MainPage: FC<MainPageProps> = ({ onSearch = () => {} }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const MOCK_FANDOMS: Fandom[] = [
    { id: 1, name: "Minecrafters", description: "" },
    { id: 2, name: "HN fans", description: "" },
    { id: 3, name: "Dota 2 Fans", description: "" },
    { id: 4, name: "The Witcher", description: "" },
    { id: 5, name: "TF enjoyers", description: "" },
    { id: 6, name: "GTA lovers", description: "" },
  ];
  const MOCK_GAMES: Game[] = [
    { id: 1, name: "RDR", imageUrl: "" },
    { id: 2, name: "The Witcher", imageUrl: "" },
    { id: 3, name: "Skyrim", imageUrl: "" },
    { id: 4, name: "DAYZ", imageUrl: "" },
    { id: 5, name: "Baldur's Gate", imageUrl: "" },
    { id: 6, name: "Cyberpunk 2077", imageUrl: "" },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const filteredFandoms = MOCK_FANDOMS.filter((fandom) =>
    fandom.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGames = MOCK_GAMES.filter((fandom) =>
    fandom.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShowMore = () => {
    // Переход на страницу всех фандомов с передачей ID игры
    navigate(`/allgames?game`);
  };

  return (
    <div className={styles.mainPage}>
      <Header onSearch={handleSearch} onSignIn={handleSignIn} />
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.logoWrapper}>
            <Logo size="large" showText={true} className={styles.heroLogo} />
          </div>
          
          <p className={styles.heroSubtitle}>Find your community</p>
          <div className={styles.centerSection}>
            <SearchInput
              placeholder="Search games"
              variant="secondary"
              size="large"
              withIcon={true}
              className={styles.heroSearch}
              onSearch={onSearch}
            />
          </div>
        </section>
        <section className={styles.gameSection}>
          <SectionTitle title="Games" />
          <div className={styles.titleWrapper}></div>
          <div className={styles.gamesGrid}>
            {filteredGames.map((game) => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
          <ShowMoreButton 
            variant="light" 
            onClick={handleShowMore} // Добавляем обработчик
          />
        </section>
        <section className={styles.fandomsSection}>
          <SectionTitle title="Top Fandoms" />
          <div className={styles.fandomsGrid}>
            {filteredFandoms.map((fandom) => (
              <FandomCard key={fandom.id} {...fandom} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
