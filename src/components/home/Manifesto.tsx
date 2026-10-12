"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { homeContent } from "@/data/content";
import { gsap, registerGsap } from "@/lib/animations";
import { motionIsEnabled } from "@/lib/motion";
import { GeometricMark } from "@/components/effects/GeometricMark";
import { ImageMask } from "@/components/effects/ImageMask";
import { RevealText } from "@/components/effects/RevealText";
import { useMotion } from "@/components/providers/MotionProvider";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { motionEnabled } = useMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || !motionEnabled || !motionIsEnabled()) return;
    registerGsap();
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-mark]",
        { rotate: -12 },
        {
          rotate: 36,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1 },
        },
      );
      gsap.from("[data-metric]", {
        y: 36,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-metrics]", start: "top 82%", once: true },
      });
      gsap.from("[data-metric-line]", {
        scaleX: 0,
        transformOrigin: "left center",
        stagger: 0.12,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { trigger: "[data-metrics]", start: "top 82%", once: true },
      });
      gsap.from("[data-manifesto-copy]", {
        y: 24,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-manifesto-copy]", start: "top 86%", once: true },
      });
    }, root);
    return () => context.revert();
  }, [motionEnabled]);

  return (
    <section id="about" ref={ref} className="overflow-hidden bg-paper text-ink">
      <div className="mx-auto max-w-[1680px] px-4 py-16 sm:px-6 lg:px-8 lg:py-32">
        <p className="font-accent text-[11px] uppercase tracking-[0.24em] text-ink/45">
          {homeContent.manifesto.index}
        </p>

        <div className="relative mt-4 grid items-end lg:grid-cols-12">
          <div className="relative lg:col-span-5 lg:-mr-20">
            <div data-mark className="w-[56vw] max-w-[240px] lg:w-full lg:max-w-[480px]">
              <GeometricMark className="spin-slow w-full text-ink" />
            </div>
            <p className="mt-4 max-w-xs font-accent text-[10px] uppercase tracking-[0.2em] text-ink/40">
              AX-04 / FORM / FIELD
            </p>
          </div>

          <div className="relative z-10 lg:col-span-8 lg:col-start-5 lg:-mt-8">
            <RevealText
              lines={homeContent.manifesto.lines.map((text, index) => ({
                text,
                className: index === 1 || index === 3 ? "text-outline lg:pl-[6vw]" : "",
              }))}
              className="font-display text-[clamp(2.8rem,12.5vw,9.2rem)] font-black uppercase tracking-[-0.055em]"
            />
          </div>
        </div>

        <div className="mt-12 grid items-end gap-10 lg:mt-6 lg:grid-cols-12">
          <div data-manifesto-copy className="lg:col-span-5 lg:col-start-2">
            <p className="max-w-xl text-base leading-8 text-ink/80 lg:text-lg lg:leading-9">
              {homeContent.manifesto.body}
            </p>
            <p className="mt-5 font-accent text-[10px] uppercase tracking-[0.18em] text-ink/45">
              {homeContent.manifesto.note}
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:-mt-20">
            <ImageMask className="relative aspect-[16/10] bg-ink lg:aspect-[4/5]" direction="left">
              <Image
                src="/images/material.jpg"
                alt="Жишээ зураг: материалын гадаргуу"
                fill
                sizes="(max-width: 1024px) 100vw, 28vw"
                className="object-cover"
              />
            </ImageMask>
            <p className="mt-3 font-accent text-[10px] uppercase tracking-[0.18em] text-ink/45">
              MAT. 07 — SAMPLE SURFACE
            </p>
          </div>
        </div>
      </div>

      <div
        data-metrics
        className="mx-auto grid max-w-[1680px] gap-10 border-t border-ink/10 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8 lg:py-16"
      >
        {homeContent.manifesto.metrics.map((metric, index) => (
          <div key={metric.label} data-metric className={index === 1 ? "sm:mt-8" : index === 2 ? "sm:mt-3" : ""}>
            <span data-metric-line className="mb-5 block h-px w-full origin-left bg-ink" />
            <p className="font-display text-[clamp(3rem,6vw,5.5rem)] font-black leading-none tracking-[-0.05em]">
              {metric.value}
            </p>
            <p className="mt-3 font-accent text-[11px] uppercase tracking-[0.18em] text-ink/55">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
