export function GeometricMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M100 6 L116 84 L194 100 L116 116 L100 194 L84 116 L6 100 L84 84 Z" />
        <circle cx="100" cy="100" r="26" />
        <path d="M100 24 V176 M24 100 H176" />
      </g>
    </svg>
  );
}
