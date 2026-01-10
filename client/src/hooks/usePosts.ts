import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { Post } from "../types/Post";
import { postApi } from "../api/PostApi";

export type SortOption = 'default' | 'reactions-desc' | 'reactions-asc';

interface UsePostsParams {
  fandomId?: number;
}

/**
 * Хук для загрузки и управления постами
 * Использует PostStatsDto, который уже включает количество комментариев и реакции
 */
export const usePosts = ({ fandomId }: UsePostsParams) => {
  const [allPosts, setAllPosts] = useState<Post[]>([]); // Исходный список всех постов
  const [posts, setPosts] = useState<Post[]>([]); // Отфильтрованные посты
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const postsRef = useRef<Post[]>([]);

  // Извлекаем уникальные категории из всех загруженных постов
  const categories = useMemo(() => 
    Array.from(new Set(allPosts.map(post => post.category).filter(Boolean))).sort(),
    [allPosts]
  );

  // Применяем фильтры локально к загруженным постам
  const filteredPosts = useMemo(() => {
    let filtered = [...allPosts];
    
    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    return filtered;
  }, [allPosts, selectedCategory]);

  // Обновляем posts когда изменяются фильтры
  useEffect(() => {
    setPosts(filteredPosts);
  }, [filteredPosts]);

  // Сохраняем оригинальный список всех постов в ref для использования в других хуках
  // (sortedPosts используется только для отображения)
  useEffect(() => {
    postsRef.current = allPosts;
  }, [allPosts]);

  // Сортируем посты перед отображением
  const sortedPosts = useMemo(() => {
    if (sortOption === 'default') {
      return posts;
    }
    
    const sorted = [...posts];
    sorted.sort((a, b) => {
      // Суммируем все реакции для поста a
      const totalReactionsA = a.reactions.reduce((sum, reaction) => sum + reaction.count, 0);
      // Суммируем все реакции для поста b
      const totalReactionsB = b.reactions.reduce((sum, reaction) => sum + reaction.count, 0);
      
      if (sortOption === 'reactions-asc') {
        return totalReactionsA - totalReactionsB; // От меньшего к большему
      } else {
        return totalReactionsB - totalReactionsA; // От большего к меньшему
      }
    });
    
    return sorted;
  }, [posts, sortOption]);

  const loadPosts = useCallback(async () => {
    if (!fandomId) {
      setError("Fandom ID is not provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Получаем посты со статистикой (уже включают комментарии и реакции)
      const postsStatsDto = await postApi.getPopularPostsByFandom(fandomId);
      
      // Преобразуем PostStatsDto в Post (уже включает commentCount и reactions)
      const fullPosts = await postApi.adaptStatsDtosToFullPosts(postsStatsDto);

      setAllPosts(fullPosts); // Сохраняем исходный список
      // Фильтры применятся автоматически через useMemo
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load posts"
      );
    } finally {
      setLoading(false);
    }
  }, [fandomId]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const refreshPost = useCallback(
    async (postId: number) => {
      try {
        // Получаем пост со статистикой (уже включает комментарии и реакции)
        const postStatsDto = await postApi.getPostWithStatsById(postId);
        
        // Преобразуем PostStatsDto в Post
        const updatedPost = await postApi.adaptStatsDtoToFullPost(postStatsDto);

        if (updatedPost) {
          setAllPosts((prev) =>
            prev.map((p) => (p.id === postId ? updatedPost : p))
          );

          return updatedPost;
        }
      } catch {
        // При ошибке перезагружаем все посты
        await loadPosts();
      }
      return null;
    },
    [loadPosts]
  );

  const updatePost = useCallback((postId: number, updates: Partial<Post>) => {
    setAllPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updates } : p))
    );
  }, []);

  const removePost = useCallback((postId: number) => {
    setAllPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const setSort = useCallback((option: SortOption) => {
    setSortOption(option);
  }, []);

  const filterByCategory = useCallback((category: string) => {
    setSelectedCategory(category);
    setShowCategoryFilter(false);
    // Фильтрация происходит автоматически через useMemo
  }, []);

  const toggleCategoryFilter = useCallback(() => {
    setShowCategoryFilter(prev => !prev);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedCategory('all');
    setShowCategoryFilter(false);
    // Фильтрация происходит автоматически через useMemo
  }, []);

  return {
    posts: sortedPosts, // Возвращаем отсортированные посты
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
  };
};
