import Header from "../../components/Header/Header";
import ShowMoreButton from "../../components/UI/buttons/ShowMoreButton/ShowMoreButton";
import SearchInput from "../../components/UI/SearchInput/SearchInput";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";
import { GamePageProvider } from "../../context/GamePageProvider";
import { useGamePage } from "../../hooks/useGamePage";
import styles from "./GamePage.module.scss";
import { TitleCard } from "../../components/TitleCard/TitleCard";

const gameData = {
  id: 1,
  title: "The Witcher 3: Wild Hunt",
  description:
    "The Witcher is a vast fantasy universe dedicated to the travels of the monster hunter, Geralt of Rivia. On this portal, you can find a variety of different fandoms that publish guides, cosplays, and other creative works.",
  coverImage: "/images/witcher-cover.jpg",
  stats: {
    fandoms: 3,
    posts: 4,
  },
  details: {
    genre: "RPG",
    publisher: "CD Projekt RED",
    developer: "CD Projekt RED",
    releaseDate: "06.11.2025",
  },
  fandoms: [
    {
      id: 1,
      title: "Skellige exploring club",
      description: "We will show all the hidden ships on Skellige",
      image: "NotFound",
    },
    {
      id: 2,
      title: "The Winter Champion",
      description: "We know how to get drunk like a witcher",
      image: "Not found",
    },
  ],
};

export default function GamePage() {
  return (
    <GamePageProvider gameData={gameData}>
      <div className={styles.page}>
        <Header onSearch={() => {}} onSignIn={() => {}} />
        <Content />
      </div>
    </GamePageProvider>
  );
}

/* ================= CONTENT ================= */

function Content() {
  return (
    <main className={styles.content}>
      <GameCard />
      <SectionTitle title="Fandoms" />
      <Fandoms />
      <ShowMoreButton variant="light" />
    </main>
  );
}

/* ================= GAME CARD ================= */

function GameCard() {
  const { game } = useGamePage();
  return (
    <section className={styles.gameCard}>
      <div className={styles.gameLeft}>
        <div className={styles.cardTitle}>
          <TitleCard title={game.title} image={game.coverImage} />
        </div>
        
        <div className={styles.stats}>
          <div className={styles.stat}>
            <strong>
              {game.stats.fandoms >= 1000
                ? `${Math.floor(game.stats.fandoms / 1000)}K`
                : game.stats.fandoms}
            </strong>
            <span>Fandoms</span>
          </div>

          <div className={styles.stat}>
            <strong>
              {game.stats.posts >= 1000
                ? `${Math.floor(game.stats.posts / 1000)}K`
                : game.stats.posts}
            </strong>
            <span>posts</span>
          </div>
        </div>
      </div>
      <GameRight />
    </section>
  );
}

function GameRight() {
  const { game } = useGamePage();

  return (
    <div className={styles.gameRight}>
      <SearchInput withIcon={true} onSearch={() => {}} />
      <div className={styles.infoBox}>
        <h3>About the game:</h3>
        <p>{game.description}</p>
      </div>

      <div className={styles.infoBox}>
        <p>
          <strong>Genre:</strong> {game.details.genre}
        </p>
        <p>
          <strong>Publisher:</strong> {game.details.publisher}
        </p>
        <p>
          <strong>Developer:</strong> {game.details.developer}
        </p>
        <p>
          <strong>Release date:</strong> {game.details.releaseDate}
        </p>
      </div>
    </div>
  );
}

/* ================= FANDOMS ================= */

function Fandoms() {
  const { game } = useGamePage();

  return (
    <section className={styles.fandoms}>
      {game.fandoms.map((fandom) => (
        <FandomCard
          key={fandom.id}
          title={fandom.title}
          text={fandom.description}
          image={fandom.image}
        />
      ))}
    </section>
  );
}

interface FandomCardProps {
  title: string;
  text: string;
  image: string;
}

function FandomCard({ title, text, image }: FandomCardProps) {
  return (
    <div className={styles.fandomCard}>
      <img src={image} alt={title} />
      <div>
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
    </div>
  );
}
