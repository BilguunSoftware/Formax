"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  categoryLabels,
  projectFilters,
  projects,
  type Project,
  type ProjectFilter,
} from "@/data/projects";
import { homeContent } from "@/data/content";
import { gsap, registerGsap } from "@/lib/animations";
import { motionIsEnabled } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { RevealText } from "@/components/effects/RevealText";
import { useMotion } from "@/components/providers/MotionProvider";

function placement(project: Project, asymmetric: boolean) {
  if (!asymmetric) return "";
  if (project.slug === "monolith-house") return "lg:col-span-7 lg:row-span-2";
  if (project.slug === "quiet-matter") return "lg:col-span-5 lg:col-start-8 lg:-mt-[14vh]";
  return "lg:col-span-5 lg:col-start-7 lg:mt-[10vh]";
}

function ProjectCard({ project, tall }: { project: Project; tall: boolean }) {
  const cardRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  function onMove(event: MouseEvent<HTMLElement>) {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (document.documentElement.dataset.motion === "off") return;
    const card = cardRef.current;
    const image = imageRef.current;
    if (!card || !image) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`;
    image.style.transform = `scale(1.14) translate3d(${(-px * 22).toFixed(1)}px, ${(-py * 22).toFixed(1)}px, 0)`;
  }

  function onLeave() {
    const card = cardRef.current;
    const image = imageRef.current;
    if (card) card.style.transform = "rotateX(0deg) rotateY(0deg)";
    if (image) image.style.transform = "scale(1) translate3d(0, 0, 0)";
  }

  return (
    <Link href={`/projects/${project.slug}`} data-cursor="view" className="block">
      <article
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="transition-transform duration-500 ease-out [transform-style:preserve-3d]"
      >
        <div
          className={cn(
            "relative overflow-hidden bg-ink",
            tall ? "aspect-[4/5] lg:aspect-[3/4] lg:min-h-[82vh]" : "aspect-[4/5] lg:aspect-[5/4]",
          )}
        >
          <div data-photo-clip className="absolute inset-0">
            <div ref={imageRef} className="absolute inset-[-10%] transition-transform duration-700 ease-out">
              <Image
                src={project.cover}
                alt={project.coverAlt}
                fill
                sizes={tall ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 92vw, 42vw"}
                className="object-cover"
              />
            </div>
          </div>
          <span className="pointer-events-none absolute left-3 top-1 font-display text-[5.5rem] font-black leading-none text-paper mix-blend-difference lg:text-[7.5rem]">
            {project.number}
          </span>
          <span className="pointer-events-none absolute bottom-4 left-4 size-7 border-b border-l border-lime" aria-hidden />
          <ArrowUpRight
            className="absolute bottom-4 right-4 size-6 text-paper transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            aria-hidden
          />
        </div>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-[clamp(1.8rem,4vw,3.1rem)] font-black leading-none tracking-[-0.045em]">
              {project.name}
            </h3>
            <p className="mt-2 font-accent text-[11px] uppercase tracking-[0.16em] text-ink/55">
              {categoryLabels[project.category]}
            </p>
          </div>
          <p className="font-accent text-[12px] tracking-[0.14em]">{project.year}</p>
        </div>
      </article>
    </Link>
  );
}

export function FeaturedProjects() {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const { motionEnabled } = useMotion();
  const rootRef = useRef<HTMLElement>(null);
  const visible =
    filter === "all" ? projects : projects.filter((project) => project.category === filter);
  const asymmetric = filter === "all" && visible.length === projects.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !motionEnabled || !motionIsEnabled()) return;
    registerGsap();
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-photo-clip]").forEach((el, index) => {
        gsap.fromTo(
          el,
          { clipPath: index % 2 === 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 0% 100%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "power4.inOut",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });
    }, root);
    return () => context.revert();
  }, [motionEnabled, filter]);

  return (
    <section id="projects" ref={rootRef} className="bg-mist text-ink">
      <div className="mx-auto max-w-[1680px] px-4 py-16 sm:px-6 lg:px-8 lg:py-32">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="font-accent text-[11px] uppercase tracking-[0.24em] text-ink/45">
              {homeContent.projects.index}
            </p>
            <RevealText
              lines={homeContent.projects.lines.map((text, index) => ({
                text,
                className: index === 1 ? "text-outline lg:pl-[8vw]" : "",
              }))}
              className="mt-3 font-display text-[clamp(3.2rem,10vw,8.6rem)] font-black uppercase tracking-[-0.055em]"
            />
          </div>
          <p className="max-w-xs text-sm leading-7 text-ink/70 lg:mb-4">{homeContent.projects.note}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-1 gap-y-2 lg:mt-12" aria-label="Төслийн шүүлтүүр">
          {projectFilters.map((item) => {
            const selected = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(item.id)}
                className={cn(
                  "relative px-4 py-2.5 font-accent text-[11px] uppercase tracking-[0.16em] transition-colors",
                  selected ? "bg-ink text-lime" : "text-ink/65 hover:text-ink",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 items-start gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-10">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, y: motionEnabled ? 36 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: motionEnabled ? 0.5 : 0, ease: [0.16, 1, 0.3, 1] }}
                className={cn("group [perspective:1200px]", placement(project, asymmetric))}
              >
                <ProjectCard project={project} tall={asymmetric && project.slug === "monolith-house"} />
              </motion.div>
            ))}
          </AnimatePresence>
          {visible.length === 0 ? (
            <p className="lg:col-span-12">Энэ ангилалд жишээ төсөл алга.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
