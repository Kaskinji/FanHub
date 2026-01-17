import type { FC } from "react";
import Header from "../../components/Header/Header";
import PostFull from "../../components/Post/PostFull/PostFull";
import PostForm from "./PostForm/PostForm";
import ErrorState from "../../components/ErrorState/ErrorState";
import { PostsList } from "./components/PostsList";
import styles from "./PostsPage.module.scss";
import type { Post } from "../../types/Post";
import type { Comment } from "../../types/Post";
import type { SortOption } from "../../hooks/usePosts";

type PostsPageViewProps = {
  fandomId: number | undefined;
  fandomName: string | undefined;
  isAuthenticated: boolean;
  selectedPostId: number | null;
  setSelectedPostId: (id: number | null) => void;
  showPostForm: boolean;
  setShowPostForm: (show: boolean) => void;
  editingPostId: number | null;
  setEditingPostId: (id: number | null) => void;
  isAddingComment: boolean;
  posts: Post[];
  loading: boolean;
  error: string | null;
  sortOption: SortOption;
  categories: string[];
  selectedCategory: string;
  showCategoryFilter: boolean;
  selectedPost: Post | null;
  selectedPostComments: Comment[];
  loadingComments: boolean;
  handleReaction: (postId: number, reactionType: "like" | "dislike") => void;
  handleAddComment: (content: string) => Promise<void>;
  handleCreatePostSuccess: () => Promise<void>;
  handleEditPost: () => void;
  handleEditPostSuccess: (postId: number) => Promise<void>;
  handleDeletePost: () => Promise<void>;
  updateComment: (commentId: number, updatedComment: Comment) => void;
  deleteComment: (commentId: number) => void;
  setSort: (option: SortOption) => void;
  filterByCategory: (category: string) => void;
  toggleCategoryFilter: () => void;
  resetFilters: () => void;
}

export const PostsPageView: FC<PostsPageViewProps> = ({
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
}) => {
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
};

