import type { FC } from "react";
import { useState, useEffect } from "react";
import PostPreview from "../../../components/Post/PostPreview/PostPreview";
import SectionTitle from "../../../components/UI/SectionTitle/SectionTitle";
import { AddButton } from "../../../components/UI/buttons/AddButton/AddButton";
import Button from "../../../components/UI/buttons/Button/Button";
import type { Post } from "../../../types/Post";
import type { SortOption } from "../../../hooks/usePosts";
import styles from "./PostsList.module.scss";
import { CustomSelect } from "../../../components/UI/CustomSelect/CustomSelect";

type PostsListProps = {
  posts: Post[];
  loading?: boolean;
  fandomName?: string;
  isAuthenticated: boolean;
  sortOption: SortOption;
  categories: string[];
  selectedCategory: string;
  showCategoryFilter: boolean;
  onPostClick: (postId: number) => void;
  onReaction: (postId: number, reactionType: "like" | "dislike") => void;
  onAddPost: () => void;
  onSortChange: (option: SortOption) => void;
  onCategorySelect: (category: string) => void;
  onToggleFilter: () => void;
  onResetFilters: () => void;
}

export const PostsList: FC<PostsListProps> = ({
  posts,
  loading = false,
  fandomName,
  isAuthenticated,
  sortOption,
  categories,
  selectedCategory,
  showCategoryFilter,
  onPostClick,
  onReaction,
  onAddPost,
  onSortChange,
  onCategorySelect,
  onToggleFilter,
  onResetFilters,
}) => {
  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "reactions-desc", label: "Most Reactions" },
    { value: "reactions-asc", label: "Least Reactions" },
  ];

  
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
      <Top
        fandomName={fandomName}
        sortOption={sortOption}
        sortOptions={sortOptions}
        showCategoryFilter={showCategoryFilter}
        onSortChange={onSortChange}
        onToggleFilter={onToggleFilter}
      />
      
      {}
      {showCategoryFilter && (
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={onCategorySelect}
          onClose={onToggleFilter}
        />
      )}
      
      {}
      <ActiveFilters
        selectedCategory={selectedCategory}
        onReset={onResetFilters}
      />

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


type TopProps = {
  fandomName?: string;
  sortOption: SortOption;
  sortOptions: Array<{ value: string; label: string }>;
  showCategoryFilter: boolean;
  onSortChange: (option: SortOption) => void;
  onToggleFilter: () => void;
}

const Top = ({ fandomName, sortOption, sortOptions, showCategoryFilter, onSortChange, onToggleFilter }: TopProps) => {
  return (
    <div className={styles.topSection}>
      {fandomName && (
        <div className={styles.fandomInfo}>
          <span className={styles.fandomLabel}>Fandom: </span>
          <span className={styles.fandomName}>{fandomName}</span>
        </div>
      )}
      <div className={styles.controls}>
        <CustomSelect
          label="Sort by:"
          options={sortOptions}
          value={sortOption}
          onChange={(value) => onSortChange(value as SortOption)}
        />
        <Button
          variant={"light"}
          onClick={onToggleFilter}
          className={styles.filterButton}
        >
          {showCategoryFilter ? "Hide Filters" : "Filter by Category"}
        </Button>
      </div>
    </div>
  );
};


type ActiveFiltersProps = {
  selectedCategory: string;
  onReset: () => void;
}

const ActiveFilters = ({ selectedCategory, onReset }: ActiveFiltersProps) => {
  if (selectedCategory === 'all') {
    return null;
  }

  return (
    <div className={styles.activeFilters}>
      <div className={styles.activeFilterTag}>
        <span className={styles.filterLabel}>Category:</span>
        <span className={styles.filterValue}>{selectedCategory}</span>
        <button className={styles.removeFilter} onClick={onReset}>
          ×
        </button>
      </div>
    </div>
  );
};


type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
  onClose: () => void;
}

const CategoryFilter = ({ categories, selectedCategory, onSelect, onClose }: CategoryFilterProps) => {
  return (
    <div className={styles.categoryFilterPanel}>
      <div className={styles.categoryFilterHeader}>
        <h3 className={styles.categoryFilterTitle}>Filter by Category</h3>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      <div className={styles.categoryFilterGrid}>
        <button
          className={`${styles.categoryOption} ${selectedCategory === 'all' ? styles.selected : ''}`}
          onClick={() => onSelect('all')}
        >
          All Posts
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`${styles.categoryOption} ${selectedCategory === category ? styles.selected : ''}`}
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
