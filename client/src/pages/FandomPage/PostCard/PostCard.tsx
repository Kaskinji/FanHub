import { useNavigate } from "react-router-dom";
import { FirstLetter } from "../../../components/UI/FirstLetter/FirstLetter";
import styles from "./PostCard.module.scss";

interface PostCardProps {
  id: number;
  title: string;
  image: string | null;
  author: {
    id: number;
    username: string;
    avatar?: string;
  };
  reactions?: Array<{ type: "like" | "dislike"; count: number }>;
  fandomId?: number;
  fandomName?: string;
}

export function PostCard({ id, title, image, author, reactions, fandomId, fandomName }: PostCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Редирект на страницу постов с передачей данных о фандоме
    if (fandomId && fandomName) {
      navigate(`/posts`, {
        state: {
          fandomId: fandomId,
          fandomName: fandomName,
          postId: id, // Передаем ID поста для открытия
        },
      });
    }
  };

  return (
    <div className={styles.postCard} onClick={handleClick}>
      {image && <img src={image} alt={title} className={styles.postImage} />}
      <div className={styles.postContent}>
        <h4>{title}</h4>
        <div className={styles.postMeta}>
          <div className={styles.reactions}>
            {reactions?.map((reaction, index) => (
              <span key={index} className={styles.reaction}>
                {reaction.type === "like" ? "👍" : "👎"} {reaction.count}
              </span>
            ))}
          </div>
          <div className={styles.author}>
            <div className={styles.avatarContainer}>
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.username}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <FirstLetter text={author.username} fontSize="0.75rem" />
                </div>
              )}
            </div>
            <span>{author.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;

