"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/animations";
import { motionIsEnabled } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useMotion } from "@/components/providers/MotionProvider";

const origins = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
} as const;

type ImageMaskProps = {
  children: ReactNode;
  className?: string;
  direction?: keyof typeof origins;
  parallax?: boolean;
};

export function ImageMask({
  children,
  className,
  direction = "up",
  parallax = true,
}: ImageMaskProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { motionEnabled } = useMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionEnabled || !motionIsEnabled()) return;
    registerGsap();
    const inner = el.querySelector("[data-mask-inner]");
    const context = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: origins[direction] },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.25,
          ease: "power4.inOut",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
      if (inner && parallax) {
        gsap.fromTo(
          inner,
          { yPercent: -4, scale: 1.14 },
          {
            yPercent: 4,
            scale: 1.05,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.85,
            },
          },
        );
      }
    }, el);
    return () => context.revert();
  }, [direction, motionEnabled, parallax]);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <div data-mask-inner className="relative h-full w-full">
        {children}
      </div>
    </div>
  );
}
