export function ReviewSection() {
  return (
    <section id="reviews" className="border-t border-zinc-200/60 bg-[#faf9f6] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 block font-mono-luxury text-[10px] uppercase tracking-[0.25em] text-zinc-400">From our clients</span>
          <h2 className="font-roffelia text-4xl leading-tight text-zinc-950 sm:text-5xl">Client Reviews</h2>
          <p className="mt-4 font-sans-luxury text-sm leading-relaxed text-zinc-600">A place for the people who live with our work to share their experience.</p>
        </div>
        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-zinc-200/70 bg-white px-8 py-12 text-center shadow-xs sm:px-14 sm:py-16">
          <span aria-hidden="true" className="font-roffelia text-6xl leading-none text-amber-700/40">“</span>
          <p className="mx-auto mt-2 max-w-md font-roffelia text-2xl leading-snug text-zinc-800 sm:text-3xl">Client stories are being gathered.</p>
          <p className="mx-auto mt-4 max-w-md font-sans-luxury text-sm leading-relaxed text-zinc-500">Reviews will appear here as clients share them with the atelier.</p>
        </div>
      </div>
    </section>
  );
}
