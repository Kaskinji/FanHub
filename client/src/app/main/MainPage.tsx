// app/main/MainPage.tsx
import type { FC, } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainHeader from "../../components/Header/Header";
import Logo from "../../components/UI/Logo/Logo";
import styles from "./MainPage.module.scss";
import SearchInput from "../../components/UI/SearchInput/SearchInput";
import type { Fandom } from "../../types/main"
import type { Game } from "../../types/main"
import GameCard from "../../components/GameCard/GameCard"
import FandomCard from "../../components/FandomCard/FandomCard"

const MainPage: FC = ({ onSearch }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const MOCK_FANDOMS: Fandom[] = [
        { id: 1, name: "Minecrafters", memberCount: 125000 },
        { id: 2, name: "HN fans", memberCount: 89000 },
        { id: 3, name: "Dota 2 Fans", memberCount: 456000},
        { id: 4, name: "The Witcher", memberCount: 234000 },
        { id: 5, name: "TF enjoyers", memberCount: 167000 },
        { id: 6, name: "GTA lovers", memberCount: 345000 },
    ];
    const MOCK_GAMES: Game[] = [
        { id: 1, name: "RDR",},
        { id: 2, name: "The Witcher" },
        { id: 3, name: "Skyrim" },
        { id: 4, name: "DAYZ" },
        { id: 5, name: "Baldurs Gate"},
        { id: 6, name: "Cyberpunk 2077" },
        { id: 7, name: "Elden Ring" },
        { id: 8, name: "Grand Theft Auto 5" },
    ];

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        //  логика поиска
        console.log("Searching for:", query);
    };

    const handleSignIn = () => {
        navigate("/login");
    };

    const filteredFandoms = MOCK_FANDOMS.filter(fandom =>
        fandom.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredGames = MOCK_GAMES.filter(fandom =>
        fandom.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.mainPage}>
            <MainHeader
                onSearch={handleSearch}
                onSignIn={handleSignIn}
            />

            <main className={styles.mainContent}>
                <section className={styles.heroSection}>
                    <Logo size="large" showText={true} className={styles.heroLogo} />
                    <p className={styles.heroSubtitle}>Find your community</p>
                    <div className={styles.centerSection}>
                        <SearchInput
                            placeholder="Search Fandoms..."
                            onSearch={onSearch}
                            variant="secondary"
                            size="large"
                            withIcon={true}
                            className={styles.heroSearch}
                        />
                    </div>
                </section>
                <section className={styles.gameSection}>
                    <h2 className={styles.sectionTitle}>Top Games</h2>
                    <div className={styles.gamesGrid}>
                        {filteredGames.map((game) => (
                            <GameCard
                                key={game.id}
                                {...game}
                            />
                        ))}
                    </div>
                </section>
                <section className={styles.fandomsSection}>
                    <h2 className={styles.sectionTitle}>Top Fandoms</h2>
                    <div className={styles.fandomsGrid}>
                        {filteredFandoms.map((fandom) => (
                            <FandomCard
                                key={fandom.id}
                                {...fandom}
                            />
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
};

export default MainPage;