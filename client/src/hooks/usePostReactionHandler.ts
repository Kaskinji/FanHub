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

        
        const currentReaction = post.reactions.find((r) => r.type === reactionType);
        const otherReactionType = reactionType === "like" ? "dislike" : "like";
        const otherReaction = post.reactions.find((r) => r.type === otherReactionType);

        const currentUserReacted = currentReaction?.userReacted || false;
        const otherUserReacted = otherReaction?.userReacted || false;

        
        if (currentUserReacted) {
          
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
          
          if (otherUserReacted) {
            
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
            
            try {
              await reactionApi.addReaction(postId, reactionType);
            } catch {
              return;
            }
          }
        }

        
        const updatedReactions = post.reactions.map((r) => {
          if (r.type === reactionType) {
            return {
              ...r,
              count: currentUserReacted ? Math.max(0, r.count - 1) : r.count + 1,
              userReacted: !currentUserReacted,
            };
          } else if (r.type === otherReactionType && otherUserReacted) {
            
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

