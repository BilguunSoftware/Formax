"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMotion } from "@/components/providers/MotionProvider";

export function MotionToggle() {
  const { motionEnabled, toggleMotion } = useMotion();
  const systemReduced = useReducedMotion();

  return (
    <button
      type="button"
      onClick={toggleMotion}
      aria-pressed={motionEnabled}
      title={systemReduced ? "Систем дээр хөдөлгөөн багасгасан" : "Хөдөлгөөнийг асаах эсвэл унтраах"}
      className="fixed bottom-4 left-4 z-[45] border border-paper/25 bg-ink/80 px-3 py-2 font-accent text-[10px] uppercase tracking-[0.18em] text-paper backdrop-blur-md transition-colors hover:border-lime hover:text-lime"
    >
      Motion {motionEnabled ? "ON" : "OFF"}
    </button>
  );
}
