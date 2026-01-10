// components/Comment/CommentCreator.tsx
import { useState, type FC, useRef } from "react";
import styles from "../CommentCreator/CommentCreator.module.scss";

interface CommentCreatorProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
}

const CommentCreator: FC<CommentCreatorProps> = ({ 
  onSubmit, 
  isSubmitting = false
}) => {
  const [commentText, setCommentText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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