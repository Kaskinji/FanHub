// app/posts/PostsPage.tsx
import { useState } from "react";
import Header from "../../components/Header/Header";
import PostPreview from "../../components/Post/PostPreview/PostPreview";
import PostFull from "../../components/Post/PostFull/PostFull";
import styles from "./PostsPage.module.scss";
import type { Post, Comment as CommentType } from "../../types/Post";

// Mock данные
const mockPosts: Post[] = [
  {
    id: 1,
    title: "Скрытый корабль у берегов Арда Скеллиг",
    content: "Полное описание того, как найти скрытый корабль...",
    excerpt: "Мы нашли скрытый корабль, который не отмечен на картах...",
    image: "/images/ship-found.jpg",
    author: {
      id: 101,
      username: "GeraltOfRivia",
      avatar: "/images/geralt-avatar.jpg"
    },
    reactions: [
      { type: 'like', count: 42, userReacted: false },
      { type: 'fire', count: 15, userReacted: true }
    ],
    category: "Гайды",
    tags: ["скеллиге", "корабли", "тайны"],
    createdAt: "2024-01-15T10:30:00Z",
    commentCount: 23
  },
  // ... больше постов
];

const mockComments: CommentType[] = [
  {
    id: 1,
    content: "Отличный гайд, спасибо!",
    author: {
      id: 102,
      username: "Yennefer",
      avatar: "/images/yennefer-avatar.jpg"
    },
    createdAt: "2024-01-15T12:30:00Z",
    reactions: [{ type: 'like', count: 5 }]
  },
  // ... больше комментариев
];

export default function PostsPage() {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isAddingComment, setIsAddingComment] = useState(false);

  const selectedPost = mockPosts.find(post => post.id === selectedPostId);

  const handleAddComment = async (content: string) => {
    setIsAddingComment(true);
    // API call здесь
    await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация
    console.log("Adding comment:", content);
    setIsAddingComment(false);
  };

  return (
    <div className={styles.page}>
      <Header onSearch={() => {}} onSignIn={() => {}} />
      
      <main className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Посты сообщества</h1>
          <button className={styles.createButton}>Создать пост</button>
        </div>
        
        <div className={styles.postsGrid}>
          {mockPosts.map((post) => (
            <PostPreview
              key={post.id}
              post={post}
              onClick={setSelectedPostId}
            />
          ))}
        </div>
      </main>
      
      {/* Модалка с полным постом */}
      {selectedPost && (
        <PostFull
          post={selectedPost}
          comments={mockComments}
          onClose={() => setSelectedPostId(null)}
          onAddComment={handleAddComment}
          isAddingComment={isAddingComment}
        />
      )}
    </div>
  );
}