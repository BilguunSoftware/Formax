"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ctaLabel, mainNav } from "@/data/navigation";
import { scrollToHash } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/effects/MagneticButton";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useContact } from "@/components/providers/ContactProvider";

export function Header() {
  const pathname = usePathname();
  const { openContact } = useContact();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const closeMenu = useCallback(() => setOpen(false), []);
  const solid = scrolled || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const nodes = mainNav
      .map((link) => (link.id ? document.getElementById(link.id) : null))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    const url = new URL(href, window.location.origin);
    if (url.pathname === window.location.pathname && url.hash) {
      event.preventDefault();
      scrollToHash(url.hash);
      closeMenu();
    }
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500",
        solid
          ? "border-b border-paper/10 bg-ink/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[1600px] items-center justify-between px-4 lg:px-8">
        <Logo />

        <nav aria-label="Үндсэн цэс" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
          {mainNav.map((link) => {
            const id = link.id ?? "";
            const isActive =
              active === id || (id === "projects" && pathname.startsWith("/projects"));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => navigate(event, link.href)}
                className={cn(
                  "group relative font-accent text-[11px] uppercase tracking-[0.2em]",
                  isActive ? "text-lime" : "text-paper/80 hover:text-paper",
                )}
                aria-current={isActive ? "true" : undefined}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px bg-lime transition-transform duration-300 origin-left",
                    isActive ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={openContact}
                className="group inline-flex items-center gap-2 border border-paper/55 px-4 py-2 font-accent text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-lime hover:text-lime"
              >
                {ctaLabel}
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </button>
            </Magnetic>
          </div>

          <button
            type="button"
            className="relative grid size-11 place-items-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Цэс хаах" : "Цэс нээх"}
            onClick={() => setOpen((value) => !value)}
          >
            <span
              className={cn(
                "absolute h-px w-6 bg-paper transition-transform duration-300",
                open ? "translate-y-0 rotate-45" : "-translate-y-[5px]",
              )}
            />
            <span
              className={cn(
                "absolute h-px w-6 bg-paper transition-transform duration-300",
                open ? "translate-y-0 -rotate-45" : "translate-y-[5px]",
              )}
            />
          </button>
        </div>
      </div>
      <MobileMenu open={open} onClose={closeMenu} />
    </header>
  );
}
