"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Github, Linkedin, Mail, Menu, Twitter, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const navLinks = [
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
            ? "bg-black/30 backdrop-blur-md h-16 shadow-lg"
            : "bg-black/0 backdrop-blur-sm h-24"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link
            href="/"
            className="block w-32 hover:opacity-80 transition-opacity relative z-50"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Logo className="w-full h-auto" />
          </Link>

          {/* Desktop Menu - Minimal & Modern */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors relative group ${
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

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#contact"
                className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                Let&apos;s Talk
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white relative z-50 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Fullscreen Menu Overlay */}
      <motion.div
        initial={{ opacity: 0, pointerEvents: "none" }}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
        }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-8 text-center">
          {navLinks.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: mobileMenuOpen ? 0 : 20,
                opacity: mobileMenuOpen ? 1 : 0,
              }}
              transition={{ delay: i * 0.1 + 0.2 }}
            >
              <Link
                href={item.href}
                className="text-4xl font-bold text-white hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: mobileMenuOpen ? 0 : 20,
              opacity: mobileMenuOpen ? 1 : 0,
            }}
            transition={{ delay: 0.5 }}
            className="flex gap-6 mt-8"
          >
            <a href="#" className="text-gray-400 hover:text-white">
              <Github />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Linkedin />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Mail />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
