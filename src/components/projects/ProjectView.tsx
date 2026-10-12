"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categoryLabels, type Project } from "@/data/projects";
import { gsap, registerGsap } from "@/lib/animations";
import { motionIsEnabled } from "@/lib/motion";
import { ImageMask } from "@/components/effects/ImageMask";
import { useMotion } from "@/components/providers/MotionProvider";

type ProjectViewProps = {
  project: Project;
  nextProject: Project;
};

export function ProjectView({ project, nextProject }: ProjectViewProps) {
  const [active, setActive] = useState<number | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const { motionEnabled } = useMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !motionEnabled || !motionIsEnabled()) return;
    registerGsap();
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-project-visual]",
        { scale: 1.16 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-project-hero]",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
      gsap.fromTo(
        "[data-project-title]",
        { yPercent: 115 },
        { yPercent: 0, duration: 1.15, ease: "expo.out", delay: 0.08 },
      );
    }, root);
    return () => context.revert();
  }, [motionEnabled, project.slug]);

  useEffect(() => {
    if (active === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") {
        setActive((current) =>
          current === null ? current : (current + 1) % project.gallery.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setActive((current) =>
          current === null
            ? current
            : (current - 1 + project.gallery.length) % project.gallery.length,
        );
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, project.gallery.length]);

  const shot = active === null ? null : project.gallery[active];

  return (
    <article ref={rootRef} className="bg-ink text-paper">
      <header data-project-hero className="relative h-[100svh] min-h-[560px] overflow-hidden">
        <div data-project-visual className="absolute inset-0">
          <Image
            src={project.cover}
            alt={project.coverAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/30" />
        <div className="absolute left-4 top-24 z-10 flex items-center gap-4 lg:left-10">
          <Link href="/#projects" className="font-accent text-[11px] uppercase tracking-[0.18em]">
            ← Бүх төсөл
          </Link>
          <span className="bg-lime px-2 py-1 font-accent text-[10px] uppercase tracking-[0.14em] text-ink">
            Жишээ төсөл
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-10 lg:px-10">
          <p className="font-accent text-[12px] uppercase tracking-[0.2em] text-lime">
            {project.number} / {categoryLabels[project.category]} / {project.year}
          </p>
          <h1 className="mt-3 overflow-hidden font-display text-[clamp(3.2rem,12vw,9.5rem)] font-black leading-[0.82] tracking-[-0.055em]">
            <span data-project-title className="block">
              {project.name}
            </span>
          </h1>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1600px] gap-12 px-4 py-16 lg:grid-cols-12 lg:px-10 lg:py-24">
        <dl className="space-y-6 lg:col-span-4">
          <Meta label="Төрөл" value={categoryLabels[project.category]} />
          <Meta label="Он" value={project.year} />
          <Meta label="Байршил" value={project.location} />
          <Meta label="Талбай" value={`${project.area} · жишээ үзүүлэлт`} />
          <Meta label="Захиалагч" value={project.client} />
          <div>
            <dt className="font-accent text-[11px] uppercase tracking-[0.16em] text-sage">Материал</dt>
            <dd className="mt-2 text-sm leading-6 text-paper/80">{project.materials.join(" · ")}</dd>
          </div>
        </dl>
        <div className="lg:col-span-7 lg:col-start-6">
          <p className="text-xl leading-8 text-paper lg:text-2xl">{project.summary}</p>
          <div className="mt-8 space-y-5 text-base leading-8 text-paper/75">
            {project.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-8 border border-lime/40 px-4 py-3 text-sm leading-6 text-lime">
            Энэ хуудас нь загварын үзүүлэн. Нэр, он, зураг, талбай нь бодит гүйцэтгэсэн ажил биш.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-4 px-4 pb-20 lg:grid-cols-12 lg:px-10" aria-label="Зургийн цомог">
        {project.gallery.map((image, index) => (
          <button
            key={image.src + index}
            type="button"
            onClick={() => setActive(index)}
            className={
              index === 0
                ? "block w-full text-left lg:col-span-8 lg:mt-10"
                : index === 2
                  ? "block w-full text-left lg:col-span-5 lg:col-start-8 lg:-mt-16"
                  : "block w-full text-left lg:col-span-6"
            }
            aria-label={`Томруулах: ${image.alt}`}
          >
            <ImageMask
              className={index === 1 ? "relative aspect-[4/5] bg-panel" : "relative aspect-[16/10] bg-panel"}
              direction={index % 2 === 0 ? "up" : "left"}
              parallax={false}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </ImageMask>
          </button>
        ))}
      </section>

      <Link
        href={`/projects/${nextProject.slug}`}
        data-cursor="view"
        className="group relative block h-[70vh] min-h-[420px] overflow-hidden"
      >
        <Image
          src={nextProject.cover}
          alt=""
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="absolute inset-x-0 bottom-0 p-5 lg:p-10">
          <p className="font-accent text-[11px] uppercase tracking-[0.2em] text-lime">Дараагийн төсөл</p>
          <p className="mt-2 flex items-center gap-3 font-display text-[clamp(2.5rem,7vw,6rem)] font-black leading-none tracking-[-0.04em]">
            {nextProject.name}
            <ArrowUpRight className="size-8 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 lg:size-12" aria-hidden />
          </p>
        </div>
      </Link>

      {shot ? (
        <div
          className="fixed inset-0 z-[85] grid place-items-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={shot.alt}
        >
          <button type="button" className="absolute inset-0" aria-label="Хаах" onClick={() => setActive(null)} />
          <div className="relative z-10 aspect-[16/10] w-full max-w-5xl">
            <Image src={shot.src} alt={shot.alt} fill sizes="90vw" className="object-contain" />
          </div>
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 z-10 font-accent text-[12px] uppercase tracking-[0.16em]"
          >
            Хаах
          </button>
        </div>
      ) : null}
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-accent text-[11px] uppercase tracking-[0.16em] text-sage">{label}</dt>
      <dd className="mt-2 text-lg">{value}</dd>
    </div>
  );
}
