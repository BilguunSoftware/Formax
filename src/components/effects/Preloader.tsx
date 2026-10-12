"use client";

import { useEffect, useRef } from "react";
import { useSyncExternalStore } from "react";
import { gsap, registerGsap } from "@/lib/animations";
import {
  finishPreload,
  getPreloadServerSnapshot,
  getPreloadSnapshot,
  motionIsEnabled,
  subscribePreload,
} from "@/lib/motion";
import { markReady } from "@/lib/ready";
import { lockScroll, unlockScroll } from "@/lib/scroll";

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const skipped = useSyncExternalStore(
    subscribePreload,
    getPreloadSnapshot,
    getPreloadServerSnapshot,
  );

  useEffect(() => {
    if (skipped) {
      markReady();
      return;
    }
    lockScroll();
    return () => unlockScroll();
  }, [skipped]);

  useEffect(() => {
    if (skipped) return;
    if (!motionIsEnabled()) {
      const timeout = window.setTimeout(() => {
        finishPreload();
        markReady();
      }, 0);
      return () => window.clearTimeout(timeout);
    }

    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const counter = { value: 0 };
    let alive = true;
    const timeline = gsap.timeline({
      onComplete: () => {
        finishPreload();
        if (alive) markReady();
      },
    });

    timeline
      .from(".fx-pre-shape", {
        scale: 0.7,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.55,
        ease: "power3.out",
      })
      .from(
        ".fx-pre-letter",
        {
          yPercent: 120,
          duration: 0.75,
          stagger: 0.045,
          ease: "power4.out",
        },
        0.12,
      )
      .to(
        counter,
        {
          value: 100,
          duration: 1.15,
          ease: "power1.inOut",
          onUpdate: () => {
            const value = Math.round(counter.value);
            if (numRef.current) {
              numRef.current.textContent = value.toString().padStart(3, "0");
            }
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${value / 100})`;
            }
          },
        },
        0.08,
      )
      .add(() => markReady(), 1.28)
      .to(root, { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, 1.28);

    return () => {
      alive = false;
      timeline.kill();
    };
  }, [skipped]);

  if (skipped) return null;

  return (
    <div
      ref={rootRef}
      className="fx-preloader fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-ink text-paper"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">FORMA X ачаалж байна</span>
      <div className="flex items-center justify-between px-5 pt-6 font-accent text-[10px] uppercase tracking-[0.22em] text-sage lg:px-10">
        <span>FORMA X</span>
        <span>STUDIO / LOAD</span>
      </div>

      <div className="relative grid flex-1 place-items-center">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <span className="fx-pre-shape absolute left-[8%] top-[18%] size-16 border border-lime/80 md:size-24" />
          <span className="fx-pre-shape absolute right-[12%] top-[22%] size-10 border border-paper/40 md:size-16" />
          <span className="fx-pre-shape absolute bottom-[18%] left-[18%] size-8 bg-lime md:size-12" />
          <span className="fx-pre-shape absolute right-[18%] bottom-[16%] h-px w-28 bg-paper/50 md:w-44" />
        </div>
        <p className="overflow-hidden font-display text-[18vw] leading-[0.8] tracking-[-0.05em]">
          <span className="fx-pre-letter inline-block">FORMA</span>{" "}
          <span className="fx-pre-letter inline-block text-lime">X</span>
        </p>
      </div>

      <div className="px-5 pb-6 lg:px-10">
        <div className="mb-3 flex items-end justify-between font-accent text-[11px] tracking-[0.18em]">
          <span>00</span>
          <span ref={numRef}>000</span>
        </div>
        <div className="h-px w-full bg-paper/20">
          <span ref={barRef} className="block h-px origin-left bg-lime" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
