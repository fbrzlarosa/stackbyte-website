"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Button from "./Button";
import Logo from "./Logo";

function DevToIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-book-open"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

const navLinks = [
  { name: "My Story", href: "#about" },
  { name: "How I Work", href: "#process" },
  { name: "Expertise", href: "#services" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <>
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          mass: 0.5,
        }}
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
          isScrolled
            ? "bg-black/30 backdrop-blur-md h-14 sm:h-16 shadow-lg"
            : "bg-black/0 backdrop-blur-sm h-20 sm:h-24"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link
            href="/"
            className="block w-24 sm:w-32 hover:opacity-80 transition-opacity relative z-50 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Logo className="w-full h-auto" />
          </Link>

          {/* Desktop Menu - Minimal & Modern */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors relative group cursor-pointer ${
                  isScrolled
                    ? "text-gray-300 hover:text-white"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            <div className="w-px h-6 bg-white/10 mx-2" />

            <Button href="#contact" variant="gradient" size="sm">
              Let&apos;s Talk
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white relative z-50 p-2 cursor-pointer focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <motion.div
              animate={mobileMenuOpen ? "open" : "closed"}
              className="w-6 h-6 flex flex-col justify-center items-center gap-1.5"
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 6 },
                }}
                className="w-full h-0.5 bg-white block origin-center"
              />
              <motion.span
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 },
                }}
                className="w-full h-0.5 bg-white block"
              />
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -10 }, // Adjusted y for gap-1.5 (6px) + height
                }}
                className="w-full h-0.5 bg-white block origin-center"
              />
            </motion.div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Fullscreen Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            animate={{
              opacity: 1,
              clipPath: "circle(150% at 100% 0%)",
              transition: {
                type: "spring",
                stiffness: 30,
                damping: 15,
                duration: 0.5,
              },
            }}
            exit={{
              opacity: 0,
              clipPath: "circle(0% at 100% 0%)",
              transition: {
                type: "spring",
                stiffness: 30,
                damping: 15,
                duration: 0.5,
                delay: 0.2, // Wait for content to exit
              },
            }}
            className="fixed inset-0 z-40 bg-[#0D1117]/95 backdrop-blur-xl flex items-center justify-center"
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                },
                closed: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 },
                },
              }}
              className="flex flex-col items-center gap-8 text-center"
            >
              {navLinks.map((item) => (
                <motion.div
                  key={item.name}
                  variants={{
                    open: { y: 0, opacity: 1 },
                    closed: { y: 20, opacity: 0 },
                  }}
                >
                  <Link
                    href={item.href}
                    className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400 hover:to-primary transition-all cursor-pointer tracking-tight"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={{
                  open: { y: 0, opacity: 1 },
                  closed: { y: 20, opacity: 0 },
                }}
                className="flex gap-8 mt-8"
              >
                <a
                  href={process.env.NEXT_PUBLIC_SOCIAL_GITHUB || "#"}
                  target="_blank"
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors transform hover:scale-110"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "#"}
                  target="_blank"
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors transform hover:scale-110"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_SOCIAL_DEVTO || "#"}
                  target="_blank"
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors transform hover:scale-110"
                >
                  <DevToIcon />
                </a>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    const element = document.getElementById("contact");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors transform hover:scale-110"
                >
                  <Mail className="w-6 h-6" />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
