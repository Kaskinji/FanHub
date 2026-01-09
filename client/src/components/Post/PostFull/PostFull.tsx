// components/Post/PostFull.tsx
import {  type FC } from "react";
import { FirstLetter } from "../../UI/FirstLetter/FirstLetter";
import styles from "./PostFull.module.scss";
import type { Post, Comment as CommentType } from "../../../types/Post";
import PostComments from "../PostComments/PostComments";
import closeSign from "../../../assets/closeSign.svg"

interface PostFullProps {
  post: Post;
  comments: CommentType[];
  onClose: () => void;
  onAddComment?: (content: string) => Promise<void>;
  onReaction?: (postId: number, reactionType: "like" | "dislike") => void;
  isAddingComment?: boolean;
  isLoadingComments?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PostFull: FC<PostFullProps> = ({
  post,
  comments,
  onClose,
  onAddComment,
  onReaction,
  isAddingComment = false,
  isLoadingComments = false,
  onEdit,
  onDelete,
}) => {
  const currentUserId = Number(localStorage.getItem('user_id'));
  const isAuthor = currentUserId && post.author.id === currentUserId;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleReaction = (type: "like" | "dislike") => {
    if (onReaction && post.id && post.id > 0) {
      onReaction(post.id, type);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img className={styles.closeImg} src={closeSign}/>
        </button>
        
        <header className={styles.header}>
          <div className={styles.authorInfo}>
            <div className={styles.avatar}>
              {post.author.avatar ? (
                <img src={post.author.avatar} alt={post.author.username} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <FirstLetter text={post.author.username} fontSize="1.2rem" />
                </div>
              )}
            </div>
            <div>
              <div className={styles.username}>{post.author.username}</div>
              <div className={styles.date}>{formatDate(post.createdAt)}</div>
            </div>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.category}>{post.category}</div>
            {isAuthor && (onEdit || onDelete) && (
              <div className={styles.postActions}>
                {onEdit && (
                  <button
                    className={styles.editButton}
                    onClick={onEdit}
                    title="Edit post"
                  >
                    ✏️
                  </button>
                )}
                {onDelete && (
                  <button
                    className={styles.deleteButton}
                    onClick={onDelete}
                    title="Delete post"
                  >
                    🗑️
                  </button>
                )}
              </div>
            )}
          </div>
        </header>
        
        {post.image && (
          <div className={styles.postImage}>
            <img src={post.image} alt={post.title} />
          </div>
        )}
        
        <article className={styles.content}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.text}>
            {post.content}
          </div>
          
        </article>
        
        <div className={styles.reactions}>
          {(['like', 'dislike'] as const).map((reactionType) => {
            const reaction = post.reactions.find((r) => r.type === reactionType) || {
              type: reactionType,
              count: 0,
              userReacted: false,
            };
            
            return (
              <button
                key={reactionType}
                className={`${styles.reactionButton} ${
                  reaction.userReacted ? styles.active : ''
                }`}
                onClick={() => handleReaction(reactionType)}
                disabled={!onReaction}
              >
                {getReactionEmoji(reactionType)} {reaction.count}
              </button>
            );
          })}
        </div>
        
        <PostComments
          comments={comments}
          postId={post.id}
          onAddComment={onAddComment}
          isAddingComment={isAddingComment}
          isLoadingComments={isLoadingComments}
        />
      </div>
    </div>
  );
};

const getReactionEmoji = (type: string) => {
  const emojis: Record<string, string> = {
    like: '👍',
    dislike: '👎'
  };
  return emojis[type] || '👍';
};

export default PostFull;