"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { totalItems, grandTotalCents, totalWeightLbs, requiresPickup, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* FF-Shop style minimal notice ribbon */}
      <div className="border-b border-zinc-200/50 bg-[#f4f4f2]/90 backdrop-blur-md px-4 py-1.5 text-[11px] font-mono-spec tracking-wider text-zinc-600">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-zinc-900 uppercase">Fort Lauderdale Studio // 26.12° N, 80.13° W</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-700">
              Objects &lt; 10 lbs: Nationwide Shipping • Furniture &gt; 10 lbs: Studio Pickup (FL)
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-zinc-500 text-[10px] uppercase">
            <span>Stripe Verified</span>
            <span>•</span>
            <span>PayPal Commercial</span>
          </div>
        </div>
      </div>

      {/* Main Bar with Floating Frosted Glass */}
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="ff-glass rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-xs">
          {/* Brand Logo */}
          <a href="/" className="group flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-display font-bold tracking-tight text-zinc-950 group-hover:opacity-70 transition-opacity">
              VH WOODWORK
            </span>
            <span className="hidden sm:inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-mono-spec text-zinc-600 border border-zinc-200">
              EDITION 2026
            </span>
          </a>

          {/* Navigation link pills */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-zinc-600">
            <a href="#catalog" className="hover:text-zinc-950 transition-colors">Catalog</a>
            <a href="#about" className="hover:text-zinc-950 transition-colors">The Workshop</a>
            <a href="#shipping" className="hover:text-zinc-950 transition-colors">Pickup &amp; Shipping Policy</a>
            <a href="#contact" className="hover:text-zinc-950 transition-colors">Fort Lauderdale Studio</a>
          </nav>

          {/* Cart Trigger (FF-Shop signature rounded pill) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Shopping Bag"
              className="ff-pill rounded-full px-4 py-2 text-xs font-medium text-zinc-900 flex items-center gap-2.5 shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
            >
              <span className="flex items-center gap-1.5 font-display font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-zinc-700"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span>Bag</span>
              </span>

              <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-zinc-950 text-white text-[10px] font-mono-spec font-bold">
                {totalItems}
              </span>

              {totalItems > 0 && (
                <div className="hidden sm:flex items-center gap-2 border-l border-zinc-200 pl-2 text-xs">
                  <span className="font-semibold text-zinc-900 font-mono-spec">
                    ${(grandTotalCents / 100).toFixed(2)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-mono-spec font-semibold ${
                      requiresPickup
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    }`}
                  >
                    {totalWeightLbs} lbs {requiresPickup ? "• Pickup" : "• Ships"}
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
