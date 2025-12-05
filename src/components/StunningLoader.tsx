"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

export default function StunningLoader({
  children,
  finalMessage = "ACCESS GRANTED",
  showContent = false,
  errorContent,
  isError = false,
}: {
  children?: React.ReactNode;
  finalMessage?: string;
  showContent?: boolean;
  errorContent?: React.ReactNode;
  isError?: boolean;
}) {
  const [loadingText, setLoadingText] = useState("INITIALIZING SYSTEM...");
  const [showErrorContent, setShowErrorContent] = useState(false);
  const [isErrorState, setIsErrorState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosingLoader, setIsClosingLoader] = useState(false);

  const showContentLogoContainerRef = useRef<HTMLDivElement>(null);
  const showContentLogoMainRef = useRef<HTMLDivElement>(null);
  const showContentLogoBlueRef = useRef<HTMLDivElement>(null);
  const showContentLogoRedRef = useRef<HTMLDivElement>(null);
  const showContentProgressRef = useRef<HTMLDivElement>(null);
  const showContentTextRef = useRef<HTMLDivElement>(null);
  const showContentCursorRef = useRef<HTMLSpanElement>(null);
  const showContentErrorRef = useRef<HTMLDivElement>(null);

  const loaderContainerRef = useRef<HTMLDivElement>(null);
  const loaderLogoContainerRef = useRef<HTMLDivElement>(null);
  const loaderLogoMainRef = useRef<HTMLDivElement>(null);
  const loaderLogoBlueRef = useRef<HTMLDivElement>(null);
  const loaderLogoRedRef = useRef<HTMLDivElement>(null);
  const loaderProgressRef = useRef<HTMLDivElement>(null);
  const loaderTextRef = useRef<HTMLDivElement>(null);
  const loaderCursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const textTimer = setTimeout(() => {
      setLoadingText(finalMessage);
      if (isError) {
        setIsErrorState(true);
      }
      if (showContent && errorContent) {
        setTimeout(() => {
          setShowErrorContent(true);
        }, 300);
      }
    }, 1500);

    return () => {
      clearTimeout(textTimer);
    };
  }, [finalMessage, showContent, errorContent, isError]);

  useEffect(() => {
    if (!showContent) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showContent]);

  useEffect(() => {
    if (!showContent) return;

    const ctx = gsap.context(() => {
      if (showContentLogoContainerRef.current) {
        gsap.set(showContentLogoContainerRef.current, { opacity: 0 });
        gsap.to(showContentLogoContainerRef.current, {
          opacity: 1,
          duration: 0.3,
        });
      }

      if (showContentLogoMainRef.current) {
        const tl = gsap.timeline({ repeat: 3, yoyo: true });
        tl.to(showContentLogoMainRef.current, {
          opacity: 0.8,
          x: -2,
          filter: "hue-rotate(90deg)",
          duration: 0.05,
        })
          .to(showContentLogoMainRef.current, {
            opacity: 1,
            x: 2,
            filter: "hue-rotate(0deg)",
            duration: 0.05,
          })
          .to(showContentLogoMainRef.current, {
            opacity: 0.9,
            x: -1,
            filter: "hue-rotate(-90deg)",
            duration: 0.05,
          })
          .to(showContentLogoMainRef.current, {
            opacity: 1,
            x: 0,
            filter: "hue-rotate(0deg)",
            duration: 0.05,
          });
      }

      if (showContentLogoBlueRef.current) {
        gsap.to(showContentLogoBlueRef.current, {
          keyframes: [
            { x: -2, opacity: 0, duration: 0 },
            { x: 2, opacity: 0.5, duration: 0.1 },
            { x: -1, opacity: 0.5, duration: 0.05 },
            { x: 0, opacity: 0, duration: 0.05 },
          ],
          repeat: -1,
          repeatDelay: 0.5,
        });
      }

      if (showContentLogoRedRef.current) {
        gsap.to(showContentLogoRedRef.current, {
          keyframes: [
            { x: 2, opacity: 0, duration: 0 },
            { x: -2, opacity: 0.5, duration: 0.15 },
            { x: 1, opacity: 0.5, duration: 0.075 },
            { x: 0, opacity: 0, duration: 0.075 },
          ],
          repeat: -1,
          repeatDelay: 0.3,
        });
      }

      if (showContentProgressRef.current) {
        gsap.fromTo(
          showContentProgressRef.current,
          { width: "0%" },
          {
            width: "100%",
            duration: 1.5,
            ease: "circ.out",
          }
        );
      }

      if (showContentTextRef.current) {
        gsap.fromTo(
          showContentTextRef.current,
          { opacity: 0, y: 5 },
          { opacity: 1, y: 0, duration: 0.3 }
        );
      }

      if (showContentCursorRef.current) {
        gsap.to(showContentCursorRef.current, {
          keyframes: [
            { opacity: 0, duration: 0 },
            { opacity: 1, duration: 0.25 },
            { opacity: 0, duration: 0.25 },
          ],
          repeat: -1,
        });
      }
    });

    return () => ctx.revert();
  }, [showContent, loadingText]);

  useEffect(() => {
    if (!showContent || !showContentTextRef.current) return;

    if (isErrorState) {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(showContentTextRef.current, {
        opacity: 0.8,
        x: -2,
        duration: 0.0375,
      })
        .to(showContentTextRef.current, {
          opacity: 1,
          x: 2,
          duration: 0.0375,
        })
        .to(showContentTextRef.current, {
          opacity: 0.9,
          x: -1,
          duration: 0.0375,
        })
        .to(showContentTextRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.0375,
        });
    } else {
      gsap.set(showContentTextRef.current, { opacity: 1, y: 0, x: 0 });
    }
  }, [showContent, isErrorState, loadingText]);

  useEffect(() => {
    if (!showContent || !showContentErrorRef.current || !showErrorContent)
      return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        showContentErrorRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    });

    return () => ctx.revert();
  }, [showContent, showErrorContent]);

  useEffect(() => {
    if (!isLoading || showContent) return;

    const ctx = gsap.context(() => {
      if (loaderLogoContainerRef.current) {
        gsap.set(loaderLogoContainerRef.current, { opacity: 0 });
        gsap.to(loaderLogoContainerRef.current, {
          opacity: 1,
          duration: 0.3,
        });
      }

      if (loaderLogoMainRef.current) {
        const tl = gsap.timeline({ repeat: 3, yoyo: true });
        tl.to(loaderLogoMainRef.current, {
          opacity: 0.8,
          x: -2,
          filter: "hue-rotate(90deg)",
          duration: 0.05,
        })
          .to(loaderLogoMainRef.current, {
            opacity: 1,
            x: 2,
            filter: "hue-rotate(0deg)",
            duration: 0.05,
          })
          .to(loaderLogoMainRef.current, {
            opacity: 0.9,
            x: -1,
            filter: "hue-rotate(-90deg)",
            duration: 0.05,
          })
          .to(loaderLogoMainRef.current, {
            opacity: 1,
            x: 0,
            filter: "hue-rotate(0deg)",
            duration: 0.05,
          });
      }

      if (loaderLogoBlueRef.current) {
        gsap.to(loaderLogoBlueRef.current, {
          keyframes: [
            { x: -2, opacity: 0, duration: 0 },
            { x: 2, opacity: 0.5, duration: 0.1 },
            { x: -1, opacity: 0.5, duration: 0.05 },
            { x: 0, opacity: 0, duration: 0.05 },
          ],
          repeat: -1,
          repeatDelay: 0.5,
        });
      }

      if (loaderLogoRedRef.current) {
        gsap.to(loaderLogoRedRef.current, {
          keyframes: [
            { x: 2, opacity: 0, duration: 0 },
            { x: -2, opacity: 0.5, duration: 0.15 },
            { x: 1, opacity: 0.5, duration: 0.075 },
            { x: 0, opacity: 0, duration: 0.075 },
          ],
          repeat: -1,
          repeatDelay: 0.3,
        });
      }

      if (loaderProgressRef.current) {
        gsap.fromTo(
          loaderProgressRef.current,
          { width: "0%" },
          {
            width: "100%",
            duration: 1.5,
            ease: "circ.out",
          }
        );
      }

      if (loaderTextRef.current) {
        gsap.fromTo(
          loaderTextRef.current,
          { opacity: 0, y: 5 },
          { opacity: 1, y: 0, duration: 0.3 }
        );
      }

      if (loaderCursorRef.current) {
        gsap.to(loaderCursorRef.current, {
          keyframes: [
            { opacity: 0, duration: 0 },
            { opacity: 1, duration: 0.25 },
            { opacity: 0, duration: 0.25 },
          ],
          repeat: -1,
        });
      }
    });

    return () => ctx.revert();
  }, [isLoading, showContent, loadingText]);

  useEffect(() => {
    if (isLoading || showContent) {
      setIsClosingLoader(false);
      return;
    }

    if (!loaderContainerRef.current) {
      setIsLoading(false);
      return;
    }

    setIsClosingLoader(true);
    const ctx = gsap.context(() => {
      gsap.to(loaderContainerRef.current, {
        opacity: 0,
        scale: 1.1,
        filter: "blur(10px)",
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          setIsClosingLoader(false);
        },
      });
    });

    return () => ctx.revert();
  }, [isLoading, showContent]);

  if (showContent) {
    const textColorClass = isErrorState ? "text-red-500" : "text-primary";

    return (
      <div className="fixed inset-0 z-10000 flex items-center justify-center bg-[#0D1117] overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div
            ref={showContentLogoContainerRef}
            className="w-64 mb-12 relative"
          >
            <div ref={showContentLogoMainRef} className="relative z-10">
              <Logo className="w-full h-auto" />
            </div>
            <div
              ref={showContentLogoBlueRef}
              className="absolute inset-0 text-primary opacity-50 -translate-x-1"
            >
              <Logo className="w-full h-auto fill-primary" />
            </div>
            <div
              ref={showContentLogoRedRef}
              className="absolute inset-0 text-red-500 opacity-50 translate-x-1 mix-blend-screen"
            >
              <Logo className="w-full h-auto fill-red-500" />
            </div>
          </div>

          <div className="w-64 h-2 bg-black/50 border border-primary/30 rounded-none overflow-hidden relative mb-4">
            <div
              ref={showContentProgressRef}
              className="absolute inset-0 bg-primary shadow-[0_0_10px_var(--primary)]"
            />
          </div>

          <div
            ref={showContentTextRef}
            className={`font-mono text-sm ${textColorClass} tracking-widest mb-8`}
          >
            {loadingText}
            <span ref={showContentCursorRef}>_</span>
          </div>

          {showErrorContent && errorContent && (
            <div
              ref={showContentErrorRef}
              className="flex flex-col items-center gap-6"
            >
              {errorContent}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {(isLoading || isClosingLoader) && (
        <div
          ref={loaderContainerRef}
          className="fixed inset-0 z-10000 flex items-center justify-center bg-[#0D1117] overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div ref={loaderLogoContainerRef} className="w-64 mb-12 relative">
              <div ref={loaderLogoMainRef} className="relative z-10">
                <Logo className="w-full h-auto" />
              </div>
              <div
                ref={loaderLogoBlueRef}
                className="absolute inset-0 text-primary opacity-50 -translate-x-1"
              >
                <Logo className="w-full h-auto fill-primary" />
              </div>
              <div
                ref={loaderLogoRedRef}
                className="absolute inset-0 text-red-500 opacity-50 translate-x-1 mix-blend-screen"
              >
                <Logo className="w-full h-auto fill-red-500" />
              </div>
            </div>

            <div className="w-64 h-2 bg-black/50 border border-primary/30 rounded-none overflow-hidden relative mb-4">
              <div
                ref={loaderProgressRef}
                className="absolute inset-0 bg-primary shadow-[0_0_10px_var(--primary)]"
              />
            </div>

            <div
              ref={loaderTextRef}
              className="font-mono text-sm text-primary tracking-widest"
            >
              {loadingText}
              <span ref={loaderCursorRef}>_</span>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
