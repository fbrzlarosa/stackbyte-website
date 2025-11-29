"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  Activity,
  Clock,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import Logo from "./Logo";

type StatusType = "online" | "offline" | "holidays";

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
  { name: "Posts", href: "#posts" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [status, setStatus] = useState<StatusType>("offline");
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [time, setTime] = useState("");
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Europe/Rome",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        if (data.status) {
          setStatus(data.status);
        }
      } catch (e) {
        console.error("Failed to fetch status", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return {
          label: "Online",
          headline: "AVAILABLE",
          message:
            "I'm currently active at my desk. It's a great time to reach out for a quick response.",
          color: "bg-emerald-500",
          textColor: "text-emerald-400",
          borderColor: "border-emerald-500/30",
          bgColor: "bg-emerald-500/10",
          glow: "shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]",
          responseTime: "Fast",
        };
      case "holidays":
        return {
          label: "On Leave",
          headline: "ON VACATION",
          message:
            "I'm currently away taking some time off. I'll get back to you as soon as I return.",
          color: "bg-amber-500",
          textColor: "text-amber-400",
          borderColor: "border-amber-500/30",
          bgColor: "bg-amber-500/10",
          glow: "shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)]",
          responseTime: "Slow",
        };
      case "offline":
      default:
        return {
          label: "Offline",
          headline: "AWAY",
          message:
            "I'm currently not at my computer. Feel free to leave a message, I'll reply when I'm back.",
          color: "bg-zinc-500",
          textColor: "text-zinc-400",
          borderColor: "border-zinc-500/30",
          bgColor: "bg-zinc-500/10",
          glow: "shadow-[0_0_30px_-10px_rgba(113,113,122,0.2)]",
          responseTime: "Later",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: 0.2,
        }}
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
          isScrolled
            ? "bg-black/30 backdrop-blur-md h-20 sm:h-16 shadow-lg"
            : "bg-black/0 backdrop-blur-sm h-20 sm:h-24"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link
            href="/"
            className="block w-36 sm:w-44 hover:opacity-80 transition-opacity relative z-50 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Home"
          >
            <Logo className="w-full h-auto" delay={1.2} />
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
            <div className="hidden md:flex items-center gap-6 lg:gap-4">
              {/* Status Badge */}
              {mounted && !loading && (
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group text-xs"
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.color} opacity-75`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${config.color}`}
                    ></span>
                  </span>
                  <span className="font-bold text-white leading-none tracking-wide">
                    {config.headline}
                  </span>
                </button>
              )}

              <Button href="#contact" variant="gradient" size="sm">
                Let&apos;s Talk
              </Button>
            </div>
          </div>

          {/* Mobile Status Badge and Menu Toggle */}
          <div className="md:hidden flex items-center gap-3">
            {/* Status Badge - Mobile */}
            {mounted && !loading && (
              <button
                onClick={() => setShowStatusModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group text-xs"
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.color} opacity-75`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${config.color}`}
                  ></span>
                </span>
                <span className="font-bold text-white leading-none tracking-wide">
                  {config.headline}
                </span>
              </button>
            )}

            <button
              className="text-white relative z-50 p-2 cursor-pointer focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
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
                    className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 hover:to-primary transition-all cursor-pointer tracking-tight"
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

      {/* Status Modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {showStatusModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowStatusModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`bg-[#0D1117] border ${config.borderColor} rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl overflow-hidden`}
                >
                  {/* Background Decoration */}
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${config.color.replace(
                      "bg-",
                      ""
                    )} to-transparent opacity-50`}
                  />
                  <div
                    className={`absolute -top-20 -right-20 w-64 h-64 ${config.color} opacity-[0.03] blur-[80px] rounded-full pointer-events-none`}
                  />

                  <div className="absolute top-0 right-0 p-5 z-50">
                    <button
                      onClick={() => setShowStatusModal(false)}
                      className="text-gray-500 hover:text-white transition-colors cursor-pointer p-1 hover:bg-white/5 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Header */}
                  <div className="flex flex-col gap-4 mb-8 relative z-10">
                    <div className="inline-flex items-center gap-3">
                      <div
                        className={`relative flex items-center justify-center w-12 h-12 rounded-xl ${config.bgColor} border border-white/5`}
                      >
                        <Activity className={`w-6 h-6 ${config.textColor}`} />
                        {status === "online" && (
                          <span
                            className={`absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 ${config.color} rounded-full border-2 border-[#0D1117]`}
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-black text-white tracking-tight">
                            {config.headline}
                          </h3>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded border ${config.borderColor} ${config.textColor} bg-opacity-10 font-mono uppercase tracking-wider`}
                          >
                            Live
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 font-medium">
                          Status Monitor
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm border-l-2 border-white/10 pl-4">
                      {config.message}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs uppercase tracking-wider font-semibold">
                          Location
                        </span>
                      </div>
                      <div className="text-sm text-white font-medium">
                        Lucca, IT
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs uppercase tracking-wider font-semibold">
                          Local Time
                        </span>
                      </div>
                      <div className="text-sm text-white font-medium">
                        {time}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-xs uppercase tracking-wider font-semibold">
                          Response
                        </span>
                      </div>
                      <div
                        className={`text-sm font-medium ${config.textColor}`}
                      >
                        {config.responseTime}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Wifi className="w-3.5 h-3.5" />
                        <span className="text-xs uppercase tracking-wider font-semibold">
                          Connection
                        </span>
                      </div>
                      <div className="text-sm text-white font-medium">
                        Stable
                      </div>
                    </div>
                  </div>

                  {/* System Architecture Info */}
                  <div className="mb-6 relative z-10 bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-3.5 h-3.5 text-yellow-500" />
                      <span className="text-xs uppercase tracking-wider font-semibold text-gray-300">
                        How it works
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      This status indicator is synced in real-time with my
                      computer&apos;s activity. It lets you know if I&apos;m
                      currently at my desk and available to chat, or if I&apos;m
                      away and might take a bit longer to respond.
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs text-gray-500 relative z-10">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary/60" />
                      <span>Verified Presence</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Sync</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
