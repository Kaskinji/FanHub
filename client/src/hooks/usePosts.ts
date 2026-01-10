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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const postsRef = useRef<Post[]>([]);

  // Сохраняем оригинальный список постов в ref для использования в других хуках
  // (sortedPosts используется только для отображения)
  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

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

      setPosts(fullPosts);
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
          setPosts((prev) =>
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
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updates } : p))
    );
  }, []);

  const removePost = useCallback((postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const setSort = useCallback((option: SortOption) => {
    setSortOption(option);
  }, []);

  return {
    posts: sortedPosts, // Возвращаем отсортированные посты
    loading,
    error,
    sortOption,
    loadPosts,
    refreshPost,
    updatePost,
    removePost,
    postsRef,
    setSort,
  };
};
