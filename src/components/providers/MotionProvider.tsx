"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
  getMotionServerSnapshot,
  getMotionSnapshot,
  readMotionPreference,
  setMotionPreference,
  subscribeMotion,
} from "@/lib/motion";

type MotionContextValue = {
  motionEnabled: boolean;
  toggleMotion: () => void;
};

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: { children: ReactNode }) {
  const motionEnabled = useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    getMotionServerSnapshot,
  );

  const value = useMemo<MotionContextValue>(
    () => ({
      motionEnabled,
      toggleMotion: () => setMotionPreference(!readMotionPreference()),
    }),
    [motionEnabled],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error("useMotion must be used within MotionProvider");
  }
  return context;
}
