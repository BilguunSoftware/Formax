"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { homeContent } from "@/data/content";
import { gsap, registerGsap } from "@/lib/animations";
import { motionIsEnabled } from "@/lib/motion";
import { useMotion } from "@/components/providers/MotionProvider";

export function CinematicSection() {
  const ref = useRef<HTMLElement>(null);
  const { motionEnabled } = useMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || !motionEnabled || !motionIsEnabled()) return;
    registerGsap();
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-cine-image]",
        { scale: window.matchMedia("(max-width: 1023px)").matches ? 1.08 : 1.28 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.8 },
        },
      );
      gsap.fromTo(
        "[data-cine-frame]",
        { rotate: -8 },
        {
          rotate: 24,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1 },
        },
      );
      gsap.utils.toArray<HTMLElement>("[data-cine-line]").forEach((line, index) => {
        gsap.fromTo(
          line,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.15,
            delay: index * 0.08,
            ease: "expo.out",
            scrollTrigger: { trigger: "[data-cine-title]", start: "top 80%", once: true },
          },
        );
      });
      gsap.fromTo(
        "[data-cine-title]",
        { y: 48 },
        {
          y: -36,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.8 },
        },
      );
    }, root);
    return () => context.revert();
  }, [motionEnabled]);

  return (
    <section ref={ref} className="relative h-[100svh] bg-ink text-paper lg:h-[145svh]">
      <div className="relative h-[100svh] overflow-hidden lg:sticky lg:top-0 lg:min-h-[560px]">
        <div className="absolute inset-0 overflow-hidden">
          <div data-cine-image className="absolute inset-0">
            <Image
              src="/images/cinematic.jpg"
              alt="Жишээ зураг: өргөн шилтэй орчин үеийн интерьер"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/35" />
        <div
          data-cine-frame
          className="pointer-events-none absolute left-[7%] top-[16%] hidden size-44 lg:block"
          aria-hidden
        >
          <div className="spin-slow absolute inset-0 border border-lime/80" />
          <div className="absolute inset-4 border border-paper/35" />
        </div>
        <p className="pointer-events-none absolute left-4 top-20 z-10 max-w-[12rem] font-accent text-[10px] uppercase leading-4 tracking-[0.18em] text-paper/75 lg:left-auto lg:right-0 lg:top-1/2 lg:max-w-none lg:-translate-y-1/2 lg:rotate-90 lg:tracking-[0.28em]">
          {homeContent.cinematic.diagonal}
        </p>
        <div data-cine-title className="absolute inset-x-0 bottom-0 z-10 px-4 pb-8 sm:px-6 lg:px-10 lg:pb-12">
          <h2 className="font-display text-[clamp(2.8rem,13vw,10.5rem)] font-black uppercase leading-[0.82] tracking-[-0.055em]">
            {homeContent.cinematic.lines.map((line, index) => (
              <span key={line} className="block overflow-hidden">
                <span
                  data-cine-line
                  className={
                    index === 1
                      ? "block text-lime lg:pl-[16vw]"
                      : index === 2
                        ? "block text-outline lg:pl-[6vw]"
                        : "block"
                  }
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}
