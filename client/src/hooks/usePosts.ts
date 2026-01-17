import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { Post } from "../types/Post";
import { postApi } from "../api/PostApi";

export type SortOption = 'default' | 'reactions-desc' | 'reactions-asc';

interface UsePostsParams {
  fandomId?: number;
}


export const usePosts = ({ fandomId }: UsePostsParams) => {
  const [allPosts, setAllPosts] = useState<Post[]>([]); 
  const [posts, setPosts] = useState<Post[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const postsRef = useRef<Post[]>([]);

  
  const categories = useMemo(() => 
    Array.from(new Set(allPosts.map(post => post.category).filter(Boolean))).sort(),
    [allPosts]
  );

  
  const filteredPosts = useMemo(() => {
    let filtered = [...allPosts];
    
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    return filtered;
  }, [allPosts, selectedCategory]);

  
  useEffect(() => {
    setPosts(filteredPosts);
  }, [filteredPosts]);

  
  
  useEffect(() => {
    postsRef.current = allPosts;
  }, [allPosts]);

  
  const sortedPosts = useMemo(() => {
    if (sortOption === 'default') {
      return posts;
    }
    
    const sorted = [...posts];
    sorted.sort((a, b) => {
      
      const totalReactionsA = a.reactions.reduce((sum, reaction) => sum + reaction.count, 0);
      
      const totalReactionsB = b.reactions.reduce((sum, reaction) => sum + reaction.count, 0);
      
      if (sortOption === 'reactions-asc') {
        return totalReactionsA - totalReactionsB; 
      } else {
        return totalReactionsB - totalReactionsA; 
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

      
      const postsStatsDto = await postApi.getPopularPostsByFandom(fandomId);
      
      
      const fullPosts = await postApi.adaptStatsDtosToFullPosts(postsStatsDto);

      setAllPosts(fullPosts); 
      
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
        
        const postStatsDto = await postApi.getPostWithStatsById(postId);
        
        
        const updatedPost = await postApi.adaptStatsDtoToFullPost(postStatsDto);

        if (updatedPost) {
          setAllPosts((prev) =>
            prev.map((p) => (p.id === postId ? updatedPost : p))
          );

          return updatedPost;
        }
      } catch {
        
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
    
  }, []);

  const toggleCategoryFilter = useCallback(() => {
    setShowCategoryFilter(prev => !prev);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedCategory('all');
    setShowCategoryFilter(false);
    
  }, []);

  return {
    posts: sortedPosts, 
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
