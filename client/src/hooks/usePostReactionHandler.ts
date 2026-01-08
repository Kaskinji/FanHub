import { useCallback } from "react";
import { reactionApi, ReactionTypeToNumber } from "../api/ReactionApi";
import { postApi } from "../api/PostApi";
import { usePostReactions } from "./usePostReactions";
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
 */
export const usePostReactionHandler = ({
  isAuthenticated,
  postsRef,
  selectedPost,
  selectedPostId,
  onPostUpdate,
}: UsePostReactionHandlerParams) => {
  const { getPostReactions } = usePostReactions();

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

        const postReactions = await reactionApi.getPostReactions(postId);
        const userReaction =
          postReactions.find((r) => r.userId === userId) || null;

        const reactionTypeNumber = ReactionTypeToNumber[reactionType];

        if (userReaction) {
          if (userReaction.type === reactionTypeNumber) {
            try {
              await reactionApi.removeReaction(userReaction.id);
            } catch {
              return;
            }
          } else {
            try {
              await Promise.all([
                reactionApi.removeReaction(userReaction.id),
                reactionApi.addReaction(postId, reactionType),
              ]);
            } catch {
              return;
            }
          }
        } else {
          try {
            await reactionApi.addReaction(postId, reactionType);
          } catch {
            return;
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 100));

        const updatedPostDto = await postApi.getPostById(postId);
        const fullUpdatedPost = await postApi.adaptToFullPost(updatedPostDto);

        if (!fullUpdatedPost) {
          return;
        }

        const finalReactions = await getPostReactions(postId, userId);

        const finalUpdatedPost = {
          ...fullUpdatedPost,
          reactions: finalReactions,
          commentCount: post.commentCount,
        };

        onPostUpdate(postId, finalUpdatedPost);
      } catch {
        // Reaction handling failed silently
      }
    },
    [
      isAuthenticated,
      postsRef,
      selectedPost,
      selectedPostId,
      getPostReactions,
      onPostUpdate,
    ]
  );

  return { handleReaction };
};

