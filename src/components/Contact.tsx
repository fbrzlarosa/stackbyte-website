"use client";

import axios from "axios";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  Variants,
} from "framer-motion";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";


const Turnstile = dynamic(() => import("react-turnstile"), {
  ssr: false,
});

type FormData = {
  name: string;
  email: string;
  message: string;
  privacy: boolean;
};

const formVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8,
      staggerChildren: 0.1,
    },
  },
};

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoadTurnstile, setShouldLoadTurnstile] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150);
    };
    requestAnimationFrame(() => {
      setIsMobile(window.innerWidth < 768);
    });
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoadTurnstile) {
            setShouldLoadTurnstile(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [shouldLoadTurnstile]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 100 : 200,
    damping: isMobile ? 40 : 30,
    restDelta: 0.002,
    mass: isMobile ? 0.3 : 0.2,
  });

  const rotateX = useTransform(smoothProgress, [0, 1], [25, -25]);
  const rotateY = useTransform(smoothProgress, [0, 1], [-20, 20]);
  const rotateZ = useTransform(smoothProgress, [0, 1], [-1, 5]);
  const y = useTransform(smoothProgress, [0, 1], [80, -80]);
  const x = useTransform(smoothProgress, [0, 1], [-30, 30]);
  const scale = useTransform(smoothProgress, [0, 0.3, 1], [0.9, 1.2, 0.9]);
  const opacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [0.2, 1, 1, 0.2]
  );
  const translateZ = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [-100, 100, -100]
  );

  const yMobile = useTransform(smoothProgress, [0, 1], [0, -20]);
  const opacityMobile = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.9]
  );
  const translateZSpan1 = useTransform(smoothProgress, [0, 1], [0, 50]);
  const rotateXSpan1 = useTransform(smoothProgress, [0, 1], [10, -10]);
  const translateZSpan2 = useTransform(smoothProgress, [0, 1], [50, -50]);
  const rotateYSpan2 = useTransform(smoothProgress, [0, 1], [-15, 15]);
  const paraRotateX = useTransform(smoothProgress, [0, 1], [15, -15]);
  const paraRotateY = useTransform(smoothProgress, [0, 1], [-8, 8]);
  const paraY = useTransform(smoothProgress, [0, 1], [25, -25]);
  const paraYMobile = useTransform(smoothProgress, [0, 1], [0, -5]);
  const paraX = useTransform(smoothProgress, [0, 1], [-15, 15]);
  const paraTranslateZ = useTransform(smoothProgress, [0, 1], [-20, 20]);
  const paraScale = useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const paraOpacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0.8]
  );
  const badgesY = useTransform(smoothProgress, [0, 1], [20, -20]);
  const badgesYMobile = useTransform(smoothProgress, [0, 1], [0, -5]);
  const badgesRotateX = useTransform(smoothProgress, [0, 1], [8, -8]);
  const badgesOpacity = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0.9]
  );
  const badge1TranslateZ = useTransform(smoothProgress, [0, 1], [0, 30]);
  const badge1RotateY = useTransform(smoothProgress, [0, 1], [-5, 5]);
  const badge2TranslateZ = useTransform(smoothProgress, [0, 1], [0, 30]);
  const badge2RotateY = useTransform(smoothProgress, [0, 1], [5, -5]);
  const formRotateX = useTransform(smoothProgress, [0, 1], [5, -5]);
  const formRotateY = useTransform(smoothProgress, [0, 1], [-3, 3]);
  const formY = useTransform(smoothProgress, [0, 1], [30, -30]);
  const formYMobile = useTransform(smoothProgress, [0, 1], [0, -10]);
  const formTranslateZ = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [-50, 50, -50]
  );

  const onSubmit = async (data: FormData) => {
    if (!turnstileToken) {
      alert("Please complete the captcha");
      return;
    }

    try {
      await axios.post("/api/contact", {
        ...data,
        token: turnstileToken,
      });
      setStatus("success");
      reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-16 sm:py-24 md:py-32 relative overflow-hidden -mt-1"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          scale: { duration: 1.5 },
          opacity: { duration: 1.5 },
          x: {
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: {
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="absolute right-0 top-96 w-1/3 h-1/3 bg-primary/10 rounded-full blur-[100px] -z-10"
      />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          scale: { duration: 1.5, delay: 0.3 },
          opacity: { duration: 1.5, delay: 0.3 },
          x: {
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          },
          y: {
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          },
        }}
        className="absolute left-0 top-1/4 w-1/4 h-1/4 bg-secondary/10 rounded-full blur-[120px] -z-10"
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-8">

          <div className="flex flex-col items-center gap-8 md:gap-12">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <motion.h2
                style={{
                  rotateX: isMobile ? 0 : rotateX,
                  rotateY: isMobile ? 0 : rotateY,
                  rotateZ: isMobile ? 0 : rotateZ,
                  x: isMobile ? 0 : x,
                  y: isMobile ? yMobile : y,
                  scale: isMobile ? 1 : scale,
                  opacity: isMobile ? opacityMobile : opacity,
                  translateZ: isMobile ? 0 : translateZ,
                  transformStyle: isMobile ? "flat" : "preserve-3d",
                  perspective: isMobile ? "none" : "1500px",
                }}
                className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-12 md:mb-16 lg:mb-24 px-4 sm:px-4 mx-auto max-w-full sm:max-w-[90vw] break-words"
              >
                <motion.span
                  style={{
                    display: "inline-block",
                    transformStyle: isMobile ? "flat" : "preserve-3d",
                    translateZ: isMobile ? 0 : translateZSpan1,
                    rotateX: isMobile ? 0 : rotateXSpan1,
                  }}
                  className="px-2"
                >
                  Let&apos;s build something
                </motion.span>
                <br />
                <span className="relative inline-block">
                  <motion.span
                    style={{
                      transformStyle: isMobile ? "flat" : "preserve-3d",
                      translateZ: isMobile ? 0 : translateZSpan2,
                      rotateY: isMobile ? 0 : rotateYSpan2,
                    }}
                    className="gradient-animated-text"
                  >
                    amazing together.
                  </motion.span>
                  <motion.span
                    className="absolute -inset-1 gradient-animated-glow blur-xl -z-10"
                    style={{
                      transform: "translateZ(-50px)",
                      scale: useTransform(smoothProgress, [0, 1], [1, 1.3]),
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </span>
              </motion.h2>
              <motion.p
                style={{
                  rotateX: isMobile ? 0 : paraRotateX,
                  rotateY: isMobile ? 0 : paraRotateY,
                  y: isMobile ? paraYMobile : paraY,
                  x: isMobile ? 0 : paraX,
                  translateZ: isMobile ? 0 : paraTranslateZ,
                  opacity: paraOpacity,
                  scale: isMobile ? 1 : paraScale,
                  transformStyle: isMobile ? "flat" : "preserve-3d",
                }}
                className="text-center text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed px-6 sm:px-4"
              >
                Ready to transform your digital presence? I&apos;m currently
                available for new projects and collaborations.
              </motion.p>

              <motion.div
                style={{
                  y: isMobile ? badgesYMobile : badgesY,
                  rotateX: isMobile ? 0 : badgesRotateX,
                  opacity: badgesOpacity,
                  transformStyle: isMobile ? "flat" : "preserve-3d",
                }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-300"
              >
                <motion.div
                  style={{
                    translateZ: isMobile ? 0 : badge1TranslateZ,
                    rotateY: isMobile ? 0 : badge1RotateY,
                  }}
                  whileHover={{ scale: 1.1, y: -5, rotateZ: 2 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm shadow-lg shadow-green-500/20"
                >
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.6, 1],
                      boxShadow: [
                        "0 0 0px rgba(34, 197, 94, 0)",
                        "0 0 10px rgba(34, 197, 94, 0.8)",
                        "0 0 0px rgba(34, 197, 94, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="text-sm md:text-base font-medium">
                    Available for freelance work
                  </span>
                </motion.div>
                <motion.div
                  style={{
                    translateZ: isMobile ? 0 : badge2TranslateZ,
                    rotateY: isMobile ? 0 : badge2RotateY,
                  }}
                  whileHover={{ scale: 1.1, y: -5, rotateZ: -2 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary/10 border border-primary/20 shadow-lg shadow-primary/20"
                >
                  <motion.div
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{
                      scale: [1, 1.4, 1],
                      boxShadow: [
                        "0 0 0px rgba(6, 182, 212, 0)",
                        "0 0 10px rgba(6, 182, 212, 0.8)",
                        "0 0 0px rgba(6, 182, 212, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="text-sm md:text-base font-medium">
                    Response time: &lt; 24 hours
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div
              variants={formVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              style={{
                rotateX: isMobile ? 0 : formRotateX,
                rotateY: isMobile ? 0 : formRotateY,
                y: isMobile ? formYMobile : formY,
                translateZ: isMobile ? 0 : formTranslateZ,
                transformStyle: isMobile ? "flat" : "preserve-3d",
              }}
              className="w-full max-w-4xl bg-white/5 border border-white/10 p-6 md:p-16 rounded-3xl backdrop-blur-xl shadow-2xl transform-style-3d relative overflow-hidden"
            >
              {/* Animated Background Gradients */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
                animate={{
                  x: [0, 50, 0],
                  y: [0, 30, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
                animate={{
                  x: [0, -20, 0],
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Animated Border Glow */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background:
                    "linear-gradient(45deg, transparent, rgba(6, 182, 212, 0.1), transparent)",
                  backgroundSize: "200% 200%",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <div className="relative z-10">
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                    >
                      <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-3xl font-black mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Message Sent!
                    </h3>
                    <p className="text-gray-400 mb-6">
                      I&apos;ll get back to you as soon as possible.
                    </p>
                    <motion.button
                      onClick={() => setStatus("idle")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full text-primary font-medium transition-all cursor-pointer"
                    >
                      Send another message
                    </motion.button>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 sm:space-y-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                    >
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-300"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        {...register("name", { required: "Name is required" })}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-white placeholder-gray-500 hover:border-white/20"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-2 flex items-center gap-1"
                        >
                          {errors.name.message}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-300"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-white placeholder-gray-500 hover:border-white/20"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-2 flex items-center gap-1"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-300"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        {...register("message", {
                          required: "Message is required",
                        })}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 resize-none text-white placeholder-gray-500 hover:border-white/20"
                        placeholder="Tell me about your project..."
                      />
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-2 flex items-center gap-1"
                        >
                          {errors.message.message}
                        </motion.p>
                      )}
                    </motion.div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center h-5">
                        <input
                          id="privacy"
                          type="checkbox"
                          {...register("privacy", {
                            required: "You must agree to the privacy policy",
                          })}
                          className="w-4 h-4 rounded border-white/10 text-primary focus:ring-primary bg-black/20"
                        />
                      </div>
                      <div className="text-sm">
                        <label htmlFor="privacy" className="text-gray-400">
                          I agree to the{" "}
                          <a
                            href={`https://www.iubenda.com/privacy-policy/${
                              process.env.NEXT_PUBLIC_IUBENDA_POLICY_ID || ""
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline cursor-pointer"
                          >
                            Privacy Policy
                          </a>{" "}
                          and consent to the processing of my data.
                        </label>
                        {errors.privacy && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.privacy.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {shouldLoadTurnstile && (
                      <div className="w-full overflow-hidden">
                        <Turnstile
                          sitekey={
                            process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
                            "1x00000000000000000000AA"
                          }
                          onVerify={(token) => setTurnstileToken(token)}
                          theme="dark"
                        />
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      isLoading={isSubmitting}
                      variant="gradient"
                      size="lg"
                      className="w-full"
                      rightIcon={
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      }
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>

                    {status === "error" && (
                      <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Something went wrong. Please try again.
                      </div>
                    )}
                  </form>
                )}
              </div>
            </motion.div>
          </div>

      </div>
    </section>
  );
}
