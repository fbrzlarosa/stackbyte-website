"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, ExternalLink, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

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
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const readMoreRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        rotateX: rotation.rotateX,
        rotateY: rotation.rotateY,
        rotateZ: rotation.rotateZ,
      });

      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top bottom-=50px",
        onEnter: () => {
          gsap.to(cardRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: isMobile ? 0 : rotation.rotateX * 0.3,
            rotateY: isMobile ? 0 : rotation.rotateY * 0.3,
            rotateZ: isMobile ? 0 : rotation.rotateZ * 0.3,
            duration: 0.5,
            delay: staggerDelay,
            ease: "power2.out",
          });
        },
      });

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.1, opacity: 0.8 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            delay: staggerDelay + 0.1,
            scrollTrigger: {
              trigger: imageRef.current,
              start: "top bottom-=50px",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            delay: staggerDelay + 0.2,
            scrollTrigger: {
              trigger: badgeRef.current,
              start: "top bottom-=50px",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            delay: staggerDelay + 0.15,
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top bottom-=50px",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            delay: staggerDelay + 0.2,
            scrollTrigger: {
              trigger: descRef.current,
              start: "top bottom-=50px",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (metaRef.current) {
        gsap.fromTo(
          metaRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.4,
            delay: staggerDelay + 0.25,
            scrollTrigger: {
              trigger: metaRef.current,
              start: "top bottom-=50px",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (tagsRef.current) {
        gsap.fromTo(
          tagsRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.4,
            delay: staggerDelay + 0.3,
            scrollTrigger: {
              trigger: tagsRef.current,
              start: "top bottom-=50px",
              toggleActions: "play none none none",
            },
          }
        );

        const tags = tagsRef.current.querySelectorAll("[data-tag]");
        tags.forEach((tag, i) => {
          gsap.fromTo(
            tag,
            { opacity: 0, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.3,
              delay: staggerDelay + 0.35 + i * 0.05,
              scrollTrigger: {
                trigger: tag,
                start: "top bottom-=50px",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }

      if (readMoreRef.current) {
        gsap.fromTo(
          readMoreRef.current,
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            delay: staggerDelay + 0.4,
            scrollTrigger: {
              trigger: readMoreRef.current,
              start: "top bottom-=50px",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, cardRef);

    return () => ctx.revert();
  }, [index, isMobile, staggerDelay, rotation]);

  return (
    <div
      ref={cardRef}
      className="relative w-full max-w-md mx-auto"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group bg-[#0D1117] border border-white/10 rounded-2xl overflow-hidden md:backdrop-blur-sm hover:border-primary/50 transition-all duration-300 block cursor-pointer w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {post.image && (
          <div className="relative h-48 overflow-hidden pointer-events-none">
            <img
              ref={imageRef}
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] to-transparent pointer-events-none" />
            <div
              ref={badgeRef}
              className="absolute top-4 left-4 pointer-events-none"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 md:backdrop-blur-sm border border-white/20 text-white text-xs font-bold">
                <TrendingUp className="w-3 h-3" />
                dev.to
              </div>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 relative pointer-events-none">
          <h3
            ref={titleRef}
            className="text-xl sm:text-2xl font-black mb-3 text-white leading-tight"
          >
            {post.title}
          </h3>

          <p
            ref={descRef}
            className="text-gray-400 text-sm sm:text-base mb-6 line-clamp-3"
          >
            {post.description}
          </p>

          <div
            ref={metaRef}
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
          </div>

          {post.tags && post.tags.length > 0 && (
            <div ref={tagsRef} className="flex flex-wrap gap-2 mb-6">
              {post.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  data-tag
                  className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div
            ref={readMoreRef}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-primary group-hover:text-secondary-light transition-colors"
          >
            Read Article
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </div>
        </div>

        <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 rounded-2xl transition-all duration-500 pointer-events-none" />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-2xl transition-all duration-500 pointer-events-none" />
      </a>
    </div>
  );
}

interface DevToPostsProps {
  posts: DevToPost[];
}

export default function DevToPosts({ posts }: DevToPostsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top bottom-=100px",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (h2Ref.current) {
        gsap.fromTo(
          h2Ref.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.1,
            scrollTrigger: {
              trigger: h2Ref.current,
              start: "top bottom-=100px",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (pRef.current) {
        gsap.fromTo(
          pRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.2,
            scrollTrigger: {
              trigger: pRef.current,
              start: "top bottom-=100px",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
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
        <div ref={headerRef} className="text-center mb-16 sm:mb-24">
          <h2
            ref={h2Ref}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-relaxed font-black sm:mb-6 gradient-animated-text"
          >
            My Posts
          </h2>
          <p
            ref={pRef}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mt-4"
          >
            Tutorials, tips, and insights on tech and productivity
          </p>
        </div>

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
