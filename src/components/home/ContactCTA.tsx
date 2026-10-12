"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { homeContent } from "@/data/content";
import { gsap, registerGsap } from "@/lib/animations";
import { motionIsEnabled } from "@/lib/motion";
import { GeometricMark } from "@/components/effects/GeometricMark";
import { Magnetic } from "@/components/effects/MagneticButton";
import { RevealText } from "@/components/effects/RevealText";
import { useContact } from "@/components/providers/ContactProvider";
import { useMotion } from "@/components/providers/MotionProvider";

export function ContactCTA() {
  const { openContact } = useContact();
  const { motionEnabled } = useMotion();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !motionEnabled || !motionIsEnabled()) return;
    registerGsap();
    const context = gsap.context(() => {
      const masks = root.querySelectorAll<HTMLElement>("[data-mask]");
      masks.forEach((mask, index) => {
        gsap.fromTo(
          mask,
          { xPercent: index === 0 ? -4 : 8 },
          {
            xPercent: index === 0 ? 3 : -6,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1 },
          },
        );
      });
      gsap.fromTo(
        "[data-contact-mark]",
        { rotate: -18, scale: 0.92 },
        {
          rotate: 20,
          scale: 1.05,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1 },
        },
      );
    }, root);
    return () => context.revert();
  }, [motionEnabled]);

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden bg-lime text-ink">
      <div data-contact-mark className="pointer-events-none absolute -right-[18%] top-[6%] w-[78vw] max-w-[760px]">
        <GeometricMark className="spin-slow w-full text-ink/15" />
      </div>
      <div className="relative mx-auto flex max-w-[1680px] flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8 lg:py-36">
        <p className="font-accent text-[11px] uppercase tracking-[0.24em]">{homeContent.contact.index}</p>
        <RevealText
          lines={[
            { text: homeContent.contact.lines[0] ?? "ХАМТДАА", className: "text-outline" },
            {
              text: homeContent.contact.lines[1] ?? "БҮТЭЕ.",
              maskClassName: "lg:pl-[18vw]",
            },
          ]}
          className="font-display text-[clamp(3rem,14vw,12rem)] font-black uppercase tracking-[-0.06em]"
        />
        <div className="mt-2 flex flex-col items-start justify-between gap-8 lg:mt-6 lg:flex-row lg:items-end">
          <p className="max-w-xl font-display text-[clamp(1.6rem,4vw,3.4rem)] font-black leading-[0.95] tracking-[-0.04em]">
            {homeContent.contact.prompt}
          </p>
          <Magnetic strength={0.4}>
            <button
              type="button"
              onClick={openContact}
              className="group inline-flex items-center gap-3 bg-ink px-6 py-4 font-accent text-[12px] uppercase tracking-[0.18em] text-lime"
            >
              {homeContent.contact.cta}
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
