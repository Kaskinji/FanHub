// components/Post/PostComments.tsx
import { useState, type FC } from "react";
import styles from "./PostComments.module.scss";
import type { Comment as CommentType } from "../../../types/Post";
import Comment from "../Comment/Comment";
import CommentCreator from "../Comment/CommentCreator/CommentCreator";

interface PostCommentsProps {
  comments: CommentType[];
  postId: number;
  onAddComment?: (content: string) => Promise<void>;
  onUpdateComment?: (commentId: number, updatedComment: CommentType) => void;
  onDeleteComment?: (commentId: number) => void;
  isAddingComment?: boolean;
  isLoadingComments?: boolean;
}

const PostComments: FC<PostCommentsProps> = ({
  comments,
  postId,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  isAddingComment = false,
  isLoadingComments = false
}) => {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleAddComment = async (content: string) => {
    if (onAddComment) {
      await onAddComment(content);
      setReplyingTo(null);
    }
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
  };

  return (
    <section className={styles.postComments}>
      <h3 className={styles.title}>
        Comments ({comments.length})
      </h3>
      
      {onAddComment && (
        <CommentCreator
          onSubmit={handleAddComment}
          isSubmitting={isAddingComment}
          replyingTo={replyingTo ? comments.find(c => c.id === replyingTo) : null}
        />
      )}
      
      <div className={styles.commentsList}>
        {isLoadingComments ? (
          <div className={styles.loading}>
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className={styles.noComments}>
            There are no comments yet. Be the first!
          </div>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onUpdate={onUpdateComment}
              onDelete={onDeleteComment}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default PostComments;