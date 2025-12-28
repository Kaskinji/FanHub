// components/Comment/CommentCreator.tsx
import { useState, type FC, useRef, useCallback } from "react";
import styles from "../CommentCreator/CommentCreator.module.scss";
import type { Comment as CommentType } from "../../../../types/Post";
import React from "react";
interface CommentCreatorProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
  replyingTo?: CommentType | null;
}

const CommentCreator: FC<CommentCreatorProps> = ({ 
  onSubmit, 
  isSubmitting = false,
  replyingTo = null 
}) => {
  const [commentText, setCommentText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Используем useCallback для предотвращения ререндеров
  const focusTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, []);

  // Обработчик изменения replyingTo
  const handleReplyingToChange = useCallback(() => {
    if (replyingTo) {
      const newText = `@${replyingTo.author.username} `;
      setCommentText(newText);
      
      // Используем setTimeout для асинхронного фокуса
      setTimeout(focusTextarea, 0);
    }
  }, [replyingTo, focusTextarea]);

  // Используем useEffect только для вызова функции
  React.useEffect(() => {
    handleReplyingToChange();
  }, [handleReplyingToChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      await onSubmit(commentText);
      setCommentText("");
    }
  };

  return (
    <form className={styles.commentCreator} onSubmit={handleSubmit}>

      
      <textarea
        ref={textareaRef}
        className={styles.commentTextarea}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
        disabled={isSubmitting}
      />
      <div className={styles.commentActions}>
        <button 
          className={styles.submitButton}
          type="submit"
          disabled={!commentText.trim() || isSubmitting}
        >
          {isSubmitting ? 'Submit...' : 'Publish'}
        </button>
      </div>
    </form>
  );
};

export default CommentCreator;