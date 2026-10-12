import { homeContent } from "@/data/content";

function Row() {
  return (
    <div className="flex shrink-0 items-center pr-8">
      {homeContent.marquee.map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center gap-8 pr-8">
          <span className={index === 1 ? "text-outline" : undefined}>{item}</span>
          <span aria-hidden>✳</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <section aria-hidden className="marquee overflow-hidden bg-lime py-4 text-ink lg:py-5">
      <div className="marquee-track flex w-max font-display text-[clamp(2.4rem,7vw,6.4rem)] font-black uppercase leading-none tracking-[-0.04em]">
        <Row />
        <Row />
      </div>
    </section>
  );
}
