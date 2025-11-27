"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Code, ExternalLink, Github, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import Logo from "./Logo";

const openSourceLibraries = [
  {
    name: "Next.js",
    description: "React framework for production",
    url: "https://nextjs.org",
    category: "Framework",
  },
  {
    name: "React",
    description: "JavaScript library for building user interfaces",
    url: "https://react.dev",
    category: "Library",
  },
  {
    name: "Framer Motion",
    description: "Production-ready motion library for React",
    url: "https://www.framer.com/motion",
    category: "Animation",
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework",
    url: "https://tailwindcss.com",
    category: "Styling",
  },
  {
    name: "TypeScript",
    description: "Typed JavaScript at any scale",
    url: "https://www.typescriptlang.org",
    category: "Language",
  },
  {
    name: "Axios",
    description: "Promise-based HTTP client",
    url: "https://axios-http.com",
    category: "HTTP",
  },
  {
    name: "React Hook Form",
    description: "Performant forms with easy validation",
    url: "https://react-hook-form.com",
    category: "Forms",
  },
  {
    name: "Lucide React",
    description: "Beautiful & consistent icon toolkit",
    url: "https://lucide.dev",
    category: "Icons",
  },
  {
    name: "Lenis",
    description: "Smooth scroll library",
    url: "https://lenis.studiofreight.com",
    category: "Scroll",
  },
  {
    name: "React Turnstile",
    description: "Cloudflare Turnstile for React",
    url: "https://github.com/marsidev/react-turnstile",
    category: "Security",
  },
];

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <footer className="pt-12 pb-20 sm:py-16 md:py-20 bg-gradient-to-b from-[#0D1117] to-[#161B22] relative overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)",
        }}
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[120px] -z-10"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-500/15 rounded-full blur-[100px] -z-10"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="col-span-2 md:col-span-2">
            <Link
              href="/"
              className="mb-4 sm:mb-6 block w-32 sm:w-44 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Logo className="w-full h-auto" />
            </Link>
            <p className="text-sm sm:text-base text-gray-400 max-w-sm">
              Crafting efficient, scalable, and elegant solutions in software &
              web. Based in Lucca, IT.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-white text-sm sm:text-base">
              Explore
            </h4>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-400">
              <li>
                <Link
                  href="#about"
                  className="relative group hover:text-primary transition-colors cursor-pointer inline-block"
                >
                  My Story
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link
                  href="#process"
                  className="relative group hover:text-primary transition-colors cursor-pointer inline-block"
                >
                  How I Work
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="relative group hover:text-primary transition-colors cursor-pointer inline-block"
                >
                  Expertise
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-white text-sm sm:text-base">
              Connect
            </h4>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-400">
              <li>
                <Link
                  href="#contact"
                  className="relative group hover:text-primary transition-colors cursor-pointer inline-block"
                >
                  Contact
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_SOCIAL_GITHUB || "#"}
                  target="_blank"
                  className="relative group hover:text-primary transition-colors cursor-pointer inline-block"
                >
                  GitHub
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "#"}
                  target="_blank"
                  className="relative group hover:text-primary transition-colors cursor-pointer inline-block"
                >
                  LinkedIn
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_SOCIAL_DEVTO || "#"}
                  target="_blank"
                  className="relative group hover:text-primary transition-colors cursor-pointer inline-block"
                >
                  Dev.to
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-8 border-t border-white/10 text-xs sm:text-sm text-gray-500 gap-6">
          <p className="text-left">
            © 2025 Fabrizio La Rosa. All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 text-xs font-medium bg-linear-to-r from-primary/20 via-purple-500/20 to-primary/20 px-4 py-2 rounded-full border border-primary/30 hover:border-primary/50 transition-all hover:scale-105 cursor-pointer group"
            >
              <Code className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
              <span className="bg-linear-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent animate-gradient bg-size-[200%_auto] font-bold">
                Open Source
              </span>
            </button>

            <div className="flex items-center gap-2 text-xs font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-colors">
              <span className="text-gray-400">100%</span>
              <span className="bg-linear-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient bg-size-[200%_auto] font-bold">
                Prompt Engineered
              </span>
              <Sparkles className="w-3 h-3 text-pink-500 animate-pulse" />
            </div>

            <a
              href={`https://www.iubenda.com/privacy-policy/${
                process.env.NEXT_PUBLIC_IUBENDA_POLICY_ID || ""
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group hover:text-primary transition-colors cursor-pointer inline-block"
            >
              Privacy Policy
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </a>
          </div>
        </div>
      </div>

      {/* Open Source Modal */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-4xl max-h-[90vh] bg-[#0D1117] border border-primary/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                  <motion.div
                    className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.2,
                      ease: "easeOut",
                    }}
                  />

                  {/* Content */}
                  <div
                    className="relative z-10 p-6 sm:p-8 md:p-12 overflow-y-auto flex-1 custom-scrollbar"
                    data-lenis-prevent
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-3xl sm:text-4xl font-black mb-2 bg-linear-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">
                          Open Source
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base">
                          Built with amazing open source technologies
                        </p>
                      </div>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 transition-all cursor-pointer group"
                      >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                      </button>
                    </div>

                    {/* Open Source Project */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mb-6 p-6 rounded-2xl bg-linear-to-r from-primary/10 via-purple-500/10 to-primary/10 border border-primary/20 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black/30 flex items-center justify-center border border-primary/30">
                          <Github className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">
                            Open Source Project
                          </h3>
                          <p className="text-sm text-gray-400 mb-3">
                            This website is open source and available on my
                            GitHub. Feel free to explore, contribute, or fork
                            it!
                          </p>
                          <a
                            href={
                              process.env.NEXT_PUBLIC_SOCIAL_GITHUB ||
                              "https://github.com"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:text-purple-400 transition-colors cursor-pointer group"
                          >
                            View My Repositories
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </a>
                        </div>
                      </div>
                    </motion.div>

                    {/* Vercel Deployment */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="mb-8 p-6 rounded-2xl bg-linear-to-r from-primary/10 via-purple-500/10 to-primary/10 border border-primary/20 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black/30 flex items-center justify-center border border-primary/30">
                          <svg
                            className="w-8 h-8"
                            viewBox="0 0 76 65"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M37.5274 0L75.0548 65H0L37.5274 0Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">
                            Deployed on Vercel
                          </h3>
                          <p className="text-sm text-gray-400 mb-3">
                            This website is hosted on Vercel&apos;s edge network
                            for optimal performance
                          </p>
                          <a
                            href="https://vercel.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:text-purple-400 transition-colors cursor-pointer group"
                          >
                            Visit Vercel
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </a>
                        </div>
                      </div>
                    </motion.div>

                    {/* Libraries Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {openSourceLibraries.map((lib, index) => (
                        <motion.a
                          key={lib.name}
                          href={lib.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                {lib.name}
                              </h4>
                              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                            </div>
                            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">
                              {lib.category}
                            </p>
                            <p className="text-sm text-gray-400">
                              {lib.description}
                            </p>
                          </div>
                        </motion.a>
                      ))}
                    </div>

                    {/* Footer Note */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8 pt-6 border-t border-white/10 text-center"
                    >
                      <p className="text-xs text-gray-500">
                        Made with ❤️ using open source technologies
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </footer>
  );
}
