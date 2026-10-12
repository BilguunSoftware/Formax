"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { homeContent } from "@/data/content";
import { services } from "@/data/services";
import { gsap, registerGsap } from "@/lib/animations";
import { motionIsEnabled } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { RevealText } from "@/components/effects/RevealText";
import { useMotion } from "@/components/providers/MotionProvider";

export function Services() {
  const [open, setOpen] = useState(services[0]?.id ?? "");
  const [hover, setHover] = useState<string | null>(null);
  const { motionEnabled } = useMotion();
  const rootRef = useRef<HTMLElement>(null);
  const preview = services.find((service) => service.id === (hover || open)) ?? services[0];

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !motionEnabled || !motionIsEnabled()) return;
    registerGsap();
    const context = gsap.context(() => {
      gsap.from("[data-service]", {
        y: 48,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
    }, root);
    return () => context.revert();
  }, [motionEnabled]);

  return (
    <section id="services" ref={rootRef} className="relative overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-[1680px] px-4 py-16 sm:px-6 lg:px-8 lg:py-32">
        <p className="font-accent text-[11px] uppercase tracking-[0.24em] text-sage">
          {homeContent.services.index}
        </p>
        <RevealText
          lines={homeContent.services.lines.map((text, index) => ({
            text,
            className: index === 1 ? "text-outline" : "",
          }))}
          className="mt-3 font-display text-[clamp(3.3rem,10vw,8.6rem)] font-black uppercase tracking-[-0.055em]"
        />

        <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="border-t border-paper/15 lg:col-span-8">
            {services.map((service) => {
              const expanded = open === service.id;
              return (
                <div
                  key={service.id}
                  data-service
                  className="border-b border-paper/15"
                  onMouseEnter={() => setHover(service.id)}
                  onMouseLeave={() => setHover(null)}
                >
                  <h3>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 py-5 text-left sm:gap-5 lg:gap-8 lg:py-7"
                      aria-expanded={expanded}
                      aria-controls={`service-${service.id}`}
                      onClick={() => setOpen((current) => (current === service.id ? "" : service.id))}
                    >
                      <span className="w-10 shrink-0 font-accent text-[12px] tracking-[0.16em] text-sage sm:w-12">
                        {service.index}
                      </span>
                      <span
                        className={cn(
                          "flex-1 font-display text-[clamp(1.7rem,6.4vw,4.6rem)] font-black leading-[0.88] tracking-[-0.045em] transition-colors duration-300",
                          expanded && "text-lime",
                        )}
                      >
                        {service.title}
                      </span>
                      <ArrowUpRight
                        className={cn(
                          "size-5 shrink-0 transition-transform duration-500 sm:size-6 lg:size-8",
                          expanded && "rotate-45 text-lime",
                        )}
                        aria-hidden
                      />
                    </button>
                  </h3>
                  <div
                    id={`service-${service.id}`}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]",
                      expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="grid gap-6 pb-8 lg:pb-10">
                        <p className="max-w-xl text-base leading-8 text-paper/80">{service.description}</p>
                        <ul className="space-y-2">
                          {service.points.map((point) => (
                            <li
                              key={point}
                              className="font-accent text-[11px] uppercase tracking-[0.16em] text-lime"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                        <div
                          className={cn(
                            "relative aspect-[16/10] overflow-hidden bg-panel lg:hidden",
                            expanded && "frame-in",
                          )}
                        >
                          <Image
                            src={service.image}
                            alt={service.imageAlt}
                            fill
                            sizes="100vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {preview ? (
            <div className="relative hidden lg:col-span-4 lg:block">
              <div className="sticky top-28">
                <div key={preview.id} className="frame-in relative aspect-[4/5] overflow-hidden border border-paper/15 bg-panel">
                  <Image
                    key={preview.id}
                    src={preview.image}
                    alt={preview.imageAlt}
                    fill
                    sizes="30vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-4 font-accent text-[11px] uppercase tracking-[0.18em] text-sage">
                  {preview.index} — {preview.title}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
