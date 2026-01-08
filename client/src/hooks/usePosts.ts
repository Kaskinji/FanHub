import { useState, useEffect, useRef, useCallback } from "react";
import type { Post } from "../types/Post";
import { postApi } from "../api/PostApi";
import { commentApi } from "../api/CommentApi";
import { countAllComments } from "../utils/commentUtils";
import { usePostReactions, type PostReaction } from "./usePostReactions";
import type { ReactionType } from "../api/ReactionApi";

interface UsePostsParams {
  fandomId?: number;
}

/**
 * Хук для загрузки и управления постами
 */
export const usePosts = ({ fandomId }: UsePostsParams) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getPostReactions } = usePostReactions();
  const postsRef = useRef<Post[]>([]);

  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  const loadPosts = useCallback(async () => {
    if (!fandomId) {
      setError("Fandom ID is not provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const postsDto = await postApi.getPopularPostsByFandom(fandomId);
      const fullPosts = await postApi.adaptToFullPosts(postsDto);

      const postsWithComments = await Promise.all(
        fullPosts.map(async (post) => {
          try {
            const [commentsDto, reactions] = await Promise.all([
              commentApi.getCommentsByPostId(post.id),
              getPostReactions(post.id),
            ]);

            const comments = commentApi.adaptToComments(commentsDto);
            const totalCommentsCount = countAllComments(comments);

            return {
              ...post,
              commentCount: totalCommentsCount,
              reactions: reactions,
            };
          } catch {
            return {
              ...post,
              commentCount: 0,
              reactions: [
                { type: "like" as ReactionType, count: 0, userReacted: false },
                {
                  type: "dislike" as ReactionType,
                  count: 0,
                  userReacted: false,
                },
              ],
            };
          }
        })
      );

      setPosts(postsWithComments);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load posts"
      );
    } finally {
      setLoading(false);
    }
  }, [fandomId, getPostReactions]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const refreshPost = useCallback(
    async (postId: number) => {
      try {
        const postDto = await postApi.getPostById(postId);
        const fullPost = await postApi.adaptToFullPost(postDto);

        if (fullPost) {
          const [commentsDto, reactions] = await Promise.all([
            commentApi.getCommentsByPostId(postId),
            getPostReactions(postId),
          ]);

          const comments = commentApi.adaptToComments(commentsDto);
          const totalCommentsCount = countAllComments(comments);

          const updatedPost = {
            ...fullPost,
            commentCount: totalCommentsCount,
            reactions: reactions,
          };

          setPosts((prev) =>
            prev.map((p) => (p.id === postId ? updatedPost : p))
          );

          return updatedPost;
        }
      } catch {
        await loadPosts();
      }
      return null;
    },
    [getPostReactions, loadPosts]
  );

  const updatePost = useCallback((postId: number, updates: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updates } : p))
    );
  }, []);

  const removePost = useCallback((postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  return {
    posts,
    loading,
    error,
    loadPosts,
    refreshPost,
    updatePost,
    removePost,
    postsRef,
  };
};

