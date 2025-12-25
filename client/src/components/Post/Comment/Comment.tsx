// components/Post/Comment.tsx
import type { FC } from "react";
import styles from "./Comment.module.scss";
import type { Comment as CommentType } from "../../../types/Post";

interface CommentProps {
  comment: CommentType;
  onReply?: (commentId: number) => void;
  className?: string;
}

const Comment: FC<CommentProps> = ({ comment, onReply, className }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className={`${styles.comment} ${className || ''}`}>
      {/* Аватар автора */}
      <div className={styles.authorSection}>
        <div className={styles.avatar}>
          {comment.author.avatar ? (
            <img 
              src={comment.author.avatar} 
              alt={comment.author.username}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {comment.author.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Содержимое комментария */}
      <div className={styles.contentSection}>
        <div className={styles.commentHeader}>
          <span className={styles.username}>{comment.author.username}</span>
          <span className={styles.date}>{formatDate(comment.createdAt)}</span>
        </div>
        
        <div className={styles.commentText}>
          {comment.content}
        </div>

        {/* Действия */}
        <div className={styles.commentActions}>
          {comment.reactions && comment.reactions.length > 0 && (
            <div className={styles.reactions}>
              {comment.reactions.map((reaction, index) => (
                <span key={index} className={styles.reaction}>
                  {getReactionEmoji(reaction.type)} {reaction.count}
                </span>
              ))}
            </div>
          )}
          
          {onReply && (
            <button 
              className={styles.replyButton}
              onClick={() => onReply(comment.id)}
            >
              Ответить
            </button>
          )}
        </div>

        {/* Вложенные комментарии */}
        {comment.replies && comment.replies.length > 0 && (
          <div className={styles.replies}>
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                onReply={onReply}
                className={styles.nestedComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const getReactionEmoji = (type: string) => {
  const emojis: Record<string, string> = {
    like: '👍',
    fire: '🔥',
  };
  return emojis[type] || '👍';
};

export default Comment;