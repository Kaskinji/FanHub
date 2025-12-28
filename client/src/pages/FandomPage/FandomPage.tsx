import Header from "../../components/Header/Header";
import ShowMoreButton from "../../components/UI/buttons/ShowMoreButton/ShowMoreButton";
import SearchInput from "../../components/UI/SearchInput/SearchInput";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";

import styles from "./FandoPage.module.scss";
import { TitleCard } from "../../components/TitleCard/TitleCard";
import type { FandomPageData, Reaction } from "../../types/FandomPageData";
import { useNavigate } from "react-router-dom";
import type { FandomContextData } from "../../types/Fandom";

const fandomData: FandomPageData = {
  id: 1,
  title: "Skellige exploring club",
  description: "We explore all the mysteries of Skellige! We discover hidden ships, uncover the secrets of ancient clans, and share the best routes for exploring the islands.",
  coverImage: "/images/skellige-cover.jpg",
  rules: "1.  The Golden Rule: Ship and Let Ship ''Shipping'' is personal. You may love a pairing that others don't, and that's okay.\n2. Do: Respect everyone's right to enjoy their favorite ships, characters, and tropes.\n3. Do Not: Harass, insult, or start ''shipping wars'' with fans who have\n4==",
  
  postsPreviews: [
    {
      id: 1,
      title: "Guide for 100% completion",
      image: "/images/geralt.jpg",
      author: {
        id: 101,
        username: "GeraltOfRivia",
        avatar: "/images/geralt-avatar.jpg"
      },
        reactions: [
          { type: 'like', count: 42 },
          { type: 'fire', count: 15 }
        ]
    },
    {
      id: 2,
      title: "The best decks for gwent",
      image: "/images/geralt2.jpg",
      author: {
        id: 102,
        username: "Plotva",
        avatar: "/images/plotva-avatar.jpg"
      },
        reactions: [
          { type: 'like', count: 89 },
          { type: 'fire', count: 32 }
        ]
    },
    {
      id: 3,
      title: "Top 10 alcohol in Novigrad",
      image: "/images/geralt3.jpg",
      author: {
        id: 103,
        username: "Zoltan",
        avatar: "/images/zoltan-avatar.jpg"
      },
        reactions: [
          { type: 'like', count: 156 },
          { type: 'fire', count: 45 }
        ]
    }
  ],
  
  eventsPreviews: [
    {
      id: 1,
      title: "Fanart contest",
      image: "/images/tousant.jpg"
    },
    {
      id: 2,
      title: "Quiz the Witcher Bestiary",
      image: "/images/ivasik.jpg"
    }
  ]
};

export default function FandomPage() {
  return (
    <div className={styles.page}>
      <Header onSearch={() => {}} onSignIn={() => {}} />
      <Content fandom={fandomData}/>
    </div>
  );
}

/* ================= CONTENT ================= */

interface ContentProps {
  fandom: typeof fandomData;
}

function Content({ fandom }: ContentProps) {
  const navigate = useNavigate();
  const handleShowMore = () => {
    navigate(`/posts`, {
       state: { 
         fandomId: fandom.id,
         fandomName: fandom.title 
       } as FandomContextData
     });
  };
  return (
    <main className={styles.content}>
      <FandomCard fandom={fandom} />  
      <SectionTitle title="Events" />
      <Events events={fandom.eventsPreviews}/>
      <ShowMoreButton variant="light" />
      <SectionTitle title="Popular Posts" />
      <Posts posts={ fandom.postsPreviews } />
      <ShowMoreButton 
        variant="light" 
        onClick={handleShowMore} // Добавляем обработчик
      />  

    </main>
  );
}

/* ================= FANDOM CARD ================= */
interface FandomCardProps {
  fandom: typeof fandomData;
}
// Обновленная функция FandomCard в FandoPage.tsx
function FandomCard({ fandom }: FandomCardProps) {
  return (
    <section className={styles.fandomCard}>
      <div className={styles.fandomLeft}>
        <div className={styles.cardTitle}>
          <TitleCard title={fandom.title} image={fandom.coverImage} />
        </div>
        <button className={styles.subscribeButton}>
          Subscribe
        </button>
      </div>
      <FandomRight fandom ={ fandom }/>
    </section>
  );
}

interface FandomRightProps {
  fandom: typeof fandomData;
}
// Обновленная функция FandomRight
function FandomRight({ fandom }: FandomRightProps) {

  return (
    <div className={styles.fandomRight}>
      <SearchInput 
        placeholder="Search in fandom..." 
        withIcon={true} 
        onSearch={() => {}} 
      />
      
      <div className={styles.infoBox}>
        <h3>Description:</h3>
        <p>{fandom.description}</p>
      </div>
      
      <div className={styles.divider} />

      <div className={styles.infoBox}>
        <h3>Rules:</h3>
        <pre className={styles.rules}>{fandom.rules}</pre>
      </div>
    </div>
  );
}

/* ================= POSTS ================= */
interface PostProps {
  posts: FandomPageData['postsPreviews'];
}
function Posts({ posts }: PostProps) {

  return (
    <section className={styles.posts}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          title={post.title}
          image={post.image}
          author={post.author}
          reactions={post.reactions}
        />
      ))}
    </section>
  );
}

interface PostCardProps {
  title: string;
  image: string;
  author: {
    id: number;
    username: string;
    avatar?: string;
  };
  reactions?: Reaction[];
}

function PostCard({ title, image, author, reactions }: PostCardProps) {
  return (
    <div className={styles.postCard}>
      <img src={image} alt={title} className={styles.postImage} />
      <div className={styles.postContent}>
        <h4>{title}</h4>
        <div className={styles.postMeta}>
          <div className={styles.reactions}>
            {reactions?.map((reaction, index) => (
              <span key={index} className={styles.reaction}>
                {reaction.type === 'like' ? '👍' : '🔥'} {reaction.count}
              </span>
            ))}
          </div>
          <div className={styles.author}>
            {author.avatar && (
              <img src={author.avatar} alt={author.username} className={styles.avatar} />
            )}
            <span>{author.username}</span>
          </div>
          
        </div>
      </div>
    </div>
  );
}

/* ================= EVENTS ================= */
interface EventsProps {
  events: FandomPageData['eventsPreviews'];
}
function Events( { events }: EventsProps) {

  return (
    <section className={styles.events}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          title={event.title}
          image={event.image}
        />
      ))}
    </section>
  );
}

interface EventCardProps {
  title: string;
  image?: string;
}

function EventCard({ title, image }: EventCardProps) {
  return (
    <div className={styles.eventCard}>
      {image && (
        <img src={image} alt={title} className={styles.eventImage} />
      )}
      <div className={styles.eventContent}>
        <h4>{title}</h4>
      </div>
    </div>
  );
}