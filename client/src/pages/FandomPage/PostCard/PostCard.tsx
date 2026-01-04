import styles from "./PostCard.module.scss";

interface PostCardProps {
  title: string;
  image: string;
  author: {
    id: number;
    username: string;
    avatar?: string;
  };
  reactions?: Array<{ type: "like" | "fire"; count: number }>;
}

export function PostCard({ title, image, author, reactions }: PostCardProps) {
  return (
    <div className={styles.postCard}>
      <img src={image} alt={title} className={styles.postImage} />
      <div className={styles.postContent}>
        <h4>{title}</h4>
        <div className={styles.postMeta}>
          <div className={styles.reactions}>
            {reactions?.map((reaction, index) => (
              <span key={index} className={styles.reaction}>
                {reaction.type === "like" ? "👍" : "🔥"} {reaction.count}
              </span>
            ))}
          </div>
          <div className={styles.author}>
            {author.avatar && (
              <img
                src={author.avatar}
                alt={author.username}
                className={styles.avatar}
              />
            )}
            <span>{author.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;

