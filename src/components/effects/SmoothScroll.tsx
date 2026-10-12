"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/animations";
import { getLenis, scrollToHash, setLenis } from "@/lib/scroll";
import { useMotion } from "@/components/providers/MotionProvider";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const { motionEnabled } = useMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (!motionEnabled || document.documentElement.dataset.motion === "off") {
      setLenis(null);
      return;
    }

    registerGsap();
    const lenis = new Lenis({
      duration: 1.08,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.92,
    });
    setLenis(lenis);

    const unsubscribe = lenis.on("scroll", () => {
      ScrollTrigger.update();
    });
    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    const timeout = window.setTimeout(refresh, 350);
    window.addEventListener("load", refresh);
    const fontsReady = document.fonts?.ready.then(refresh);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("load", refresh);
      void fontsReady;
      gsap.ticker.remove(ticker);
      unsubscribe();
      lenis.destroy();
      setLenis(null);
    };
  }, [motionEnabled]);

  useEffect(() => {
    registerGsap();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);

    if (!window.location.hash) {
      ScrollTrigger.refresh();
      return;
    }
    const timeout = window.setTimeout(() => {
      scrollToHash(window.location.hash);
      ScrollTrigger.refresh();
    }, 90);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return children;
}
