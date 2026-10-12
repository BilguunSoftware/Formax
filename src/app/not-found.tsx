import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-[100svh] place-items-center bg-ink px-6 text-paper">
      <div className="max-w-xl">
        <p className="font-accent text-[11px] uppercase tracking-[0.22em] text-lime">404</p>
        <h1 className="mt-4 font-display text-6xl font-black leading-none tracking-[-0.05em] lg:text-8xl">
          Хуудас
          <br />
          олдсонгүй.
        </h1>
        <p className="mt-5 max-w-sm text-paper/70">Энэ хаяг дээр хуудас байхгүй байна.</p>
        <Link
          href="/"
          className="mt-8 inline-flex bg-lime px-5 py-3 font-accent text-[12px] uppercase tracking-[0.16em] text-ink"
        >
          Нүүр лүү буцах
        </Link>
      </div>
    </main>
  );
}
