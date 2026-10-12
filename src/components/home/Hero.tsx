"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { homeContent } from "@/data/content";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { gsap, registerGsap } from "@/lib/animations";
import { motionIsEnabled } from "@/lib/motion";
import { onReady } from "@/lib/ready";
import { scrollToHash } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/effects/MagneticButton";
import { useMotion } from "@/components/providers/MotionProvider";
import { CssArchitectureMark } from "@/components/three/FloatingGeometry";

const ArchitectureScene = dynamic(() => import("@/components/three/ArchitectureScene"), {
  ssr: false,
});

let webglSupport: boolean | null = null;

function canUseWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    webglSupport = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLParagraphElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { motionEnabled } = useMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const webgl = useSyncExternalStore(() => () => {}, canUseWebGL, () => false);
  const [inView, setInView] = useState(true);
  const show3d = desktop && webgl && motionEnabled;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.08,
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let context: ReturnType<typeof gsap.context> | null = null;
    const stop = onReady(() => {
      if (!motionIsEnabled()) return;
      registerGsap();
      context = gsap.context(() => {
        gsap.fromTo(
          "[data-hero-line]",
          { yPercent: 120 },
          { yPercent: 0, duration: 1.25, stagger: 0.08, ease: "expo.out" },
        );
        gsap.fromTo(
          "[data-hero-panel]",
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.35, stagger: 0.14, ease: "power4.inOut" },
        );
        gsap.from("[data-hero-fade]", {
          autoAlpha: 0,
          y: 28,
          stagger: 0.08,
          duration: 0.9,
          delay: 0.35,
          ease: "power3.out",
        });
      }, section);
    });
    return () => {
      stop();
      context?.revert();
    };
  }, [motionEnabled]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const layers = [...section.querySelectorAll<HTMLElement>("[data-depth]")];
    if (!motionEnabled || !inView) {
      if (coordRef.current) coordRef.current.textContent = "X 12.40  /  Y 08.16  /  Z 03.02";
      layers.forEach((layer) => {
        layer.style.transform = "";
      });
      return;
    }

    let frame = 0;
    const current = { x: 0, y: 0 };
    const interactive = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;

    const loop = () => {
      if (!document.hidden && interactive) {
        current.x += (mouse.current.x - current.x) * 0.065;
        current.y += (mouse.current.y - current.y) * 0.065;
        if (coordRef.current) {
          coordRef.current.textContent = `X ${(12.4 + current.x * 2.4).toFixed(2)}  /  Y ${(8.16 + current.y * 1.7).toFixed(2)}  /  Z ${(3.02 + current.x * 0.4).toFixed(2)}`;
        }
        for (const layer of layers) {
          const depth = Number(layer.dataset.depth || 0);
          const tilt = Number(layer.dataset.tilt || 0);
          layer.style.transform = `translate3d(${(current.x * depth).toFixed(2)}px, ${(current.y * depth).toFixed(2)}px, 0) rotateX(${(current.y * -tilt).toFixed(2)}deg) rotateY(${(current.x * tilt).toFixed(2)}deg)`;
        }
        if (glowRef.current) {
          const rect = section.getBoundingClientRect();
          glowRef.current.style.transform = `translate3d(${(current.x + 0.5) * rect.width - 280}px, ${(current.y + 0.5) * rect.height - 280}px, 0)`;
        }
      }
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [inView, motionEnabled, show3d]);

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || !motionIsEnabled()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouse.current = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    };
  }

  function onPointerLeave() {
    mouse.current = { x: 0, y: 0 };
  }

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-[100svh] overflow-hidden bg-ink text-paper"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="tech-grid grid-drift pointer-events-none absolute inset-0" aria-hidden />
      <div className="noise pointer-events-none absolute inset-0" aria-hidden />
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-0 top-0 size-[560px] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, rgb(215 250 101 / 0.22), transparent 68%)" }}
        aria-hidden
      />
      <span className="pointer-events-none absolute left-4 top-20 size-8 border-l border-t border-lime/80 lg:left-8" aria-hidden />
      <span className="pointer-events-none absolute right-4 top-20 size-8 border-r border-t border-lime/80 lg:right-8" aria-hidden />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1680px] flex-col px-4 pb-8 pt-24 sm:px-6 lg:px-8 lg:pb-6">
        <div className="relative min-h-0 flex-1 lg:[perspective:1400px]">
          <h1 className="relative z-30 max-w-[16rem] font-display text-[clamp(3.4rem,18vw,5.2rem)] font-black uppercase leading-[0.8] tracking-[-0.055em] sm:max-w-none lg:max-w-[78%] lg:text-[clamp(4.6rem,7.6vw,11rem)] lg:leading-[0.82]">
            {homeContent.hero.lines.map((line) => (
              <span key={line.text} className="block overflow-hidden pt-[0.05em]">
                <span
                  data-hero-line
                  className={cn(
                    "block",
                    line.variant === "outline" && "text-outline text-paper",
                    line.variant === "lime" && "text-lime",
                    line.variant === "fill" && "text-paper",
                  )}
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h1>

          <div className="absolute inset-y-0 right-0 z-10 w-[46%] sm:w-[42%] lg:inset-y-2 lg:w-[54%]">
            <div
              data-depth="34"
              data-tilt="7"
              className="absolute -left-[6%] top-[10%] hidden h-[48%] w-[52%] md:block"
            >
              <div data-hero-panel className="relative h-full -rotate-6 overflow-hidden border border-paper/25">
                <Image
                  src="/images/hero-secondary.jpg"
                  alt="Жишээ зураг: тайван интерьерийн фрагмент"
                  fill
                  sizes="28vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div data-depth="16" data-tilt="5" className="absolute inset-0 lg:inset-x-auto lg:left-[18%] lg:right-0 lg:top-0 lg:h-[78%]">
              <div data-hero-panel className="relative h-full overflow-hidden border border-paper/15 bg-panel">
                <Image
                  src="/images/hero-main.jpg"
                  alt="Жишээ зураг: гэрэлтэй орчин үеийн архитектурын фасад"
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-ink via-ink/70 to-transparent lg:w-2/5" />
              </div>
            </div>

            <p
              ref={coordRef}
              className="absolute left-3 top-3 z-20 hidden font-accent text-[10px] tracking-[0.16em] text-paper lg:block"
            >
              X 12.40 / Y 08.16 / Z 03.02
            </p>

            <div
              data-depth="22"
              data-tilt="4"
              className="pointer-events-none absolute right-[8%] top-[4%] z-20 hidden size-28 lg:block"
              aria-hidden
            >
              <div className="spin-slow size-full border border-lime/80" />
              <div className="absolute inset-3 border border-paper/30" />
            </div>

            <div
              data-depth="48"
              data-tilt="9"
              className="pointer-events-none absolute right-2 top-2 z-20 size-11 lg:right-[-2%] lg:top-[14%] lg:size-[22rem]"
            >
              {show3d ? <ArchitectureScene mouse={mouse} active={inView} /> : <CssArchitectureMark />}
            </div>

            <div
              data-depth="40"
              data-tilt="4"
              className="absolute bottom-2 left-2 z-20 w-[7.25rem] lg:bottom-[6%] lg:-left-10 lg:w-52"
            >
              <div data-hero-fade>
                <div className="bg-lime p-3 text-ink shadow-[0_24px_60px_rgb(0_0_0_/_0.28)] lg:-rotate-3 lg:p-4">
                  <p className="font-accent text-[10px] tracking-[0.22em]">{homeContent.hero.figure.index}</p>
                  <p className="mt-1.5 font-display text-[1.15rem] font-black leading-[0.82] lg:mt-2 lg:text-[2.6rem]">
                    {homeContent.hero.figure.title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                  <p className="mt-3 font-accent text-[9px] tracking-[0.16em]">{homeContent.hero.figure.meta}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-30 mt-4 border-t border-paper/15 pt-4 lg:mt-3 lg:pt-5">
          <p data-hero-fade className="font-accent text-[10px] uppercase tracking-[0.16em] text-lime sm:text-[11px] sm:tracking-[0.22em]">
            {homeContent.hero.kicker}
          </p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <p data-hero-fade className="min-w-0 flex-1 text-[0.9rem] leading-6 text-paper/85 sm:text-base lg:text-lg">
              {homeContent.hero.description[0]}
              <br />
              {homeContent.hero.description[1]}
            </p>
            <div data-hero-fade className="shrink-0">
            <Magnetic strength={0.48}>
              <a
                href="#projects"
                aria-label="EXPLORE WORK"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToHash("#projects");
                }}
                className="group relative grid size-[5.5rem] place-items-center rounded-full bg-lime text-center text-ink sm:size-[6.5rem] lg:size-[9.4rem]"
              >
                <span
                  className="spin-slow pointer-events-none absolute -inset-1.5 rounded-full border border-lime/50 lg:-inset-2"
                  aria-hidden
                />
                <span className="font-accent text-[10px] uppercase leading-tight tracking-[0.16em] lg:text-[11px]">
                  EXPLORE
                  <br />
                  WORK
                  <ArrowUpRight
                    className="mx-auto mt-1 size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </a>
            </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
