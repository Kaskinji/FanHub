import { useState, useEffect, useRef, useCallback } from "react";
import type { Post, Comment as CommentType } from "../types/Post";
import { postApi } from "../api/PostApi";
import { commentApi } from "../api/CommentApi";
import { countAllComments } from "../utils/commentUtils";
import { usePostReactions } from "./usePostReactions";

interface UseSelectedPostParams {
  selectedPostId: number | null;
  posts: Post[];
  postsRef: React.MutableRefObject<Post[]>;
}

/**
 * Хук для работы с выбранным постом и его комментариями
 */
export const useSelectedPost = ({
  selectedPostId,
  posts,
  postsRef,
}: UseSelectedPostParams) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedPostComments, setSelectedPostComments] = useState<
    CommentType[]
  >([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const { getPostReactions } = usePostReactions();

  useEffect(() => {
    let isCancelled = false;

    const loadPostDetails = async () => {
      if (!selectedPostId) {
        setSelectedPost(null);
        setSelectedPostComments([]);
        return;
      }

      const post = postsRef.current.find((p) => p.id === selectedPostId);
      if (post) {
        if (!isCancelled) {
          setSelectedPost(post);
        }
      } else {
        try {
          const postDto = await postApi.getPostById(selectedPostId);
          const fullPost = await postApi.adaptToFullPost(postDto);
          if (fullPost && !isCancelled) {
            setSelectedPost(fullPost);
          }
        } catch {
          // Post loading failed silently
        }
      }

      if (!isCancelled) {
        try {
          setLoadingComments(true);
          const [commentsDto, reactions] = await Promise.all([
            commentApi.getCommentsByPostId(selectedPostId),
            getPostReactions(selectedPostId),
          ]);

          const comments = commentApi.adaptToComments(commentsDto);

          if (!isCancelled) {
            setSelectedPostComments(comments);

            setSelectedPost((currentPost) => {
              if (currentPost) {
                return {
                  ...currentPost,
                  commentCount: countAllComments(comments),
                  reactions: reactions,
                };
              }
              return currentPost;
            });
          }
        } catch {
          if (!isCancelled) {
            setSelectedPostComments([]);
          }
        } finally {
          if (!isCancelled) {
            setLoadingComments(false);
          }
        }
      }
    };

    loadPostDetails();

    return () => {
      isCancelled = true;
    };
  }, [selectedPostId, getPostReactions, postsRef]);

  const addComment = useCallback(
    async (content: string) => {
      if (!selectedPostId) return;

      try {
        await commentApi.createComment({
          postId: selectedPostId,
          content: content,
        });

        await new Promise((resolve) => setTimeout(resolve, 500));

        const commentsDto = await commentApi.getCommentsByPostId(selectedPostId);
        const comments = commentApi.adaptToComments(commentsDto);
        const totalCommentsCount = countAllComments(comments);

        setSelectedPostComments(comments);

        setSelectedPost((prev) =>
          prev
            ? {
                ...prev,
                commentCount: totalCommentsCount,
              }
            : null
        );

        return totalCommentsCount;
      } catch {
        return null;
      }
    },
    [selectedPostId]
  );

  return {
    selectedPost,
    selectedPostComments,
    loadingComments,
    addComment,
    setSelectedPost,
  };
};

