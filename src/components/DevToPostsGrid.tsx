"use client";

import { useEffect, useState } from "react";
import PostCard, { DevToPost } from "./PostCard";

interface DevToPostsGridProps {
  posts: DevToPost[];
}

export default function DevToPostsGrid({ posts }: DevToPostsGridProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 relative z-10">
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          index={index}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}
