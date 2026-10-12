"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { footerNav } from "@/data/navigation";
import { gsap, registerGsap } from "@/lib/animations";
import { motionIsEnabled } from "@/lib/motion";
import { scrollToHash } from "@/lib/scroll";
import { useMotion } from "@/components/providers/MotionProvider";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { motionEnabled } = useMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || !motionEnabled || !motionIsEnabled()) return;
    registerGsap();
    const context = gsap.context(() => {
      gsap.from("[data-footer]", {
        y: 36,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.95,
        ease: "expo.out",
        scrollTrigger: {
          trigger: root,
          start: "top 86%",
          once: true,
        },
      });
      gsap.fromTo(
        "[data-footer-word]",
        { yPercent: 28 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-footer-word]",
            start: "top 96%",
            end: "bottom 80%",
            scrub: 0.7,
          },
        },
      );
    }, root);
    return () => context.revert();
  }, [motionEnabled]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (href === "/") {
      if (window.location.pathname === "/") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: motionIsEnabled() ? "smooth" : "auto" });
      }
      return;
    }
    const url = new URL(href, window.location.origin);
    if (url.pathname === window.location.pathname && url.hash) {
      event.preventDefault();
      scrollToHash(url.hash);
    }
  }

  return (
    <footer ref={ref} className="overflow-hidden bg-ink text-paper">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-16 lg:grid-cols-12 lg:px-10 lg:py-20">
        <div data-footer className="lg:col-span-5">
          <p className="font-accent text-[11px] uppercase tracking-[0.22em] text-sage">
            {siteConfig.tagline}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-paper/75">
            Жишээ зургууд нь Unsplash-аас авсан үзүүлэн. Бодит төсөл биш.
          </p>
        </div>
        <nav data-footer aria-label="Хөлний цэс" className="lg:col-span-3">
          <ul className="space-y-2">
            {footerNav.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={(event) => navigate(event, link.href)}
                  className="font-accent text-[12px] uppercase tracking-[0.16em] text-paper/80 transition-colors hover:text-lime"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <address data-footer className="not-italic lg:col-span-4">
          <a href={siteConfig.contact.phoneHref} className="block text-lg hover:text-lime">
            {siteConfig.contact.phone}
          </a>
          <a href={`mailto:${siteConfig.contact.email}`} className="mt-1 block hover:text-lime">
            {siteConfig.contact.email}
          </a>
          <p className="mt-3 text-sm text-paper/70">{siteConfig.contact.address}</p>
          <p className="mt-1 text-sm text-paper/50">{siteConfig.contact.hours}</p>
          <ul className="mt-5 flex flex-wrap gap-4">
            {siteConfig.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-accent text-[11px] uppercase tracking-[0.16em] text-sage hover:text-lime"
                >
                  {social.label}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </address>
      </div>

      <div className="overflow-hidden border-t border-paper/10 px-4 sm:px-6 lg:px-10">
        <p
          data-footer-word
          className="whitespace-nowrap font-display text-[22vw] leading-[0.8] tracking-[-0.06em] sm:text-[26vw]"
        >
          FORMA <span className="text-lime">✳</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 text-[11px] uppercase tracking-[0.16em] text-paper/45 lg:px-10">
        <span>© {siteConfig.copyrightYear} {siteConfig.name}</span>
        {siteConfig.credits.url ? (
          <a href={siteConfig.credits.url} className="hover:text-lime">
            {siteConfig.credits.text}
          </a>
        ) : (
          <span>{siteConfig.credits.text}</span>
        )}
      </div>
    </footer>
  );
}
