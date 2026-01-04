import type { FandomPageData } from "../../../types/FandomPageData";
import { PostCard } from "../PostCard/PostCard";
import styles from "./Posts.module.scss";

interface PostsProps {
  posts: FandomPageData["postsPreviews"];
}

export function Posts({ posts }: PostsProps) {
  return (
    <section className={styles.posts}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          title={post.title}
          image={post.image}
          author={post.author}
          reactions={post.reactions}
        />
      ))}
    </section>
  );
}

export default Posts;

