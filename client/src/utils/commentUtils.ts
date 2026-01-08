import type { Comment } from "../types/Post";

/**
 * Подсчитывает общее количество комментариев, включая все ответы (рекурсивно)
 */
export const countAllComments = (commentList: Comment[]): number => {
  return commentList.reduce((count, comment) => {
    return count + 1 + (comment.replies ? countAllComments(comment.replies) : 0);
  }, 0);
};

