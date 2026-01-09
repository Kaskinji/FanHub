import { useState, useEffect, useRef, useCallback } from "react";
import type { Post } from "../types/Post";
import { postApi } from "../api/PostApi";

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
  const postsRef = useRef<Post[]>([]);

  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

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

  return {
    posts,
    loading,
    error,
    loadPosts,
    refreshPost,
    updatePost,
    removePost,
    postsRef,
  };
};
