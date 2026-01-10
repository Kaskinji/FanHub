import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import PostFull from "../../components/Post/PostFull/PostFull";
import PostForm from "./PostForm/PostForm";
import styles from "./PostsPage.module.scss";
import type { PostsContextData } from "../../types/Post";
import { postApi } from "../../api/PostApi";
import ErrorState from "../../components/ErrorState/ErrorState";
import { useAuth } from "../../hooks/useAuth";
import { usePosts } from "../../hooks/usePosts";
import { useSelectedPost } from "../../hooks/useSelectedPost";
import { usePostReactionHandler } from "../../hooks/usePostReactionHandler";
import { PostsList } from "./components/PostsList";

export default function PostsPage() {
  const location = useLocation();
  const postsData = location.state as PostsContextData;
  const { isAuthenticated } = useAuth();
  
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [isAddingComment, setIsAddingComment] = useState(false);
  // Флаг, чтобы отследить, был ли уже обработан postId из location.state
  const hasProcessedInitialPostId = useRef(false);

  const {
    posts,
    loading,
    error,
    sortOption,
    loadPosts,
    refreshPost,
    updatePost,
    removePost,
    postsRef,
    setSort,
  } = usePosts({
    fandomId: postsData?.fandomId,
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

  // Устанавливаем selectedPostId после загрузки постов (только один раз при монтировании)
  useEffect(() => {
    if (postsData?.postId && !loading && !hasProcessedInitialPostId.current) {
      // Устанавливаем ID поста после завершения загрузки
      // useSelectedPost сам проверит наличие поста в списке или загрузит через API
      hasProcessedInitialPostId.current = true;
      const timer = setTimeout(() => {
        setSelectedPostId(postsData.postId!);
      }, 300); // Задержка, чтобы убедиться, что postsRef обновлен после загрузки
      return () => clearTimeout(timer);
    }
  }, [postsData?.postId, loading]);

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
      // Delete failed, reload posts
      await loadPosts();
    }
  };

  if (error) {
    return (
      <div className={styles.page}>
        <Header onSearch={() => {}} onSignIn={() => {}} />
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header onSearch={() => {}} onSignIn={() => {}} />

      <PostsList
        posts={posts}
        loading={loading}
        fandomName={postsData?.fandomName}
        isAuthenticated={isAuthenticated}
        sortOption={sortOption}
        onPostClick={setSelectedPostId}
        onReaction={handleReaction}
        onAddPost={() => setShowPostForm(true)}
        onSortChange={setSort}
      />

      {selectedPost && (
        <PostFull
          post={selectedPost}
          comments={selectedPostComments}
          onClose={() => setSelectedPostId(null)}
          onAddComment={isAuthenticated ? handleAddComment : undefined}
          onUpdateComment={isAuthenticated ? updateComment : undefined}
          onDeleteComment={isAuthenticated ? deleteComment : undefined}
          onReaction={isAuthenticated ? handleReaction : undefined}
          isAddingComment={isAddingComment}
          isLoadingComments={loadingComments}
          onEdit={isAuthenticated ? handleEditPost : undefined}
          onDelete={isAuthenticated ? handleDeletePost : undefined}
        />
      )}

      {showPostForm && postsData?.fandomId && (
        <div className={styles.formContainer}>
          <PostForm
            fandomId={postsData.fandomId}
            onCancel={() => setShowPostForm(false)}
            onSuccess={handleCreatePostSuccess}
          />
        </div>
      )}

      {editingPostId && postsData?.fandomId && (
        <div className={styles.formContainer}>
          <PostForm
            fandomId={postsData.fandomId}
            postId={editingPostId}
            onCancel={() => setEditingPostId(null)}
            onSuccess={handleEditPostSuccess}
          />
        </div>
      )}
    </div>
  );
}
