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
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Turnstile from "react-turnstile";
import ScrollReveal from "./ScrollReveal";

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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
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
      className="py-32 relative overflow-hidden"
    >
      {/* Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="absolute inset-0 bg-linear-to-b from-transparent to-primary/5 -z-10"
      />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute right-0 bottom-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-[100px] -z-10"
      />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute left-0 top-1/4 w-1/4 h-1/4 bg-purple-500/10 rounded-full blur-[120px] -z-10"
      />

      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-12">
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
                  rotateX,
                  rotateY,
                  rotateZ,
                  x,
                  y,
                  scale,
                  opacity,
                  translateZ,
                  transformStyle: "preserve-3d",
                  perspective: "1500px",
                }}
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-24"
              >
                <motion.span
                  style={{
                    display: "inline-block",
                    transformStyle: "preserve-3d",
                    translateZ: useTransform(smoothProgress, [0, 1], [0, 50]),
                    rotateX: useTransform(smoothProgress, [0, 1], [10, -10]),
                  }}
                >
                  Let&apos;s build something
                </motion.span>
                <br />
                <span className="relative inline-block">
                  <motion.span
                    style={{
                      transformStyle: "preserve-3d",
                      translateZ: useTransform(
                        smoothProgress,
                        [0, 1],
                        [50, -50]
                      ),
                      rotateY: useTransform(smoothProgress, [0, 1], [-15, 15]),
                    }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary bg-[length:200%_auto] animate-gradient"
                  >
                    amazing together.
                  </motion.span>
                  <motion.span
                    className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 blur-xl -z-10"
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
                  rotateX: useTransform(smoothProgress, [0, 1], [15, -15]),
                  rotateY: useTransform(smoothProgress, [0, 1], [-8, 8]),
                  y: useTransform(smoothProgress, [0, 1], [50, -50]),
                  x: useTransform(smoothProgress, [0, 1], [-20, 20]),
                  translateZ: useTransform(smoothProgress, [0, 1], [-30, 30]),
                  opacity: useTransform(
                    smoothProgress,
                    [0, 0.2, 0.8, 1],
                    [0, 1, 1, 0.8]
                  ),
                  scale: useTransform(
                    smoothProgress,
                    [0, 0.5, 1],
                    [0.95, 1, 0.95]
                  ),
                  transformStyle: "preserve-3d",
                }}
                className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
              >
                Ready to transform your digital presence? I&apos;m currently
                available for new projects and collaborations.
              </motion.p>

              <motion.div
                style={{
                  y: useTransform(smoothProgress, [0, 1], [40, -40]),
                  rotateX: useTransform(smoothProgress, [0, 1], [8, -8]),
                  opacity: useTransform(
                    smoothProgress,
                    [0, 0.3, 0.7, 1],
                    [0, 1, 1, 0.9]
                  ),
                  transformStyle: "preserve-3d",
                }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-300"
              >
                <motion.div
                  style={{
                    translateZ: useTransform(smoothProgress, [0, 1], [0, 30]),
                    rotateY: useTransform(smoothProgress, [0, 1], [-5, 5]),
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
                    translateZ: useTransform(smoothProgress, [0, 1], [0, 30]),
                    rotateY: useTransform(smoothProgress, [0, 1], [5, -5]),
                  }}
                  whileHover={{ scale: 1.1, y: -5, rotateZ: -2 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm shadow-lg shadow-primary/20"
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
                rotateX: useTransform(smoothProgress, [0, 1], [5, -5]),
                rotateY: useTransform(smoothProgress, [0, 1], [-3, 3]),
                y: useTransform(smoothProgress, [0, 1], [60, -60]),
                translateZ: useTransform(
                  smoothProgress,
                  [0, 0.5, 1],
                  [-50, 50, -50]
                ),
                transformStyle: "preserve-3d",
              }}
              className="w-full max-w-4xl bg-white/5 border border-white/10 p-10 md:p-16 rounded-3xl backdrop-blur-xl shadow-2xl transform-style-3d relative overflow-hidden"
            >
              {/* Animated Background Gradients */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10"
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
                className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
                animate={{
                  x: [0, -30, 0],
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1],
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
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Message Sent!
                    </h3>
                    <p className="text-gray-400 mb-6">
                      I&apos;ll get back to you as soon as possible.
                    </p>
                    <motion.button
                      onClick={() => setStatus("idle")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full text-primary font-medium transition-all"
                    >
                      Send another message
                    </motion.button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                    >
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold mb-3 text-gray-300"
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
                        className="block text-sm font-semibold mb-3 text-gray-300"
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
                        className="block text-sm font-semibold mb-3 text-gray-300"
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
                          <a href="#" className="text-primary hover:underline">
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

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-primary/20 relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      {isSubmitting ? (
                        <span className="relative z-10 flex items-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          Sending...
                        </span>
                      ) : (
                        <span className="relative z-10 flex items-center gap-2">
                          Send Message
                          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </motion.button>

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
        </ScrollReveal>
      </div>
    </section>
  );
}
