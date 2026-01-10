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
  return (
    <main className={styles.content}>
      {fandomName && (
        <div className={styles.fandomInfo}>
          <span className={styles.fandomLabel}>Fandom: </span>
          <span className={styles.fandomName}>{fandomName}</span>
        </div>
      )}

      <div className={styles.topSection}>
        <CustomSelect
          label="Sort by:"
          options={sortOptions}
          value={sortOption}
          onChange={(value) => onSortChange(value as SortOption)}
        />
      </div>

      <div className={styles.sectionHeader}>
        <SectionTitle title="Posts" />
        {isAuthenticated && (
          <AddButton className={styles.addButton} text="Add" onClick={onAddPost} />
        )}
      </div>

      <div className={styles.postsGrid}>
        {posts.length === 0 ? (
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

