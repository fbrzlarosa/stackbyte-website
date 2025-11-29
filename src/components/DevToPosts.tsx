"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, ExternalLink, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  containerRef: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
}

function PostCard({ post, index, containerRef, isMobile }: PostCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const cardProgress = useTransform(
    scrollYProgress,
    [index * 0.15, index * 0.15 + 0.3],
    [0, 1]
  );

  const staggerDelay = index * 0.1;

  const opacity = useTransform(cardProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8]);

  const y = useTransform(
    cardProgress,
    [0, 0.5, 1],
    isMobile ? [100, 0, -50] : [200, 0, -100]
  );

  const rotateX = useTransform(
    cardProgress,
    [0, 0.5, 1],
    isMobile ? [0, 0, 0] : [15, 0, -10]
  );

  const rotateY = useTransform(
    cardProgress,
    [0, 0.5, 1],
    isMobile
      ? [0, 0, 0]
      : [index % 2 === 0 ? -20 : 20, 0, index % 2 === 0 ? 10 : -10]
  );

  const rotateZ = useTransform(
    cardProgress,
    [0, 0.5, 1],
    isMobile
      ? [0, 0, 0]
      : [index % 3 === 0 ? -5 : index % 3 === 1 ? 5 : 0, 0, 0]
  );

  const scale = useTransform(
    cardProgress,
    [0, 0.3, 0.7, 1],
    isMobile ? [0.8, 1, 1, 0.95] : [0.7, 1.05, 1, 0.9]
  );

  const translateZ = useTransform(
    cardProgress,
    [0, 0.5, 1],
    isMobile ? [0, 0, 0] : [-200, 0, 100]
  );

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
      ref={cardRef}
      className="relative w-full max-w-md mx-auto"
      style={{
        opacity,
        y,
        rotateX,
        rotateY,
        rotateZ,
        scale,
        translateZ,
        transformStyle: "preserve-3d",
        zIndex: index === 2 ? 10 : 1,
      }}
    >
      <motion.a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group bg-[#0D1117] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-primary/50 transition-all duration-500 block cursor-pointer w-full h-full"
        whileHover={
          isMobile
            ? {}
            : {
                scale: 1.02,
                rotateY: index % 2 === 0 ? 2 : -2,
                rotateX: 2,
                z: 50,
              }
        }
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {post.image && (
          <div className="relative h-48 overflow-hidden pointer-events-none">
            <motion.img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover pointer-events-none"
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: staggerDelay }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] to-transparent pointer-events-none" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: staggerDelay + 0.2 }}
              className="absolute top-4 left-4 pointer-events-none"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white text-xs font-bold">
                <TrendingUp className="w-3 h-3" />
                dev.to
              </div>
            </motion.div>
          </div>
        )}

        <div className="p-6 sm:p-8 relative pointer-events-none">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: staggerDelay + 0.1 }}
            className="text-xl sm:text-2xl font-black mb-3 text-white leading-tight"
          >
            {post.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: staggerDelay + 0.2 }}
            className="text-gray-400 text-sm sm:text-base mb-6 line-clamp-3"
          >
            {post.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: staggerDelay + 0.3 }}
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: staggerDelay + 0.4 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {post.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: staggerDelay + 0.5 }}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-primary group-hover:text-secondary-light transition-colors"
          >
            Read Article
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.div>
        </div>

        <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 rounded-2xl transition-all duration-500 pointer-events-none" />
      </motion.a>
    </motion.div>
  );
}

interface DevToPostsProps {
  posts: DevToPost[];
}

export default function DevToPosts({ posts }: DevToPostsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24"
        >
          <motion.h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-relaxed font-black sm:mb-6 gradient-animated-text">
            My Posts
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Tutorials, tips, and insights on tech and productivity
          </motion.p>
        </motion.div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]"
            animate={{
              x: [0, 80, 0],
              y: [0, -30, 0],
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-secondary/15 rounded-full blur-[100px]"
            animate={{
              x: [0, -60, 0],
              y: [0, 40, 0],
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px]"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </div>

        <div
          className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 relative z-10"
          style={{ isolation: "isolate" }}
        >
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              containerRef={containerRef}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
