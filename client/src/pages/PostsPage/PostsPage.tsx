import { usePostsPage } from "./usePostsPage";
import { PostsPageView } from "./PostsPage.view";

const PostsPage = () => {
  const state = usePostsPage();
  return <PostsPageView {...state} />;
};

export default PostsPage;
