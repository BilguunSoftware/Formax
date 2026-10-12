import { motionIsEnabled } from "@/lib/motion";

type LenisLike = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; immediate?: boolean },
  ) => void;
  stop: () => void;
  start: () => void;
  destroy: () => void;
  raf: (time: number) => void;
  on: (event: "scroll", callback: () => void) => () => void;
};

let lenis: LenisLike | null = null;
let locks = 0;

export function setLenis(instance: LenisLike | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function scrollToHash(hash: string) {
  const id = hash.startsWith("#") ? hash : `#${hash}`;
  const el = document.querySelector(id);
  if (!(el instanceof HTMLElement)) return;

  if (lenis) {
    lenis.scrollTo(el, { offset: -88 });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({
    top,
    behavior: motionIsEnabled() ? "smooth" : "auto",
  });
}

export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0);
    return;
  }
  window.scrollTo({ top: 0, behavior: motionIsEnabled() ? "smooth" : "auto" });
}

export function lockScroll() {
  locks += 1;
  document.documentElement.style.overflow = "hidden";
  lenis?.stop();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.documentElement.style.overflow = "";
    lenis?.start();
  }
}
