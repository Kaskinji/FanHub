import { useCallback } from "react";
import { reactionApi, type ReactionType, ReactionTypeMap } from "../api/ReactionApi";
import { useAuth } from "./useAuth";

export interface PostReaction {
  type: ReactionType;
  count: number;
  userReacted: boolean;
}

/**
 * Хук для работы с реакциями постов
 */
export const usePostReactions = () => {
  const { isAuthenticated } = useAuth();

  const getPostReactions = useCallback(
    async (
      postId: number,
      currentUserId?: number
    ): Promise<PostReaction[]> => {
      try {
        const userId = isAuthenticated
          ? currentUserId || Number(localStorage.getItem("user_id")) || undefined
          : undefined;

        const postReactions = await reactionApi.getPostReactions(postId);

        const reactionCounts: Partial<
          Record<ReactionType, { count: number; userReacted: boolean }>
        > = {
          like: { count: 0, userReacted: false },
          dislike: { count: 0, userReacted: false },
        };

        postReactions.forEach((reaction) => {
          const type = ReactionTypeMap[reaction.type];
          if (type && reactionCounts[type]) {
            reactionCounts[type].count++;
            if (userId && reaction.userId === userId) {
              reactionCounts[type].userReacted = true;
            }
          }
        });

        const result: PostReaction[] = [];

        result.push({
          type: "like" as ReactionType,
          count: reactionCounts.like?.count ?? 0,
          userReacted: reactionCounts.like?.userReacted ?? false,
        });
        result.push({
          type: "dislike" as ReactionType,
          count: reactionCounts.dislike?.count ?? 0,
          userReacted: reactionCounts.dislike?.userReacted ?? false,
        });

        return result;
      } catch {
        return [
          { type: "like" as ReactionType, count: 0, userReacted: false },
          { type: "dislike" as ReactionType, count: 0, userReacted: false },
        ];
      }
    },
    [isAuthenticated]
  );

  return { getPostReactions };
};

