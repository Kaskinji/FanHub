import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import PostFull from "../../components/Post/PostFull/PostFull";
import PostForm from "./PostForm/PostForm";
import styles from "./PostsPage.module.scss";
import type { PostsContextData } from "../../types/Post";
import { postApi } from "../../api/PostApi";
import { fandomApi } from "../../api/FandomApi";
import ErrorState from "../../components/ErrorState/ErrorState";
import { useAuth } from "../../hooks/useAuth";
import { usePosts } from "../../hooks/usePosts";
import { useSelectedPost } from "../../hooks/useSelectedPost";
import { usePostReactionHandler } from "../../hooks/usePostReactionHandler";
import { PostsList } from "./components/PostsList";

export default function PostsPage() {
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const postsDataFromState = location.state as PostsContextData | undefined;
  
  // Приоритет: сначала проверяем параметр из URL, затем из state
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
  // Флаг, чтобы отследить, был ли уже обработан postId из location.state
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

  // Загружаем название фандома через API, если его нет в state
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

  // Устанавливаем selectedPostId после загрузки постов (только один раз при монтировании)
  useEffect(() => {
    if (postIdFromState && !loading && !hasProcessedInitialPostId.current) {
      // Устанавливаем ID поста после завершения загрузки
      // useSelectedPost сам проверит наличие поста в списке или загрузит через API
      hasProcessedInitialPostId.current = true;
      const timer = setTimeout(() => {
        setSelectedPostId(postIdFromState);
      }, 300); // Задержка, чтобы убедиться, что postsRef обновлен после загрузки
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
      // Delete failed, reload posts
      await loadPosts();
    }
  };

  if (error) {
    return (
      <div className={styles.page}>
        <Header onSearch={() => {}} />
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header onSearch={() => {}} />

      <PostsList
        posts={posts}
        loading={loading}
        fandomName={fandomName}
        isAuthenticated={isAuthenticated}
        sortOption={sortOption}
        categories={categories}
        selectedCategory={selectedCategory}
        showCategoryFilter={showCategoryFilter}
        onPostClick={setSelectedPostId}
        onReaction={handleReaction}
        onAddPost={() => setShowPostForm(true)}
        onSortChange={setSort}
        onCategorySelect={filterByCategory}
        onToggleFilter={toggleCategoryFilter}
        onResetFilters={resetFilters}
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

      {showPostForm && fandomId && (
        <div className={styles.formContainer}>
          <PostForm
            fandomId={fandomId}
            onCancel={() => setShowPostForm(false)}
            onSuccess={handleCreatePostSuccess}
          />
        </div>
      )}

      {editingPostId && fandomId && (
        <div className={styles.formContainer}>
          <PostForm
            fandomId={fandomId}
            postId={editingPostId}
            onCancel={() => setEditingPostId(null)}
            onSuccess={handleEditPostSuccess}
          />
        </div>
      )}
    </div>
  );
}
