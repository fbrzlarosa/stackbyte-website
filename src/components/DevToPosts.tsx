import DevToPostsGrid from "./DevToPostsGrid";
import DevToPostsHeader from "./DevToPostsHeader";
import { DevToPost } from "./PostCard";

interface DevToPostsProps {
  posts: DevToPost[];
}

export default function DevToPosts({ posts }: DevToPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="relative py-24 sm:py-32" id="posts">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DevToPostsHeader />
        <DevToPostsGrid posts={posts} />
      </div>
    </section>
  );
}
