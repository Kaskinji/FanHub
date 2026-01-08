// app/posts/PostsPage.tsx
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import Header from "../../components/Header/Header";
import PostPreview from "../../components/Post/PostPreview/PostPreview";
import PostFull from "../../components/Post/PostFull/PostFull";
import PostForm from "./PostForm/PostForm";
import SectionTitle from "../../components/UI/SectionTitle/SectionTitle";
import { AddButton } from "../../components/UI/buttons/AddButton/AddButton";
import styles from "./PostsPage.module.scss";
import type { Post, Comment as CommentType } from "../../types/Post";
import type { PostsContextData } from "../../types/Post";
import { postApi } from "../../api/PostApi";
import { commentApi } from "../../api/CommentApi";
import ErrorState from "../../components/ErrorState/ErrorState";
import { reactionApi, type ReactionType, ReactionTypeToNumber, ReactionTypeMap } from "../../api/ReactionApi";
import { useAuth } from "../../hooks/useAuth";

export default function PostsPage() {
  const location = useLocation();
  const postsData = location.state as PostsContextData;
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedPostComments, setSelectedPostComments] = useState<CommentType[]>([]);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const postsRef = useRef<Post[]>([]);
  
  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  const countAllComments = (commentList: CommentType[]): number => {
    return commentList.reduce((count, comment) => {
      return count + 1 + (comment.replies ? countAllComments(comment.replies) : 0);
    }, 0);
  };

  const getPostReactions = useCallback(async (
    postId: number,
    currentUserId?: number
  ): Promise<Array<{ type: ReactionType; count: number; userReacted: boolean }>> => {
    try {
      const userId = isAuthenticated 
        ? (currentUserId || Number(localStorage.getItem('user_id')) || undefined)
        : undefined;
      
      const postReactions = await reactionApi.getPostReactions(postId);
      
      const reactionCounts: Partial<Record<ReactionType, { count: number; userReacted: boolean }>> = {
        like: { count: 0, userReacted: false },
        dislike: { count: 0, userReacted: false }
      };

      postReactions.forEach((reaction) => {
        const type = ReactionTypeMap[reaction.type];
        if (type && reactionCounts[type]) {
          reactionCounts[type].count++;
          if (userId && reaction.userId === userId) {
            reactionCounts[type].userReacted = true;
          }
        }
      });

      const result: Array<{ type: ReactionType; count: number; userReacted: boolean }> = [];
      
      result.push({
        type: 'like' as ReactionType,
        count: reactionCounts.like?.count ?? 0,
        userReacted: reactionCounts.like?.userReacted ?? false,
      });
      result.push({
        type: 'dislike' as ReactionType,
        count: reactionCounts.dislike?.count ?? 0,
        userReacted: reactionCounts.dislike?.userReacted ?? false,
      });

      return result;
    } catch (error) {
      return [
        { type: 'like' as ReactionType, count: 0, userReacted: false },
        { type: 'dislike' as ReactionType, count: 0, userReacted: false },
      ];
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const loadPosts = async () => {
      if (!postsData?.fandomId) {
        setError("Fandom ID is not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Загружаем посты по фандому
        const postsDto = await postApi.getPopularPostsByFandom(postsData.fandomId);
        
        // Преобразуем в полный формат Post
        const fullPosts = await postApi.adaptToFullPosts(postsDto);
        
        // Загружаем количество комментариев и реакции для каждого поста параллельно
        const postsWithComments = await Promise.all(
          fullPosts.map(async (post) => {
            try {
              // Параллельно загружаем комментарии и реакции
              const [commentsDto, reactions] = await Promise.all([
                commentApi.getCommentsByPostId(post.id),
                getPostReactions(post.id),
              ]);
              
              const comments = commentApi.adaptToComments(commentsDto);
              
              // Подсчитываем все комментарии, включая ответы
              const totalCommentsCount = countAllComments(comments);
              
              return {
                ...post,
                commentCount: totalCommentsCount,
                reactions: reactions,
              };
            } catch (err) {
              return {
                ...post,
                commentCount: 0,
                reactions: [
                  { type: 'like' as ReactionType, count: 0, userReacted: false },
                  { type: 'dislike' as ReactionType, count: 0, userReacted: false },
                ],
              };
            }
          })
        );
        
        setPosts(postsWithComments);
        
        if (postsData?.postId) {
          setTimeout(() => {
            setSelectedPostId(postsData.postId!);
          }, 100);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load posts"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [postsData?.fandomId, postsData?.postId, isAuthenticated, getPostReactions]);

  useEffect(() => {
    let isCancelled = false;

    const loadPostDetails = async () => {
      if (!selectedPostId) {
        setSelectedPost(null);
        setSelectedPostComments([]);
        return;
      }

      const post = postsRef.current.find((p) => p.id === selectedPostId);
      if (post) {
        if (!isCancelled) {
          setSelectedPost(post);
        }
      } else {
        try {
          const postDto = await postApi.getPostById(selectedPostId);
          const fullPost = await postApi.adaptToFullPost(postDto);
          if (fullPost && !isCancelled) {
            setSelectedPost(fullPost);
            setPosts((prev) => {
              if (!prev.find((p) => p.id === fullPost.id)) {
                return [...prev, fullPost];
              }
              return prev;
            });
          }
        } catch (err) {
          // Post loading failed silently
        }
      }

      if (!isCancelled) {
        try {
          setLoadingComments(true);
          const [commentsDto, reactions] = await Promise.all([
            commentApi.getCommentsByPostId(selectedPostId),
            getPostReactions(selectedPostId),
          ]);
          
          const comments = commentApi.adaptToComments(commentsDto);
          
          if (!isCancelled) {
            setSelectedPostComments(comments);
            
            setSelectedPost((currentPost) => {
              if (currentPost) {
                return {
                  ...currentPost,
                  commentCount: countAllComments(comments),
                  reactions: reactions,
                };
              }
              return currentPost;
            });
            
            setPosts((prev) =>
              prev.map((p) => {
                if (p.id === selectedPostId) {
                  return {
                    ...p,
                    commentCount: countAllComments(comments),
                    reactions: reactions || p.reactions,
                  };
                }
                return p;
              })
            );
          }
        } catch (err) {
          if (!isCancelled) {
            setSelectedPostComments([]);
          }
        } finally {
          if (!isCancelled) {
            setLoadingComments(false);
          }
        }
      }
    };

    loadPostDetails();

    return () => {
      isCancelled = true;
    };
  }, [selectedPostId, isAuthenticated, getPostReactions]);

  const handleReaction = async (postId: number, reactionType: "like" | "dislike") => {
    if (!isAuthenticated) return;
    
    try {
      const post = postsRef.current.find((p) => p.id === postId) || selectedPost;
      if (!post) return;

      const userId = Number(localStorage.getItem('user_id'));
      if (!userId) {
        return;
      }

      const postReactions = await reactionApi.getPostReactions(postId);
      const userReaction = postReactions.find(
        r => r.userId === userId
          ) || null;

      const reactionTypeNumber = ReactionTypeToNumber[reactionType];
          
          if (userReaction) {
        if (userReaction.type === reactionTypeNumber) {
          try {
            await reactionApi.removeReaction(userReaction.id);
          } catch (err) {
            return;
          }
        } else {
          try {
            await Promise.all([
              reactionApi.removeReaction(userReaction.id),
              reactionApi.addReaction(postId, reactionType)
            ]);
        } catch (err) {
          return; 
          }
        }
      } else {
        try {
          await reactionApi.addReaction(postId, reactionType);
        } catch (err) {
          return; 
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      const updatedPostDto = await postApi.getPostById(postId);
      const fullUpdatedPost = await postApi.adaptToFullPost(updatedPostDto);
      
      if (!fullUpdatedPost) {
        return;
      }

      const finalReactions = await getPostReactions(postId, userId);
      
      const finalUpdatedPost = {
        ...fullUpdatedPost,
        reactions: finalReactions,
        commentCount: post.commentCount,
      };
      
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? finalUpdatedPost : p))
      );
      
      if (selectedPostId === postId) {
        setSelectedPost(finalUpdatedPost);
      }
    } catch (err) {
      // Reaction handling failed silently
    }
  };

  const handleAddComment = async (content: string) => {
    if (!selectedPostId) return;
    
    setIsAddingComment(true);
    try {
      await commentApi.createComment({
        postId: selectedPostId,
        content: content,
      });
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const commentsDto = await commentApi.getCommentsByPostId(selectedPostId);
      const comments = commentApi.adaptToComments(commentsDto);
      const totalCommentsCount = countAllComments(comments);
      
      setSelectedPostComments(comments);
      
      setSelectedPost((prev) =>
        prev
          ? {
              ...prev,
              commentCount: totalCommentsCount,
            }
          : null
      );
      setPosts((prev) =>
        prev.map((p) =>
          p.id === selectedPostId
            ? { ...p, commentCount: totalCommentsCount }
            : p
        )
      );
    } catch (err) {
      // Comment creation failed silently
    } finally {
      setIsAddingComment(false);
    }
  };

  const loadPosts = async () => {
    if (!postsData?.fandomId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const postsDto = await postApi.getPopularPostsByFandom(postsData.fandomId);
      const fullPosts = await postApi.adaptToFullPosts(postsDto);
      
      const postsWithComments = await Promise.all(
        fullPosts.map(async (post) => {
          try {
            const [commentsDto, reactions] = await Promise.all([
              commentApi.getCommentsByPostId(post.id),
              getPostReactions(post.id),
            ]);
            
            const comments = commentApi.adaptToComments(commentsDto);
            const totalCommentsCount = countAllComments(comments);
            
            return {
              ...post,
              commentCount: totalCommentsCount,
              reactions: reactions,
            };
          } catch (err) {
            return {
              ...post,
              commentCount: 0,
              reactions: [
                { type: 'like' as ReactionType, count: 0, userReacted: false },
                { type: 'dislike' as ReactionType, count: 0, userReacted: false },
              ],
            };
          }
        })
      );
      
      setPosts(postsWithComments);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load posts"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePostSuccess = async (_postId: number) => {
    setShowPostForm(false);
    await loadPosts();
  };

  const handleEditPost = () => {
    if (!selectedPost || !isAuthenticated) return;
    
    const currentUserId = Number(localStorage.getItem('user_id'));
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
    
    try {
      const postDto = await postApi.getPostById(postId);
      const fullPost = await postApi.adaptToFullPost(postDto);
      
      if (fullPost) {
        const [commentsDto, reactions] = await Promise.all([
          commentApi.getCommentsByPostId(postId),
          getPostReactions(postId),
        ]);
        
        const comments = commentApi.adaptToComments(commentsDto);
        const totalCommentsCount = countAllComments(comments);
        
        const updatedPost = {
          ...fullPost,
          commentCount: totalCommentsCount,
          reactions: reactions,
        };
        
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? updatedPost : p))
        );
        
        if (selectedPostId === postId) {
          setSelectedPost(updatedPost);
        }
      }
    } catch (err) {
      await loadPosts();
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPost || !isAuthenticated) return;
    
    const currentUserId = Number(localStorage.getItem('user_id'));
    const isAuthor = currentUserId && selectedPost.author.id === currentUserId;
    
    if (!isAuthor) {
      return;
    }
    
    try {
      await postApi.deletePost(selectedPost.id);
      setPosts((prev) => prev.filter((p) => p.id !== selectedPost.id));
      setSelectedPostId(null);
      setSelectedPost(null);
    } catch (err) {
      // Delete failed, reload posts
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header onSearch={() => {}} onSignIn={() => {}} />
        <div className={styles.loading}>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

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
      
      <main className={styles.content}>
        {/* Информация о фандоме */}
        {postsData?.fandomName && (
          <div className={styles.fandomInfo}>
            <span className={styles.fandomLabel}>fandom: </span>
            <span className={styles.fandomName}>{postsData.fandomName}</span>
          </div>
        )}
        
        <div className={styles.sectionHeader}>
          <SectionTitle title="Posts" />
          {isAuthenticated && (
            <AddButton
              text="Add"
              onClick={() => setShowPostForm(true)}
            />
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
                onClick={setSelectedPostId}
                onReaction={handleReaction}
              />
            ))
          )}
        </div>
      </main>
      
      {selectedPost && (
        <PostFull
          post={selectedPost}
          comments={selectedPostComments}
          onClose={() => setSelectedPostId(null)}
          onAddComment={isAuthenticated ? handleAddComment : undefined}
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