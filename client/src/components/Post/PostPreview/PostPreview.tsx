
import { useState, type FC } from "react";
import styles from "./PostPreview.module.scss";
import type { Post } from "../../../types/Post";
import { FirstLetter } from "../../UI/FirstLetter/FirstLetter";
import likeIcon from "../../../assets/like.svg";
import dislikeIcon from "../../../assets/dislike.svg";
import commentIcon from "../../../assets/comment.svg"

interface PostPreviewProps {
  post: Post;
  onClick: (postId: number) => void;
  onReaction?: (postId: number, reactionType: "like" | "dislike") => void;
  className?: string;
}

const PostPreview: FC<PostPreviewProps> = ({ post, onClick, onReaction, className }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  const handleReactionClick = (e: React.MouseEvent, reactionType: "like" | "dislike" ) => {
    e.stopPropagation();
    if (onReaction) {
      onReaction(post.id, reactionType);
    }
  };

  const likeReaction = post.reactions.find(r => r.type === 'like') || { type: 'like' as const, count: 0, userReacted: false };
  const dislikeReaction = post.reactions.find(r => r.type === 'dislike') || { type: 'dislike' as const, count: 0, userReacted: false };

  const hasImage = post.image && !imageError;

  return (
    <div 
      className={`${styles.postPreview} ${className || ''}`}
      onClick={() => onClick(post.id)}
    >
      <div className={styles.imageContainer}>
        {hasImage ? (
          <img 
            src={post.image!} 
            alt={post.title} 
            className={styles.image}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <FirstLetter text={post.title} fontSize={"5em"}/>
          </div>
        )}
        <span className={styles.category}>{post.category}</span>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{post.title}</h3>
        
        <div className={styles.excerptContainer}>
          {post.excerpt && (
            <p className={styles.excerpt}>{post.excerpt}</p>
          )}
        </div>
        
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
            <div className={styles.reactions} onClick={(e) => e.stopPropagation()}>
              <button
                className={`${styles.reactionButton} ${likeReaction.userReacted ? styles.active : ''}`}
                onClick={onReaction ? (e) => handleReactionClick(e, 'like') : undefined}
                disabled={!onReaction}
                title="Like"
              >
                <img 
                  src={likeIcon} 
                  alt="like"
                  className={styles.reactionIcon}
                />
                {likeReaction.count}
              </button>
              <button
                className={`${styles.reactionButton} ${dislikeReaction.userReacted ? styles.active : ''}`}
                onClick={onReaction ? (e) => handleReactionClick(e, 'dislike') : undefined}
                disabled={!onReaction}
                title="Dislike"
              >
                <img 
                  src={dislikeIcon} 
                  alt="dislike"
                  className={styles.reactionIcon}
                />
                {dislikeReaction.count}
              </button>
            </div>
            <div className={styles.comments}>
                <img 
                  src={commentIcon} 
                  alt="dislike"
                  className={styles.reactionIcon}
                /> {post.commentCount || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;