"use client";

import type { ReactNode } from "react";
import { ContactDrawer } from "@/components/contact/ContactDrawer";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { MotionToggle } from "@/components/effects/MotionToggle";
import { Preloader } from "@/components/effects/Preloader";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ContactProvider } from "@/components/providers/ContactProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <ContactProvider>
        <SmoothScroll>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:bg-lime focus:px-4 focus:py-2 focus:font-accent focus:text-[11px] focus:uppercase focus:tracking-[0.16em] focus:text-ink"
          >
            Агуулга руу алгасах
          </a>
          <Preloader />
          <ScrollProgress />
          <CustomCursor />
          <Header />
          {children}
          <Footer />
          <ContactDrawer />
          <MotionToggle />
        </SmoothScroll>
      </ContactProvider>
    </MotionProvider>
  );
}
