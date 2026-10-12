"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/animations";
import { motionIsEnabled } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useMotion } from "@/components/providers/MotionProvider";

type Line = {
  text: string;
  className?: string;
  maskClassName?: string;
};

type RevealTextProps = {
  lines: Line[];
  className?: string;
  lineClassName?: string;
  immediate?: boolean;
};

export function RevealText({
  lines,
  className,
  lineClassName,
  immediate = false,
}: RevealTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { motionEnabled } = useMotion();
  const signature = lines.map((line) => line.text).join("|");

  useEffect(() => {
    const heading = ref.current;
    if (!heading || !motionEnabled || !motionIsEnabled()) return;
    registerGsap();
    const targets = heading.querySelectorAll<HTMLElement>("[data-line]");
    const context = gsap.context(() => {
      gsap.fromTo(
        targets,
        { yPercent: 118 },
        {
          yPercent: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: immediate
            ? undefined
            : {
                trigger: heading,
                start: "top 86%",
                once: true,
              },
        },
      );
    }, heading);
    return () => context.revert();
  }, [immediate, motionEnabled, signature]);

  return (
    <h2 ref={ref} className={className}>
      {lines.map((line, index) => (
        <span
          key={`${line.text}-${index}`}
          data-mask
          className={cn("block overflow-hidden pt-[0.08em]", line.maskClassName)}
        >
          <span data-line className={cn("block leading-[0.84]", lineClassName, line.className)}>
            {line.text}
          </span>
        </span>
      ))}
    </h2>
  );
}
