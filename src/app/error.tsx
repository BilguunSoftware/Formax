"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="grid min-h-[100svh] place-items-center bg-ink px-6 text-center text-paper">
      <div>
        <h1 className="font-display text-5xl font-black tracking-[-0.04em]">Алдаа гарлаа</h1>
        <p className="mt-4 text-paper/70">Хуудсыг дахин ачаалж үзнэ үү.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 bg-lime px-5 py-3 font-accent text-[12px] uppercase tracking-[0.16em] text-ink"
        >
          Дахин оролдох
        </button>
      </div>
    </main>
  );
}
