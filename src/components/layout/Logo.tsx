import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="FORMA X нүүр хуудас"
      className={cn("inline-flex items-center gap-2.5 text-paper", className)}
    >
      <span className="relative grid size-7 place-items-center" aria-hidden>
        <span className="spin-slow absolute inset-0 border border-current" />
        <span className="size-2.5 bg-lime" />
      </span>
      <span className="font-display text-[1.7rem] leading-none tracking-[-0.04em]">
        FORMA <span className="text-lime">X</span>
      </span>
    </Link>
  );
}
