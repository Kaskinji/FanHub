// components/Post/PostFull.tsx
import {  type FC } from "react";
import styles from "./PostFull.module.scss";
import type { Post, Comment as CommentType } from "../../../types/Post";
import PostComments from "../PostComments/PostComments";

interface PostFullProps {
  post: Post;
  comments: CommentType[];
  onClose: () => void;
  onAddComment: (content: string) => Promise<void>;
  isAddingComment?: boolean;
}

const PostFull: FC<PostFullProps> = ({
  post,
  comments,
  onClose,
  onAddComment,
  isAddingComment = false
}) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleReaction = (type: string) => {
    // Отправка реакции на бэкенд
    console.log(`Reacted with ${type}`);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        
        {/* Заголовок и мета-информация */}
        <header className={styles.header}>
          <div className={styles.authorInfo}>
            <div className={styles.avatar}>
              {post.author.avatar ? (
                <img src={post.author.avatar} alt={post.author.username} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {post.author.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className={styles.username}>{post.author.username}</div>
              <div className={styles.date}>{formatDate(post.createdAt)}</div>
            </div>
          </div>
          
          <div className={styles.category}>{post.category}</div>
        </header>
        
        {/* Изображение поста */}
        {post.image && (
          <div className={styles.postImage}>
            <img src={post.image} alt={post.title} />
          </div>
        )}
        
        {/* Контент поста */}
        <article className={styles.content}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.text}>
            {post.content}
          </div>
          
        </article>
        
        {/* Реакции */}
        <div className={styles.reactions}>
          {post.reactions.map((reaction) => (
            <button
              key={reaction.type}
              className={`${styles.reactionButton} ${
                reaction.userReacted ? styles.active : ''
              }`}
              onClick={() => handleReaction(reaction.type)}
            >
              {getReactionEmoji(reaction.type)} {reaction.count}
            </button>
          ))}
        </div>
        
        {/* Комментарии */}
        <PostComments
          comments={comments}
          postId={post.id}
          onAddComment={onAddComment}
          isAddingComment={isAddingComment}
        />
      </div>
    </div>
  );
};

const getReactionEmoji = (type: string) => {
  const emojis: Record<string, string> = {
    like: '👍',
    fire: '🔥'
  };
  return emojis[type] || '👍';
};

export default PostFull;