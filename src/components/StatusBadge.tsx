"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Clock,
  Globe,
  Info,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type StatusType = "online" | "offline" | "holidays";

export default function StatusBadge() {
  const [status, setStatus] = useState<StatusType>("offline");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [time, setTime] = useState("");
  const [mounted, setMounted] = useState(false);

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
  }, []); // Removed showModal dependency as fetch logic is independent

  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return {
          label: "Online",
          headline: "AVAILABLE",
          message:
            "I'm currently active at my desk. It's a great time to reach out for a quick response.",
          color: "bg-emerald-500",
          textColor: "text-emerald-500",
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
          textColor: "text-amber-500",
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
      <div className="relative inline-block mb-8 z-50">
        <motion.button
          onClick={() => {
            setShowModal(true);
          }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer group relative outline-none focus:ring-2 focus:ring-primary/50 ${config.glow}`}
        >
          <span className="relative flex h-2 w-2">
            {status === "online" && (
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.color} opacity-75`}
              ></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${config.color}`}
            ></span>
          </span>
          <span className="group-hover:text-primary transition-colors flex items-center gap-2 font-medium">
            {loading ? "Syncing..." : config.label}
            <Info className="w-3.5 h-3.5 text-gray-500 group-hover:text-primary transition-colors" />
          </span>
        </motion.button>

        {/* Floating Notification Pill (Portal) - Persistent Status Indicator */}
        {mounted &&
          !showModal &&
          createPortal(
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 1,
                }}
                className="fixed bottom-3.5 right-16 sm:bottom-18 sm:right-4 z-[9999] cursor-pointer group"
                onClick={() => setShowModal(true)}
              >
                <div className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/10 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-2 sm:gap-3 hover:bg-white/5 transition-colors ring-1 ring-white/5 hover:ring-white/20">
                  <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.color} opacity-75`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 ${config.color}`}
                    ></span>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-widest font-semibold leading-none mb-0.5">
                      Status
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-white leading-none tracking-wide">
                      {config.headline}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>,
            document.body
          )}
      </div>

      {/* Modal Overlay */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
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
                    className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-${config.color.replace(
                      "bg-",
                      ""
                    )} to-transparent opacity-50`}
                  />
                  <div
                    className={`absolute -top-20 -right-20 w-64 h-64 ${config.color} opacity-[0.03] blur-[80px] rounded-full pointer-events-none`}
                  />

                  <div className="absolute top-0 right-0 p-5 z-50">
                    <button
                      onClick={() => setShowModal(false)}
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
                          <h3 className="text-xl font-bold text-white tracking-tight">
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
