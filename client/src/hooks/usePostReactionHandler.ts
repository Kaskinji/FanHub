import { useCallback } from "react";
import { reactionApi, ReactionTypeToNumber } from "../api/ReactionApi";
import type { Post } from "../types/Post";

interface UsePostReactionHandlerParams {
  isAuthenticated: boolean;
  postsRef: React.MutableRefObject<Post[]>;
  selectedPost: Post | null;
  selectedPostId: number | null;
  onPostUpdate: (postId: number, post: Post) => void;
}

/**
 * Хук для обработки реакций на посты
 * Использует локальные данные реакций из post.reactions, не запрашивает их повторно из API
 */
export const usePostReactionHandler = ({
  isAuthenticated,
  postsRef,
  selectedPost,
  selectedPostId,
  onPostUpdate,
}: UsePostReactionHandlerParams) => {
  const handleReaction = useCallback(
    async (postId: number, reactionType: "like" | "dislike") => {
      if (!isAuthenticated) return;

      try {
        const post = postsRef.current.find((p) => p.id === postId) || selectedPost;
        if (!post) return;

        const userId = Number(localStorage.getItem("user_id"));
        if (!userId) {
          return;
        }

        // Используем локальные данные реакций из post.reactions (из postStats)
        const currentReaction = post.reactions.find((r) => r.type === reactionType);
        const otherReactionType = reactionType === "like" ? "dislike" : "like";
        const otherReaction = post.reactions.find((r) => r.type === otherReactionType);

        const currentUserReacted = currentReaction?.userReacted || false;
        const otherUserReacted = otherReaction?.userReacted || false;

        // Определяем, нужно ли удалить реакцию или добавить новую
        if (currentUserReacted) {
          // Удаляем текущую реакцию - нужен ID реакции (единственный запрос к API для получения ID)
          try {
            const postReactions = await reactionApi.getPostReactions(postId);
            const userReaction = postReactions.find((r) => r.userId === userId);
            if (userReaction) {
              await reactionApi.removeReaction(userReaction.id);
            }
          } catch {
            return;
          }
        } else {
          // Добавляем новую реакцию
          if (otherUserReacted) {
            // Если у пользователя есть другая реакция, сначала удаляем её (нужен ID)
            try {
              const postReactions = await reactionApi.getPostReactions(postId);
              const userReaction = postReactions.find((r) => r.userId === userId);
              if (userReaction) {
                await Promise.all([
                  reactionApi.removeReaction(userReaction.id),
                  reactionApi.addReaction(postId, reactionType),
                ]);
              } else {
                await reactionApi.addReaction(postId, reactionType);
              }
            } catch {
              return;
            }
          } else {
            // Просто добавляем новую реакцию - без запроса данных, только добавление
            try {
              await reactionApi.addReaction(postId, reactionType);
            } catch {
              return;
            }
          }
        }

        // Обновляем локальное состояние на основе текущих данных, без повторного запроса к API
        const updatedReactions = post.reactions.map((r) => {
          if (r.type === reactionType) {
            return {
              ...r,
              count: currentUserReacted ? Math.max(0, r.count - 1) : r.count + 1,
              userReacted: !currentUserReacted,
            };
          } else if (r.type === otherReactionType && otherUserReacted) {
            // Убираем другую реакцию, если она была
            return {
              ...r,
              count: Math.max(0, r.count - 1),
              userReacted: false,
            };
          }
          return r;
        });

        const updatedPost: Post = {
          ...post,
          reactions: updatedReactions,
        };

        onPostUpdate(postId, updatedPost);
      } catch {
        // Reaction handling failed silently
      }
    },
    [
      isAuthenticated,
      postsRef,
      selectedPost,
      selectedPostId,
      onPostUpdate,
    ]
  );

  return { handleReaction };
};

