"use client";

import { motion } from "framer-motion";
import { Calendar, ExternalLink, TrendingUp } from "lucide-react";
import { useRef } from "react";

interface DevToPost {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  readTime?: number;
  reactions?: number;
  tags?: string[];
}

interface PostCardProps {
  post: DevToPost;
  index: number;
  isMobile: boolean;
}

function PostCard({ post, index, isMobile }: PostCardProps) {
  const staggerDelay = index * 0.08;

  const getRandomRotation = () => {
    const rotations = [
      { rotateX: -8, rotateY: 12, rotateZ: -3 },
      { rotateX: 6, rotateY: -10, rotateZ: 4 },
      { rotateX: -5, rotateY: 8, rotateZ: -2 },
      { rotateX: 10, rotateY: -6, rotateZ: 3 },
      { rotateX: -7, rotateY: -9, rotateZ: -4 },
      { rotateX: 5, rotateY: 11, rotateZ: 2 },
    ];
    return rotations[index % rotations.length];
  };

  const rotation = isMobile
    ? { rotateX: 0, rotateY: 0, rotateZ: 0 }
    : getRandomRotation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.95,
        ...rotation,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: isMobile ? 0 : rotation.rotateX * 0.3,
        rotateY: isMobile ? 0 : rotation.rotateY * 0.3,
        rotateZ: isMobile ? 0 : rotation.rotateZ * 0.3,
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: staggerDelay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <motion.a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group bg-[#0D1117] border border-white/10 rounded-2xl overflow-hidden md:backdrop-blur-sm hover:border-primary/50 transition-all duration-300 block cursor-pointer w-full h-full"
        whileHover={
          isMobile
            ? { scale: 1.01 }
            : {
                scale: 1.03,
                y: -8,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
              }
        }
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {post.image && (
          <div className="relative h-48 overflow-hidden pointer-events-none">
            <motion.img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover pointer-events-none"
              initial={{ scale: 1.1, opacity: 0.8 }}
              whileInView={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{
                duration: 0.6,
                delay: staggerDelay + 0.1,
                ease: "easeOut",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] to-transparent pointer-events-none" />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: staggerDelay + 0.2, duration: 0.3 }}
              className="absolute top-4 left-4 pointer-events-none"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 md:backdrop-blur-sm border border-white/20 text-white text-xs font-bold">
                <TrendingUp className="w-3 h-3" />
                dev.to
              </div>
            </motion.div>
          </div>
        )}

        <div className="p-6 sm:p-8 relative pointer-events-none">
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: staggerDelay + 0.15, duration: 0.4 }}
            className="text-xl sm:text-2xl font-black mb-3 text-white leading-tight"
          >
            {post.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: staggerDelay + 0.2, duration: 0.4 }}
            className="text-gray-400 text-sm sm:text-base mb-6 line-clamp-3"
          >
            {post.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: staggerDelay + 0.25, duration: 0.4 }}
            className="flex flex-wrap items-center gap-3 mb-6 text-xs sm:text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            {post.readTime && (
              <>
                <span className="text-white/20">•</span>
                <span>{post.readTime} min read</span>
              </>
            )}
          </motion.div>

          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: staggerDelay + 0.3, duration: 0.4 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {post.tags.slice(0, 3).map((tag, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: staggerDelay + 0.35 + i * 0.05 }}
                  className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ delay: staggerDelay + 0.4, duration: 0.4 }}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-primary group-hover:text-secondary-light transition-colors"
          >
            Read Article
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 rounded-2xl transition-all duration-500 pointer-events-none"
          whileHover={{ opacity: 1 }}
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-2xl transition-all duration-500 pointer-events-none" />
      </motion.a>
    </motion.div>
  );
}

interface DevToPostsProps {
  posts: DevToPost[];
}

export default function DevToPosts({ posts }: DevToPostsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-24 sm:py-32"
      id="posts"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16 sm:mb-24"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-relaxed font-black sm:mb-6 gradient-animated-text"
          >
            My Posts
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mt-4"
          >
            Tutorials, tips, and insights on tech and productivity
          </motion.p>
        </motion.div>

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
      </div>
    </section>
  );
}
