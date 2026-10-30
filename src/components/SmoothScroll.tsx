'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { pauseOffscreenTweens } from '@/lib/pauseOffscreenTweens';
import { ReactNode, useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !reduceMotion,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Drive Lenis from the GSAP ticker so both share a single RAF loop.
    // This eliminates the duplicate requestAnimationFrame and keeps
    // ScrollTrigger perfectly in sync with the smooth-scroll position.
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.lagSmoothing(0);

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);

    // Ambient infinite tweens stop ticking while their section is offscreen.
    const stopOffscreenPause = pauseOffscreenTweens();

    return () => {
      stopOffscreenPause();
      gsap.ticker.remove(tickerFn);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
