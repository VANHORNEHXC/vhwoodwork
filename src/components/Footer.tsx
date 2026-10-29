"use client";

import React, { useState } from "react";

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer id="contact" className="border-t border-zinc-200/80 bg-white text-zinc-900 pt-16 pb-12 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Newsletter Signup (FF-Shop signature) */}
        <div className="ff-glass rounded-3xl p-8 sm:p-12 mb-16 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[11px] font-mono-sub tracking-widest text-zinc-400 uppercase block mb-2">
              Studio Registry &bull; Fort Lauderdale
            </span>
            <h3 className="text-3xl sm:text-4xl font-editorial font-extrabold tracking-tight text-zinc-950">
              Receive notifications for upcoming timber releases and bespoke commissions.
            </h3>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="rounded-full px-5 py-3 text-xs font-mono-sub bg-white border border-zinc-200 text-zinc-950 focus:outline-hidden focus:border-zinc-950 min-w-[260px] shadow-2xs"
            />
            <button
              type="submit"
              className="rounded-full bg-zinc-950 hover:bg-zinc-800 text-white px-6 py-3 text-xs font-medium font-editorial transition-all shadow-xs active:scale-95 whitespace-nowrap"
            >
              {subscribed ? "Subscribed ✓" : "Join Register"}
            </button>
          </form>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-200/60 text-xs">
          {/* Column 1 */}
          <div className="space-y-3">
            <span className="font-editorial font-bold text-base text-zinc-950 block">
              VH WOODWORK
            </span>
            <p className="text-zinc-500 leading-relaxed font-sans text-xs">
              Hand-built solid wood furniture &amp; studio objects. Made in Fort Lauderdale, Broward County, Florida.
            </p>
            <div className="text-[11px] font-mono-sub text-zinc-400">
              26.1224° N, 80.1373° W
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            <span className="font-mono-sub text-[11px] text-zinc-400 uppercase tracking-widest block mb-1">
              Studio &amp; Hours
            </span>
            <p className="text-zinc-700 leading-relaxed text-xs">
              1104 NE 3rd Ave
              <br />
              Fort Lauderdale, FL 33304
            </p>
            <p className="text-zinc-500 text-[11px]">
              Tue–Sat: 10:00 – 17:00 EST
              <br />
              Local pickup by appointment
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
                Broward / Miami white-glove courier available on request
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-2">
            <span className="font-mono-sub text-[11px] text-zinc-400 uppercase tracking-widest block mb-1">
              Commercial Gateways
            </span>
            <p className="text-zinc-600 text-xs">
              Florida Merchant Account powered by:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-mono-sub text-zinc-700">
                Stripe Verified
              </span>
              <span className="rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[10px] font-mono-sub text-amber-900 font-bold">
                PayPal Commercial
              </span>
              <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-mono-sub text-zinc-700">
                Apple Pay
              </span>
              <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-mono-sub text-zinc-700">
                Pay in 4
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 pt-1 font-mono-sub">
              7% Florida Sales Tax applies to FL pickups/shipments.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-sub text-zinc-400">
          <div>
            &copy; {new Date().getFullYear()} VH Woodwork LLC &bull; Fort Lauderdale, FL
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy</span>
            <span>&bull;</span>
            <span>Terms of Acquisition</span>
            <span>&bull;</span>
            <span>Care Directive</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
