import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { PostsContextData } from "../../types/Post";
import { postApi } from "../../api/PostApi";
import { fandomApi } from "../../api/FandomApi";
import { useAuth } from "../../hooks/useAuth";
import { usePosts } from "../../hooks/usePosts";
import { useSelectedPost } from "../../hooks/useSelectedPost";
import { usePostReactionHandler } from "../../hooks/usePostReactionHandler";

export const usePostsPage = () => {
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const postsDataFromState = location.state as PostsContextData | undefined;
  
  const fandomIdFromUrl = params.id ? parseInt(params.id, 10) : undefined;
  const fandomId = fandomIdFromUrl || postsDataFromState?.fandomId;
  const fandomNameFromState = postsDataFromState?.fandomName;
  const postIdFromState = postsDataFromState?.postId;
  
  const [fandomName, setFandomName] = useState<string | undefined>(fandomNameFromState);
  const { isAuthenticated } = useAuth();
  
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [isAddingComment, setIsAddingComment] = useState(false);
  
  const hasProcessedInitialPostId = useRef(false);

  const {
    posts,
    loading,
    error,
    sortOption,
    categories,
    selectedCategory,
    showCategoryFilter,
    loadPosts,
    refreshPost,
    updatePost,
    removePost,
    postsRef,
    setSort,
    filterByCategory,
    toggleCategoryFilter,
    resetFilters,
  } = usePosts({
    fandomId: fandomId,
  });

  const {
    selectedPost,
    selectedPostComments,
    loadingComments,
    addComment,
    updateComment,
    deleteComment,
    setSelectedPost,
  } = useSelectedPost({
    selectedPostId,
    posts,
    postsRef,
  });

  const handlePostUpdate = (postId: number, updatedPost: typeof posts[0]) => {
    updatePost(postId, updatedPost);
    if (selectedPostId === postId) {
      setSelectedPost(updatedPost);
    }
  };

  const { handleReaction } = usePostReactionHandler({
    isAuthenticated,
    postsRef,
    selectedPost,
    selectedPostId,
    onPostUpdate: handlePostUpdate,
  });

  useEffect(() => {
    const loadFandomName = async () => {
      if (fandomId && !fandomName) {
        try {
          const fandom = await fandomApi.getFandomById(fandomId);
          setFandomName(fandom.name);
        } catch (err) {
          console.error("Failed to load fandom name:", err);
        }
      }
    };

    loadFandomName();
  }, [fandomId, fandomName]);

  useEffect(() => {
    if (postIdFromState && !loading && !hasProcessedInitialPostId.current) {
      hasProcessedInitialPostId.current = true;
      const timer = setTimeout(() => {
        setSelectedPostId(postIdFromState);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [postIdFromState, loading]);

  const handleAddComment = async (content: string) => {
    if (!selectedPostId) return;

    setIsAddingComment(true);
    try {
      const totalCommentsCount = await addComment(content);
      if (totalCommentsCount !== null) {
        updatePost(selectedPostId, {
          commentCount: totalCommentsCount,
        } as typeof posts[0]);
      }
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleCreatePostSuccess = async () => {
    setShowPostForm(false);
    await loadPosts();
  };

  const handleEditPost = () => {
    if (!selectedPost || !isAuthenticated) return;

    const currentUserId = Number(localStorage.getItem("user_id"));
    const isAuthor = currentUserId && selectedPost.author.id === currentUserId;

    if (!isAuthor) {
      return;
    }

    setEditingPostId(selectedPost.id);
  };

  const handleEditPostSuccess = async (postId: number) => {
    setEditingPostId(null);

    const postExists = posts.find((p) => p.id === postId);
    if (!postExists) {
      await loadPosts();
      setSelectedPostId(null);
      setSelectedPost(null);
      return;
    }

    const updatedPost = await refreshPost(postId);
    if (updatedPost && selectedPostId === postId) {
      setSelectedPost(updatedPost);
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPost || !isAuthenticated) return;

    const currentUserId = Number(localStorage.getItem("user_id"));
    const isAuthor = currentUserId && selectedPost.author.id === currentUserId;

    if (!isAuthor) {
      return;
    }

    try {
      await postApi.deletePost(selectedPost.id);
      removePost(selectedPost.id);
      setSelectedPostId(null);
      setSelectedPost(null);
    } catch {
      await loadPosts();
    }
  };

  return {
    fandomId,
    fandomName,
    isAuthenticated,
    selectedPostId,
    setSelectedPostId,
    showPostForm,
    setShowPostForm,
    editingPostId,
    setEditingPostId,
    isAddingComment,
    posts,
    loading,
    error,
    sortOption,
    categories,
    selectedCategory,
    showCategoryFilter,
    selectedPost,
    selectedPostComments,
    loadingComments,
    handleReaction,
    handleAddComment,
    handleCreatePostSuccess,
    handleEditPost,
    handleEditPostSuccess,
    handleDeletePost,
    updateComment,
    deleteComment,
    setSort,
    filterByCategory,
    toggleCategoryFilter,
    resetFilters,
  };
};

