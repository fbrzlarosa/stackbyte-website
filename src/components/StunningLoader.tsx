"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Logo from "./Logo";

const glichVariants = {
  hidden: { opacity: 0, x: 0 },
  visible: { opacity: 1, x: 0 },
  glitch: {
    opacity: [1, 0.8, 1, 0.9, 1],
    x: [0, -2, 2, -1, 0],
    filter: [
      "hue-rotate(0deg)",
      "hue-rotate(90deg)",
      "hue-rotate(0deg)",
      "hue-rotate(-90deg)",
      "hue-rotate(0deg)",
    ],
    transition: {
      duration: 0.2,
      repeat: 3,
      repeatType: "mirror" as const,
    },
  },
};

export default function StunningLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("INITIALIZING SYSTEM...");
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    const textTimer = setTimeout(() => setLoadingText("ACCESS GRANTED"), 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(textTimer);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0D1117] overflow-hidden"
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: "blur(10px)",
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
        >
          {/* Background Matrix Effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={glichVariants}
              className="w-64 mb-12 relative"
            >
              <motion.div animate="glitch" className="relative z-10">
                <Logo className="w-full h-auto" />
              </motion.div>
              {/* Glitch Clones */}
              <motion.div
                className="absolute inset-0 text-primary opacity-50 -translate-x-1"
                animate={{ x: [-2, 2, -1, 0], opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              >
                <Logo className="w-full h-auto fill-primary" />
              </motion.div>
              <motion.div
                className="absolute inset-0 text-red-500 opacity-50 translate-x-1 mix-blend-screen"
                animate={{ x: [2, -2, 1, 0], opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 0.3,
                }}
              >
                <Logo className="w-full h-auto fill-red-500" />
              </motion.div>
            </motion.div>

            {/* Loading Bar - Cyberpunk Style */}
            <div className="w-64 h-2 bg-black/50 border border-primary/30 rounded-none overflow-hidden relative mb-4">
              <motion.div
                className="absolute inset-0 bg-primary shadow-[0_0_10px_#06B6D4]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "circOut" }}
              />
            </div>

            <motion.div
              className="font-mono text-sm text-primary tracking-widest"
              key={loadingText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              {loadingText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                _
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          onAnimationComplete={() => setAnimationComplete(true)}
          style={{
            // Important: reset filter and transform to allow fixed children to work properly
            // once the entrance animation is done.
            filter: animationComplete ? "none" : undefined,
            transform: animationComplete ? "none" : undefined,
          }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="w-full min-h-screen"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
