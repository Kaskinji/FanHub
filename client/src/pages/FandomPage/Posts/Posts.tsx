import type { FandomPageData } from "../../../types/FandomPageData";
import { PostCard } from "../PostCard/PostCard";
import styles from "./Posts.module.scss";

interface PostsProps {
  posts: FandomPageData["postsPreviews"];
  fandomId?: number;
  fandomName?: string;
}

export function Posts({ posts, fandomId, fandomName }: PostsProps) {
  if(posts.length === 0)
  {
    return(
      <p>No posts found.</p>
    );
  }
  return (
    <section className={styles.posts}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          image={post.image}
          author={post.author}
          reactions={post.reactions}
          fandomId={fandomId}
          fandomName={fandomName}
        />
      ))}
    </section>
  );
}

export default Posts;

