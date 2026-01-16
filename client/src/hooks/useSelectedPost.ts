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
      const existingReactions = post && post.reactions && post.reactions.length > 0 ? post.reactions : null;

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
          
        }
      }

      if (!isCancelled) {
        try {
          setLoadingComments(true);
          
          
          const commentsPromise = commentApi.getCommentsByPostId(selectedPostId);
          const reactionsPromise = existingReactions 
            ? Promise.resolve(existingReactions) 
            : getPostReactions(selectedPostId);

          const [commentsDto, reactions] = await Promise.all([
            commentsPromise,
            reactionsPromise,
          ]);

          const comments = commentApi.adaptToComments(commentsDto);

          if (!isCancelled) {
            setSelectedPostComments(comments);

            setSelectedPost((currentPost) => {
              if (currentPost) {
                return {
                  ...currentPost,
                  commentCount: countAllComments(comments),
                  
                  reactions: reactions && reactions.length > 0 ? reactions : (currentPost.reactions || existingReactions || []),
                };
              }
              return currentPost;
            });
          }
        } catch {
          if (!isCancelled) {
            setSelectedPostComments([]);
            
            setSelectedPost((currentPost) => {
              if (currentPost && existingReactions && (!currentPost.reactions || currentPost.reactions.length === 0)) {
                return {
                  ...currentPost,
                  reactions: existingReactions,
                };
              }
              return currentPost;
            });
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

  const updateComment = useCallback(
    (commentId: number, updatedComment: CommentType) => {
      const updateCommentInTree = (comments: CommentType[]): CommentType[] => {
        return comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...updatedComment,
              replies: comment.replies || updatedComment.replies || [],
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentInTree(comment.replies),
            };
          }
          return comment;
        });
      };

      setSelectedPostComments((prev) => {
        const updated = updateCommentInTree(prev);
        const totalCommentsCount = countAllComments(updated);
        
        setSelectedPost((currentPost) =>
          currentPost
            ? {
                ...currentPost,
                commentCount: totalCommentsCount,
              }
            : null
        );
        
        return updated;
      });
    },
    []
  );

  const deleteComment = useCallback(
    (commentId: number) => {
      const deleteCommentFromTree = (comments: CommentType[]): CommentType[] => {
        return comments
          .filter((comment) => comment.id !== commentId)
          .map((comment) => {
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: deleteCommentFromTree(comment.replies),
              };
            }
            return comment;
          });
      };

      setSelectedPostComments((prev) => {
        const updated = deleteCommentFromTree(prev);
        const totalCommentsCount = countAllComments(updated);
        
        setSelectedPost((currentPost) =>
          currentPost
            ? {
                ...currentPost,
                commentCount: totalCommentsCount,
              }
            : null
        );
        
        return updated;
      });
    },
    []
  );

  return {
    selectedPost,
    selectedPostComments,
    loadingComments,
    addComment,
    updateComment,
    deleteComment,
    setSelectedPost,
  };
};

