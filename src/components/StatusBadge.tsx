"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Cpu, Globe, Info, Server, X } from "lucide-react";
import { useEffect, useState } from "react";

type StatusType = "online" | "offline" | "holidays";

export default function StatusBadge() {
  const [status, setStatus] = useState<StatusType>("offline");
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    const interval = setInterval(fetchStatus, 30000);

    const tooltipTimer = setTimeout(() => {
      if (!showModal) setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 6000);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(tooltipTimer);
    };
  }, [showModal]);

  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return {
          text: "I'm Online! Contact me instantly",
          color: "bg-green-500",
          tooltip: "Live Status: Active on PC 🟢",
          description:
            "I'm currently sitting at my desk, coding or designing. This is the best time to reach out for an immediate response.",
        };
      case "holidays":
        return {
          text: "On holidays! Limited availability",
          color: "bg-yellow-500",
          tooltip: "Live Status: Chilling 🌴",
          description:
            "I'm currently taking some time off to recharge. I might reply with some delay.",
        };
      case "offline":
      default:
        return {
          text: "I'm not on my throne",
          color: "bg-gray-500",
          tooltip: "Live Status: Away from Keyboard 💤",
          description:
            "I'm currently away from my computer or sleeping. I'll get back to you as soon as I'm back online.",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <>
      <div className="relative inline-block mb-8 z-40">
        <AnimatePresence>
          {showTooltip && !showModal && (
            <motion.div
              initial={{ opacity: 0, y: 5, x: "-50%" }}
              animate={{ opacity: 1, y: -40, x: "-50%" }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 top-0 bg-black/90 backdrop-blur-md border border-white/10 text-xs px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none shadow-xl z-60"
            >
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45" />
              <span className="font-mono text-primary font-bold">
                {config.tooltip}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => {
            setShowModal(true);
            setShowTooltip(false);
          }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => !showModal && setShowTooltip(true)}
          onHoverEnd={() => setShowTooltip(false)}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer group relative outline-none focus:ring-2 focus:ring-primary/50"
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
          <span className="group-hover:text-primary transition-colors flex items-center gap-2">
            {loading ? "Checking status..." : config.text}
            <Info className="w-3 h-3 text-gray-500 group-hover:text-primary transition-colors" />
          </span>
        </motion.button>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-screen inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0D1117] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-3 h-3 rounded-full ${config.color} ${
                    status === "online" ? "animate-pulse" : ""
                  }`}
                />
                <h3 className="text-xl font-bold text-white">System Status</h3>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-gray-300 leading-relaxed">
                    {config.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    How it works
                  </h4>
                  <div className="space-y-4 relative">
                    {/* Connection Line */}
                    <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-white/10" />

                    <div className="relative flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-black border border-white/20 flex items-center justify-center shrink-0 z-10 mt-0.5">
                        <Cpu className="w-3 h-3 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          Local Tracker
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          A Node.js script runs on my local machine, monitoring
                          keyboard & mouse activity.
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-black border border-white/20 flex items-center justify-center shrink-0 z-10 mt-0.5">
                        <Globe className="w-3 h-3 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          API Update
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          If I&apos;m active, the script sends a secure
                          &quot;Online&quot; signal to this website&apos;s
                          serverless API.
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-black border border-white/20 flex items-center justify-center shrink-0 z-10 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          Live Sync
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          The badge updates in real-time, letting you know if
                          I&apos;m physically at my desk.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
