export function Footer() {
  return (
    <footer id="contact" className="border-t border-zinc-200/80 bg-white text-zinc-900 pt-16 pb-12 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Owner studio update */}
        <div className="ff-glass rounded-3xl p-8 sm:p-12 mb-16 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[11px] font-mono-sub tracking-widest text-zinc-400 uppercase block mb-2">
              Dario VanHorne &bull; Coral Springs
            </span>
            <h3 className="text-3xl sm:text-4xl font-editorial font-extrabold tracking-tight text-zinc-950">
              Follow the work as it takes shape.
            </h3>
          </div>

          <a href="https://www.instagram.com/dario.vanhorne/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-zinc-950 px-6 py-3 text-xs font-medium text-white transition-colors hover:bg-zinc-800">Dario on Instagram ↗</a>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-200/60 text-xs">
          {/* Column 1 */}
          <div className="space-y-3">
            <span className="font-editorial font-bold text-base text-zinc-950 block">
              VH WOODWORK
            </span>
            <p className="text-zinc-500 leading-relaxed font-sans text-xs">
              Solid wood furniture &amp; studio objects by Dario VanHorne. Based in Coral Springs, Florida.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            <span className="font-mono-sub text-[11px] text-zinc-400 uppercase tracking-widest block mb-1">
              Studio &amp; Delivery
            </span>
            <p className="text-zinc-700 leading-relaxed text-xs">
              Coral Springs, FL
            </p>
            <p className="text-zinc-500 text-[11px]">
              Shipping from Coral Springs
              <br />
              Local pickup by appointment; address shared after confirmation
            </p>
          </div>

          {/* Column 3 */}
          <div className="space-y-2">
            <span className="font-mono-sub text-[11px] text-zinc-400 uppercase tracking-widest block mb-1">
              Collection &amp; Delivery
            </span>
            <ul className="space-y-1.5 text-zinc-600 text-xs">
              <li>Insured nationwide shipping for eligible objects</li>
              <li>Studio collection for larger furniture</li>
              <li className="text-[11px] text-zinc-400 pt-1">
                Ask about local delivery options
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-2">
            <span className="font-mono-sub text-[11px] text-zinc-400 uppercase tracking-widest block mb-1">
              Payment
            </span>
            <p className="text-zinc-600 text-xs">
              Request an order through the shop. Payment is confirmed separately.
            </p>
            <p className="text-[10px] text-zinc-400 pt-1 font-mono-sub">
              Applicable sales tax is confirmed before payment.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-sub text-zinc-400">
          <div>
            &copy; {new Date().getFullYear()} VH Woodwork LLC &bull; Coral Springs, FL
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="https://www.instagram.com/dario.vanhorne/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900">Instagram ↗</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
