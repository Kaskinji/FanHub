// components/Post/PostComments.tsx
import { useState, type FC } from "react";
import styles from "./PostComments.module.scss";
import type { Comment as CommentType } from "../../../types/Post";
import Comment from "../Comment/Comment";
import CommentCreator from "./PostComments.module.scss";

interface PostCommentsProps {
  comments: CommentType[];
  postId: number;
  onAddComment: (content: string) => Promise<void>;
  isAddingComment?: boolean;
}

const PostComments: FC<PostCommentsProps> = ({
  comments,
  postId,
  onAddComment,
  isAddingComment = false
}) => {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleAddComment = async (content: string) => {
    await onAddComment(content);
    setReplyingTo(null);
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
    // Можно добавить скролл к форме ответа
  };

  return (
    <section className={styles.postComments}>
      <h3 className={styles.title}>
        Комментарии ({comments.length})
      </h3>
      
      {/* Форма создания комментария */}
      <CommentCreator
        onSubmit={handleAddComment}
        isSubmitting={isAddingComment}
      />
      
      {/* Список комментариев */}
      <div className={styles.commentsList}>
        {comments.length === 0 ? (
          <div className={styles.noComments}>
            Пока нет комментариев. Будьте первым!
          </div>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default PostComments;