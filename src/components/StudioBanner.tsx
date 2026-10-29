"use client";

import React from "react";

export function StudioBanner() {
  return (
    <section className="border-t border-b border-white/10 glass-panel-dark backdrop-blur-xl text-zinc-100 py-12 px-4 sm:px-6 shadow-xl">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Studio Ethos */}
          <div className="space-y-3 font-mono border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-xs">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span>01 // THE FORT LAUDERDALE WORKSHOP</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white font-sans">
              HONEST TIMBER, ZERO VENEERS
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Every table, stool, bench, and studio object is milled, surfaced, and hand-joined in our Fort Lauderdale studio. We work exclusively with kiln-dried American hardwoods and Florida sinker cypress reclaimed from local waterways.
            </p>
          </div>

          {/* Column 2: The 10 LBS Protocol */}
          <div className="space-y-3 font-mono border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-xs">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span>02 // THE 10 LBS FULFILLMENT RULE</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white font-sans">
              CARE IN TRANSIT
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              <strong>Under 10 lbs:</strong> Precision kitchen blocks, bookends, catchalls, and small studio artifacts are double-boxed in reinforced cardboard and shipped nationwide.
              <br className="my-1" />
              <strong>Over 10 lbs:</strong> Solid heirloom furniture requires in-person studio pickup in Fort Lauderdale, FL to eliminate transit shocks and protect organic oil finishes.
            </p>
          </div>

          {/* Column 3: Commercial Payment & Commissions */}
          <div className="space-y-3 font-mono border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-xs">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span>03 // FLORIDA COMMERCIAL CHECKOUT</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white font-sans">
              STRIPE &amp; PAYPAL COMMERCIAL
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              As a Florida-registered enterprise, we offer instant encrypted payment processing via Stripe (Visa, MC, Amex, Apple Pay, Google Pay) and PayPal Commercial with flexible Pay-in-4 monthly installments for major furniture acquisitions.
            </p>
          </div>
        </div>

        {/* Technical spec strip */}
        <div className="mt-8 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">STUDIO ADDRESS:</span>
            <span>1104 NE 3rd Ave, Fort Lauderdale, FL 33304</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">HOURS:</span>
            <span>TUE–SAT 10:00 – 17:00 EST</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">CONTACT:</span>
            <span>studio@vhwoodwork.com • (954) 555-0182</span>
          </div>
        </div>
      </div>
    </section>
  );
}
