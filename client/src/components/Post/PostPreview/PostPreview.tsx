// components/Post/PostPreview.tsx
import type { FC } from "react";
import styles from "./PostPreview.module.scss";
import type { Post } from "../../../types/Post";

interface PostPreviewProps {
  post: Post;
  onClick: (postId: number) => void;
  className?: string;
}

const PostPreview: FC<PostPreviewProps> = ({ post, onClick, className }) => {
  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const totalReactions = post.reactions.reduce((sum, r) => sum + r.count, 0);

  return (
    <div 
      className={`${styles.postPreview} ${className || ''}`}
      onClick={() => onClick(post.id)}
    >
      {post.image && (
        <div className={styles.imageContainer}>
          <img src={post.image} alt={post.title} className={styles.image} />
        </div>
      )}
      
      <div className={styles.content}>
        <h3 className={styles.title}>{post.title}</h3>
        
        {post.excerpt && (
          <p className={styles.excerpt}>{post.excerpt}</p>
        )}
        
        <div className={styles.meta}>
          <div className={styles.author}>
            <div className={styles.avatar}>
              {post.author.avatar ? (
                <img src={post.author.avatar} alt={post.author.username} />
              ) : (
                <span className={styles.avatarPlaceholder}>
                  {getInitials(post.author.username)}
                </span>
              )}
            </div>
            <span className={styles.username}>{post.author.username}</span>
          </div>
          
          <div className={styles.stats}>
            <span className={styles.reactions}>
              {totalReactions > 0 && `🔥 ${totalReactions}`}
            </span>
            <span className={styles.comments}>
              💬 {post.commentCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;