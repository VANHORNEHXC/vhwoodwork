export function AboutSection() {
  return (
    <section id="about" className="border-t border-zinc-200/60 bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <span className="mb-4 block font-mono-luxury text-[10px] uppercase tracking-[0.25em] text-zinc-400">About the atelier</span>
          <h2 className="max-w-lg font-roffelia text-4xl leading-tight text-zinc-950 sm:text-5xl">Meet Dario VanHorne.</h2>
        </div>
        <div className="space-y-5 font-sans-luxury text-sm leading-7 text-zinc-600 sm:text-base">
          <p>Dario VanHorne owns VH Woodwork in Coral Springs, Florida. The atelier offers solid wood furniture and sculptural objects shaped around the character of the timber and the way each piece will be used.</p>
          <p>Our work brings together American black walnut, Appalachian white oak, and Florida river sinker cypress with careful joinery and considered finishes.</p>
          <a href="https://www.instagram.com/dario.vanhorne/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center border-b border-zinc-900 pb-1 text-sm font-medium text-zinc-900 transition-colors hover:text-amber-800">Follow Dario on Instagram <span aria-hidden="true" className="ml-2">↗</span></a>
          <div className="grid gap-5 border-t border-zinc-200/70 pt-6 font-mono-luxury text-[11px] uppercase tracking-wider text-zinc-500 sm:grid-cols-3">
            <span>Coral Springs, FL</span><span>Solid timber</span><span>Furniture &amp; objects</span>
          </div>
        </div>
      </div>
    </section>
  );
}
