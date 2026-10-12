"use client";

import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type CursorMode = "default" | "hover" | "view" | "hidden";

export function CustomCursor() {
  const { motionEnabled } = useMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const enabled = motionEnabled && fine;
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");

  useEffect(() => {
    const root = document.documentElement;
    if (!enabled) {
      delete root.dataset.cursor;
      return;
    }
    root.dataset.cursor = "on";

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let frame = 0;
    let visible = false;

    const render = () => {
      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        ringRef.current.style.opacity = visible ? "1" : "0";
      }
      if (dotRef.current) {
        dotRef.current.style.opacity = visible ? "1" : "0";
      }
      frame = requestAnimationFrame(render);
    };

    const onMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      visible = true;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input, textarea, select")) {
        setMode("hidden");
        return;
      }
      if (target?.closest("[data-cursor='view']")) {
        setMode("view");
        return;
      }
      if (target?.closest("a, button, [data-cursor='hover']")) {
        setMode("hover");
        return;
      }
      setMode("default");
    };

    const onLeave = () => {
      visible = false;
    };

    frame = requestAnimationFrame(render);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      delete root.dataset.cursor;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fx-cursor pointer-events-none fixed inset-0 z-[90] hidden lg:block" aria-hidden>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 size-1.5 rounded-full bg-lime opacity-0 shadow-[0_0_0_1px_rgb(20_23_19_/_0.45)]"
      />
      <div ref={ringRef} className="fixed left-0 top-0 opacity-0">
        <div
          className={cn(
            "grid place-items-center rounded-full border transition-[width,height,background-color,border-color] duration-300",
            mode === "view" && "size-28 border-lime bg-ink/55 text-paper",
            mode === "hover" && "size-16 border-lime",
            mode === "default" && "size-11 border-paper/70",
            mode === "hidden" && "size-0 border-transparent",
          )}
        >
          <span
            className={cn(
              "font-accent text-[11px] tracking-[0.16em]",
              mode === "view" ? "opacity-100" : "opacity-0",
            )}
          >
            VIEW ↗
          </span>
        </div>
      </div>
    </div>
  );
}
