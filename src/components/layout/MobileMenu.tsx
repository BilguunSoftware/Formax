"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, registerGsap } from "@/lib/animations";
import { motionIsEnabled } from "@/lib/motion";
import { scrollToHash, lockScroll, unlockScroll } from "@/lib/scroll";
import { footerNav, ctaLabel } from "@/data/navigation";
import { useContact } from "@/components/providers/ContactProvider";
import { useMotion } from "@/components/providers/MotionProvider";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { openContact } = useContact();
  const { motionEnabled } = useMotion();

  const pathRef = useRef(pathname);
  useEffect(() => {
    if (pathRef.current !== pathname) {
      pathRef.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const panel = panelRef.current;
    if (panel && motionEnabled && motionIsEnabled()) {
      registerGsap();
      const context = gsap.context(() => {
        gsap.fromTo(
          "[data-menu-item]",
          { y: 32, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.055, duration: 0.7, ease: "expo.out" },
        );
      }, panel);
      return () => {
        context.revert();
        unlockScroll();
      };
    }
    return () => unlockScroll();
  }, [open, motionEnabled]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    const url = new URL(href, window.location.origin);
    if (url.pathname === window.location.pathname && url.hash) {
      event.preventDefault();
      onClose();
      window.setTimeout(() => scrollToHash(url.hash), 40);
      return;
    }
    onClose();
  }

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      id="mobile-nav"
      className="fixed inset-0 z-[60] flex flex-col bg-ink px-6 pb-10 pt-24 text-paper lg:hidden"
      data-lenis-prevent
    >
      <nav aria-label="Гар утасны цэс" className="flex flex-1 flex-col justify-center gap-2">
        {footerNav.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            data-menu-item
            onClick={(event) => navigate(event, link.href)}
            className="flex items-baseline gap-3 overflow-hidden font-display text-[clamp(2.4rem,11.5vw,4.6rem)] leading-[0.95] tracking-[-0.045em]"
          >
            <span className="font-accent text-[11px] tracking-[0.16em] text-lime">
              0{index + 1}
            </span>
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        data-menu-item
        onClick={() => {
          onClose();
          openContact();
        }}
        className="mt-8 w-fit border border-lime px-5 py-3 font-accent text-[12px] uppercase tracking-[0.18em] text-lime"
      >
        {ctaLabel} ↗
      </button>
    </div>
  );
}
