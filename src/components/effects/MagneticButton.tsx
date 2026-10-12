"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMotion } from "@/components/providers/MotionProvider";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { motionEnabled } = useMotion();

  useEffect(() => {
    if (!motionEnabled && ref.current) {
      ref.current.style.transform = "";
    }
  }, [motionEnabled]);

  function onMove(event: React.MouseEvent<HTMLSpanElement>) {
    if (!motionEnabled || !ref.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    ref.current.style.transition = "none";
    ref.current.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  }

  function onLeave() {
    if (!ref.current) return;
    ref.current.style.transition = "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)";
    ref.current.style.transform = "translate3d(0, 0, 0)";
  }

  return (
    <span
      ref={ref}
      className={cn("inline-flex", className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </span>
  );
}
