"use client";

import axios from "axios";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const Turnstile = dynamic(() => import("react-turnstile"), {
  ssr: false,
});

type FormData = {
  name: string;
  email: string;
  message: string;
  privacy: boolean;
};

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const glowSpanRef = useRef<HTMLSpanElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const badgesContainerRef = useRef<HTMLDivElement>(null);
  const badge1Ref = useRef<HTMLDivElement>(null);
  const badge2Ref = useRef<HTMLDivElement>(null);
  const dot1Ref = useRef<HTMLDivElement>(null);
  const dot2Ref = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const formBg1Ref = useRef<HTMLDivElement>(null);
  const formBg2Ref = useRef<HTMLDivElement>(null);
  const formBg3Ref = useRef<HTMLDivElement>(null);
  const formBorderRef = useRef<HTMLDivElement>(null);
  const successDivRef = useRef<HTMLDivElement>(null);
  const successIconRef = useRef<HTMLDivElement>(null);

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
    let rafId: number | null = null;

    const checkMobile = () => {
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < 768);
        rafId = null;
      });

      timeoutId = setTimeout(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setIsMobile(window.innerWidth < 768);
          rafId = null;
        });
      }, 150);
    };

    requestAnimationFrame(() => {
      setIsMobile(window.innerWidth < 768);
    });

    window.addEventListener("resize", checkMobile, { passive: true });
    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
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

  useEffect(() => {
    if (!sectionRef.current) return;

    let scrollTrigger: ScrollTrigger | null = null;

    const ctx = gsap.context(() => {
      const lerp = (start: number, end: number, t: number) =>
        start + (end - start) * t;

      if (h2Ref.current) {
        gsap.set(h2Ref.current, {
          opacity: 0,
          x: isMobile ? 0 : 50,
          y: isMobile ? 0 : 80,
          rotateX: isMobile ? 0 : 25,
          rotateY: isMobile ? 0 : -20,
          rotateZ: isMobile ? 0 : -1,
          scale: isMobile ? 1 : 0.9,
          translateZ: isMobile ? 0 : -100,
          transformPerspective: 1500,
        });
      }

      scrollTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        refreshPriority: -1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;

          if (h2Ref.current) {
            let scale = 0.9;
            if (p <= 0.3) {
              scale = lerp(0.9, 1.2, p / 0.3);
            } else {
              scale = lerp(1.2, 0.9, (p - 0.3) / 0.7);
            }

            let opacity = 1;
            if (p <= 0.2) {
              opacity = lerp(0, 1, p / 0.2);
            } else if (p >= 0.8) {
              opacity = lerp(1, 0.2, (p - 0.8) / 0.2);
            }

            let translateZ = -100;
            if (p <= 0.5) {
              translateZ = lerp(-100, 100, p / 0.5);
            } else {
              translateZ = lerp(100, -100, (p - 0.5) / 0.5);
            }

            let h2X = 0;
            let h2Y = 0;
            let h2RotateX = 0;
            let h2RotateY = 0;
            let h2RotateZ = 0;

            if (!isMobile) {
              if (p <= 0.3) {
                h2X = lerp(50, 0, p / 0.3);
                h2Y = lerp(80, 0, p / 0.3);
                h2RotateX = lerp(25, 0, p / 0.3);
                h2RotateY = lerp(-20, 0, p / 0.3);
                h2RotateZ = lerp(-1, 0, p / 0.3);
              } else {
                h2X = lerp(0, -30, (p - 0.3) / 0.7);
                h2Y = lerp(0, -80, (p - 0.3) / 0.7);
                h2RotateX = lerp(0, 25, (p - 0.3) / 0.7);
                h2RotateY = lerp(0, 20, (p - 0.3) / 0.7);
                h2RotateZ = lerp(0, 5, (p - 0.3) / 0.7);
              }
            } else {
              h2Y = -p * 20;
            }

            gsap.set(h2Ref.current, {
              rotateX: h2RotateX,
              rotateY: h2RotateY,
              rotateZ: h2RotateZ,
              x: h2X,
              y: h2Y,
              scale: isMobile ? 1 : scale,
              opacity: isMobile
                ? p <= 0.2
                  ? lerp(0, 1, p / 0.2)
                  : p >= 0.8
                  ? lerp(1, 0.9, (p - 0.8) / 0.2)
                  : 1
                : opacity,
              translateZ: isMobile ? 0 : translateZ,
              transformPerspective: 1500,
            });
          }

          if (paraRef.current) {
            let paraScale = 0.95;
            if (p <= 0.5) {
              paraScale = lerp(0.95, 1, p / 0.5);
            } else {
              paraScale = lerp(1, 0.95, (p - 0.5) / 0.5);
            }

            let paraOpacity = 1;
            if (p <= 0.2) {
              paraOpacity = p / 0.2;
            } else if (p >= 0.8) {
              paraOpacity = lerp(1, 0.8, (p - 0.8) / 0.2);
            }

            gsap.set(paraRef.current, {
              rotateX: isMobile ? 0 : 15 - p * 30,
              rotateY: isMobile ? 0 : -8 + p * 16,
              y: isMobile ? -p * 5 : 25 - p * 50,
              x: isMobile ? 0 : -15 + p * 30,
              translateZ: isMobile ? 0 : -20 + p * 40,
              scale: isMobile ? 1 : paraScale,
              opacity: paraOpacity,
            });
          }

          if (badgesContainerRef.current) {
            let badgesOpacity = 1;
            if (p <= 0.3) {
              badgesOpacity = p / 0.3;
            } else if (p >= 0.7) {
              badgesOpacity = lerp(1, 0.9, (p - 0.7) / 0.3);
            }

            gsap.set(badgesContainerRef.current, {
              y: isMobile ? -p * 5 : 20 - p * 40,
              rotateX: isMobile ? 0 : 8 - p * 16,
              opacity: badgesOpacity,
            });
          }

          if (badge1Ref.current) {
            gsap.set(badge1Ref.current, {
              translateZ: isMobile ? 0 : p * 30,
              rotateY: isMobile ? 0 : -5 + p * 10,
            });
          }

          if (badge2Ref.current) {
            gsap.set(badge2Ref.current, {
              translateZ: isMobile ? 0 : p * 30,
              rotateY: isMobile ? 0 : 5 - p * 10,
            });
          }

          if (formContainerRef.current) {
            let formTranslateZ = -50;
            if (p <= 0.5) {
              formTranslateZ = lerp(-50, 50, p / 0.5);
            } else {
              formTranslateZ = lerp(50, -50, (p - 0.5) / 0.5);
            }

            gsap.set(formContainerRef.current, {
              rotateX: isMobile ? 0 : 5 - p * 10,
              rotateY: isMobile ? 0 : -3 + p * 6,
              y: isMobile ? -p * 10 : 30 - p * 60,
              translateZ: isMobile ? 0 : formTranslateZ,
            });
          }
        },
      });

      const refreshAfterLoad = () => {
        const images = document.querySelectorAll("img");
        let loadedCount = 0;
        const totalImages = images.length;

        if (totalImages === 0) {
          setTimeout(() => {
            ScrollTrigger.refresh();
            if (scrollTrigger) {
              scrollTrigger.refresh();
              scrollTrigger.update();
            }
          }, 200);
          return;
        }

        const checkAllLoaded = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setTimeout(() => {
              ScrollTrigger.refresh();
              if (scrollTrigger) {
                scrollTrigger.refresh();
                scrollTrigger.update();
              }
            }, 100);
          }
        };

        images.forEach((img) => {
          if ((img as HTMLImageElement).complete) {
            checkAllLoaded();
          } else {
            img.addEventListener("load", checkAllLoaded, { once: true });
            img.addEventListener("error", checkAllLoaded, { once: true });
          }
        });
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          refreshAfterLoad();
        });
      });

      if (dot1Ref.current) {
        gsap.to(dot1Ref.current, {
          scale: 1.5,
          opacity: 0.6,
          boxShadow: "0 0 10px rgba(34, 197, 94, 0.8)",
          duration: 1,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (dot2Ref.current) {
        gsap.to(dot2Ref.current, {
          scale: 1.4,
          boxShadow: "0 0 10px rgba(6, 182, 212, 0.8)",
          duration: 1,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (formBg1Ref.current) {
        gsap.to(formBg1Ref.current, {
          opacity: 0.8,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (formBg2Ref.current) {
        gsap.to(formBg2Ref.current, {
          keyframes: [
            { x: 0, y: 0, scale: 1, duration: 0 },
            { x: 50, y: 30, scale: 1.2, duration: 4 },
            { x: 0, y: 0, scale: 1, duration: 4 },
          ],
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (formBg3Ref.current) {
        gsap.to(formBg3Ref.current, {
          keyframes: [
            { x: 0, y: 0, scale: 1, duration: 0 },
            { x: -20, y: -10, scale: 1.05, duration: 5 },
            { x: 0, y: 0, scale: 1, duration: 5 },
          ],
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (formBorderRef.current) {
        gsap.to(formBorderRef.current, {
          keyframes: [
            { backgroundPosition: "0% 0%", duration: 0 },
            { backgroundPosition: "100% 100%", duration: 2.5 },
            { backgroundPosition: "0% 0%", duration: 2.5 },
          ],
          repeat: -1,
          ease: "none",
        });
      }

      if (glowSpanRef.current) {
        gsap.to(glowSpanRef.current, {
          keyframes: [
            { opacity: 0.5, scale: 1, duration: 0 },
            { opacity: 1, scale: 1.2, duration: 1 },
            { opacity: 0.5, scale: 1, duration: 1 },
          ],
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    }, sectionRef);

    const refreshScrollTrigger = () => {
      ScrollTrigger.refresh();
    };

    requestAnimationFrame(() => {
      refreshScrollTrigger();
    });

    const handleResize = () => {
      requestAnimationFrame(() => {
        refreshScrollTrigger();
        if (scrollTrigger) {
          scrollTrigger.refresh();
          scrollTrigger.update();
        }
      });
    };

    const handleLoad = () => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (scrollTrigger) {
          scrollTrigger.refresh();
          scrollTrigger.update();
        }
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });

    if (document.readyState === "complete") {
      setTimeout(handleLoad, 300);
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleLoad);
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      ctx.revert();
    };
  }, [isMobile]);

  useEffect(() => {
    if (
      status === "success" &&
      successDivRef.current &&
      successIconRef.current
    ) {
      gsap.fromTo(
        successDivRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5 }
      );

      gsap.fromTo(
        successIconRef.current,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [status]);

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

  const handleSendAnother = () => {
    setStatus("idle");
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-16 sm:py-24 md:py-32 relative overflow-hidden -mt-1"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col items-center gap-8 md:gap-12">
          <div className="w-full">
            <h2
              ref={h2Ref}
              style={{
                transformStyle: isMobile ? "flat" : "preserve-3d",
                perspective: isMobile ? "none" : "1500px",
              }}
              className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-12 md:mb-16 lg:mb-24 px-4 sm:px-4 mx-auto max-w-full sm:max-w-[90vw] wrap-break-word"
            >
              <span
                style={{
                  display: "inline-block",
                  transformStyle: isMobile ? "flat" : "preserve-3d",
                }}
                className="px-2"
              >
                Let&apos;s build something
              </span>
              <br />
              <span className="relative inline-block">
                <span
                  style={{
                    transformStyle: isMobile ? "flat" : "preserve-3d",
                  }}
                  className="gradient-animated-text"
                >
                  amazing together.
                </span>
                <span
                  ref={glowSpanRef}
                  className="absolute -inset-1 gradient-animated-glow blur-xl -z-10"
                  style={{
                    transform: "translateZ(-50px)",
                  }}
                />
              </span>
            </h2>
            <p
              ref={paraRef}
              style={{
                transformStyle: isMobile ? "flat" : "preserve-3d",
              }}
              className="text-center text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed px-6 sm:px-4"
            >
              Ready to transform your digital presence? I&apos;m currently
              available for new projects and collaborations.
            </p>

            <div
              ref={badgesContainerRef}
              style={{
                transformStyle: isMobile ? "flat" : "preserve-3d",
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-300"
            >
              <div
                ref={badge1Ref}
                style={{
                  transformStyle: isMobile ? "flat" : "preserve-3d",
                }}
                className="flex items-center gap-3 px-5 py-3 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm shadow-lg shadow-green-500/20"
              >
                <div
                  ref={dot1Ref}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
                <span className="text-sm md:text-base font-medium">
                  Available for freelance work
                </span>
              </div>
              <div
                ref={badge2Ref}
                style={{
                  transformStyle: isMobile ? "flat" : "preserve-3d",
                }}
                className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary/10 border border-primary/20 shadow-lg shadow-primary/20"
              >
                <div
                  ref={dot2Ref}
                  className="w-2 h-2 bg-primary rounded-full"
                />
                <span className="text-sm md:text-base font-medium">
                  Response time: &lt; 24 hours
                </span>
              </div>
            </div>
          </div>

          <div
            ref={formContainerRef}
            style={{
              transformStyle: isMobile ? "flat" : "preserve-3d",
            }}
            className="w-full max-w-4xl bg-white/5 border border-white/10 p-6 md:p-16 rounded-3xl backdrop-blur-xl shadow-2xl transform-style-3d relative overflow-hidden"
          >
            <div
              ref={formBg1Ref}
              className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10"
              style={{ opacity: 0.5 }}
            />
            <div
              ref={formBg2Ref}
              className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            />
            <div
              ref={formBg3Ref}
              className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
            />

            <div
              ref={formBorderRef}
              className="absolute inset-0 rounded-3xl"
              style={{
                background:
                  "linear-gradient(45deg, transparent, rgba(6, 182, 212, 0.1), transparent)",
                backgroundSize: "200% 200%",
              }}
            />

            <div className="relative z-10">
              {status === "success" ? (
                <div ref={successDivRef} className="text-center py-12">
                  <div ref={successIconRef}>
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  </div>
                  <h3 className="text-3xl font-black mb-3 bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Message Sent!
                  </h3>
                  <p className="text-gray-400 mb-6">
                    I&apos;ll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={handleSendAnother}
                    onMouseEnter={(e) =>
                      gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })
                    }
                    onMouseLeave={(e) =>
                      gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
                    }
                    onMouseDown={(e) =>
                      gsap.to(e.currentTarget, { scale: 0.95, duration: 0.1 })
                    }
                    onMouseUp={(e) =>
                      gsap.to(e.currentTarget, { scale: 1.05, duration: 0.1 })
                    }
                    className="px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full text-primary font-medium transition-all cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 sm:space-y-6"
                >
                  <div>
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
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
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
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
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
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

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
          </div>
        </div>
      </div>
    </section>
  );
}
