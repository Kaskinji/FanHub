import type { FC } from "react";
import PostPreview from "../../../components/Post/PostPreview/PostPreview";
import SectionTitle from "../../../components/UI/SectionTitle/SectionTitle";
import { AddButton } from "../../../components/UI/buttons/AddButton/AddButton";
import type { Post } from "../../../types/Post";
import type { SortOption } from "../../../hooks/usePosts";
import styles from "./PostsList.module.scss";
import { CustomSelect } from "../../../components/UI/CustomSelect/CustomSelect";

interface PostsListProps {
  posts: Post[];
  loading?: boolean;
  fandomName?: string;
  isAuthenticated: boolean;
  sortOption: SortOption;
  onPostClick: (postId: number) => void;
  onReaction: (postId: number, reactionType: "like" | "dislike") => void;
  onAddPost: () => void;
  onSortChange: (option: SortOption) => void;
}

export const PostsList: FC<PostsListProps> = ({
  posts,
  loading = false,
  fandomName,
  isAuthenticated,
  sortOption,
  onPostClick,
  onReaction,
  onAddPost,
  onSortChange,
}) => {
  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "reactions-desc", label: "Most Reactions" },
    { value: "reactions-asc", label: "Least Reactions" },
  ];

  // Функция для рендеринга skeleton-карточек постов
  const renderPostSkeletons = (count: number = 6) => {
    return Array.from({ length: count }).map((_, index) => (
      <div key={`post-skeleton-${index}`} className={styles.postSkeleton}>
        <div className={styles.postSkeletonImageContainer}>
          <div className={styles.postSkeletonImage} />
          <div className={styles.postSkeletonCategory} />
        </div>
        <div className={styles.postSkeletonContent}>
          <div className={styles.postSkeletonTitle} />
          <div className={styles.postSkeletonExcerpt}>
            <div className={styles.postSkeletonLine} />
            <div className={styles.postSkeletonLine} />
            <div className={styles.postSkeletonLineShort} />
          </div>
          <div className={styles.postSkeletonMeta}>
            <div className={styles.postSkeletonAuthor}>
              <div className={styles.postSkeletonAvatar} />
              <div className={styles.postSkeletonUsername} />
            </div>
            <div className={styles.postSkeletonStats}>
              <div className={styles.postSkeletonReaction} />
              <div className={styles.postSkeletonReaction} />
              <div className={styles.postSkeletonComment} />
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <main className={styles.content}>    
      <div className={styles.topSection}>
        {fandomName && (
        <div className={styles.fandomInfo}>
          <span className={styles.fandomLabel}>Fandom: </span>
          <span className={styles.fandomName}>{fandomName}</span>
        </div>
      )}
        <CustomSelect
          label="Sort by:"
          options={sortOptions}
          value={sortOption}
          onChange={(value) => onSortChange(value as SortOption)}
        />
      </div>

      <div className={styles.sectionHeader}>
        <SectionTitle title="Posts" />
        {isAuthenticated && !loading && (
          <AddButton className={styles.addButton} text="Add" onClick={onAddPost} />
        )}
      </div>

      <div className={styles.postsGrid}>
        {loading ? (
          renderPostSkeletons(6)
        ) : posts.length === 0 ? (
          <div className={styles.noPosts}>
            <p>No posts found for this fandom.</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostPreview
              key={post.id}
              post={post}
              onClick={onPostClick}
              onReaction={onReaction}
            />
          ))
        )}
      </div>
    </main>
  );
};

