import { useState, type FC } from "react";
import { FirstLetter } from "../../UI/FirstLetter/FirstLetter";
import styles from "./Comment.module.scss";
import type { Comment as CommentType } from "../../../types/Post";
import { commentApi } from "../../../api/CommentApi";
import editIcon from "../../../assets/edit.svg";
import deleteIcon from "../../../assets/delete.svg";

interface CommentProps {
  comment: CommentType;
  onUpdate?: (commentId: number, updatedComment: CommentType) => void;
  onDelete?: (commentId: number) => void;
  className?: string;
}

const Comment: FC<CommentProps> = ({ comment, onUpdate, onDelete, className }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingInProgress, setIsDeletingInProgress] = useState(false);

  const currentUserId = Number(localStorage.getItem('user_id'));
  const isAuthor = Boolean(currentUserId) && comment.author.id === currentUserId;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("eng-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      await commentApi.updateComment(comment.id, { content: editedContent });
      
      const updatedComment: CommentType = {
        ...comment,
        content: editedContent,
        updatedAt: new Date().toISOString()
      };
      
      if (onUpdate) {
        onUpdate(comment.id, updatedComment);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
      alert('Failed to update comment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeletingInProgress(true);
    try {
      await commentApi.deleteComment(comment.id);
      
      if (onDelete) {
        onDelete(comment.id);
      }
      
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setIsDeletingInProgress(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className={`${styles.comment} ${className || ''}`}>
        <div className={styles.authorSection}>
          <div className={styles.avatar}>
            {comment.author.avatar ? (
              <img 
                src={comment.author.avatar} 
                alt={comment.author.username}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <FirstLetter text={comment.author.username} fontSize="1.1rem" />
              </div>
            )}
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.commentHeader}>
            <span className={styles.username}>{comment.author.username}</span>
            <span className={styles.date}>{formatDate(comment.createdAt)}</span>
          </div>
          
          {isEditing ? (
            <div className={styles.editContainer}>
              <textarea
                className={styles.editTextarea}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                disabled={isSaving}
                rows={3}
              />
              <div className={styles.editActions}>
                <button
                  className={styles.confirmButton}
                  onClick={handleSaveEdit}
                  disabled={isSaving || !editedContent.trim()}
                >
                  {isSaving ? 'Saving...' : 'Confirm'}
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.commentText}>
              {comment.content}
            </div>
          )}

          {isAuthor && !isEditing && (
            <div className={styles.commentActionsButtons}>
              <button
                className={styles.actionButton}
                onClick={handleEdit}
                title="Edit comment"
              >
                <img src={editIcon} alt="edit" className={styles.actionIcon} />
              </button>
              <button
                className={styles.actionButton}
                onClick={handleDeleteClick}
                title="Delete comment"
              >
                <img src={deleteIcon} alt="delete" className={styles.actionIcon} />
              </button>
            </div>
          )}

        <div className={styles.commentActions}>
          {comment.reactions && comment.reactions.length > 0 && (
            <div className={styles.reactions}>
              {comment.reactions.map((reaction, index) => (
                <span key={index} className={styles.reaction}>
                  {reaction.type === 'like' ? '👍' : '👎'} {reaction.count}
                </span>
              ))}
            </div>
          )}
        </div>

          
        </div>
      </div>

      {showDeleteConfirm && (
        <div className={styles.deleteConfirmOverlay} onClick={handleCancelDelete}>
          <div className={styles.deleteConfirmModal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.deleteConfirmTitle}>Delete Comment</h3>
            <p className={styles.deleteConfirmText}>
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className={styles.deleteConfirmActions}>
              <button
                className={styles.deleteConfirmButton}
                onClick={handleConfirmDelete}
                disabled={isDeletingInProgress}
              >
                {isDeletingInProgress ? 'Deleting...' : 'Delete'}
              </button>
              <button
                className={styles.deleteCancelButton}
                onClick={handleCancelDelete}
                disabled={isDeletingInProgress}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;