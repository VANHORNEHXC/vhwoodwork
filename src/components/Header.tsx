"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShippingAndTermsModal } from "@/components/ShippingAndTermsModal";

interface HeaderProps {
  onSelectPlacement?: (placement: "interior" | "exterior") => void;
  selectedPlacement?: "all" | "interior" | "exterior";
}

export function Header({ onSelectPlacement, selectedPlacement = "all" }: HeaderProps) {
  const { totalItems, grandTotalCents, totalWeightLbs, requiresPickup, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shippingTermsOpen, setShippingTermsOpen] = useState(false);

  const selectPlacement = (event: React.MouseEvent<HTMLAnchorElement>, placement: "interior" | "exterior") => {
    if (!onSelectPlacement) return;
    event.preventDefault();
    onSelectPlacement(placement);
    setMobileMenuOpen(false);
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
    <header className="relative z-10 w-full">
      {/* Main Luxury Glassmorphic Navigation Bar */}
      <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6">
        <div className="glass-luxury rounded-full px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          {/* Brand Logo in ROFFELIA Luxury Serif */}
          <Link href="/" className="group flex flex-col">
            <span className="font-roffelia text-2xl sm:text-3xl font-normal tracking-[0.14em] uppercase text-zinc-950 group-hover:opacity-75 transition-opacity">
              VH WOODWORK
            </span>
            <span className="text-[9px] font-mono-luxury tracking-[0.2em] text-zinc-400 uppercase -mt-1">
              Fine Timber Atelier &bull; Coral Springs
            </span>
          </Link>

          {/* Center Navigation Links (Ben Young / WoodFurniture Minimalist style) */}
          <nav className="hidden xl:flex items-center gap-5 text-[11px] font-sans-luxury tracking-[0.08em] uppercase text-zinc-600">
            <Link href="/?placement=interior#collection" onClick={(event) => selectPlacement(event, "interior")} aria-current={selectedPlacement === "interior" ? "page" : undefined} className="hover:text-zinc-950 transition-colors aria-[current=page]:text-zinc-950 aria-[current=page]:font-semibold">
              Interior
            </Link>
            <Link href="/?placement=exterior#collection" onClick={(event) => selectPlacement(event, "exterior")} aria-current={selectedPlacement === "exterior" ? "page" : undefined} className="hover:text-zinc-950 transition-colors aria-[current=page]:text-zinc-950 aria-[current=page]:font-semibold">
              Exterior
            </Link>
            <Link href="/#about" className="hover:text-zinc-950 transition-colors">
              About
            </Link>
            <button type="button" onClick={() => setShippingTermsOpen(true)} className="hover:text-zinc-950 transition-colors uppercase">Shipping and Terms</button>
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono-luxury text-zinc-500 pr-2 border-r border-zinc-200/80">
              <span>USD ($)</span>
            </div>

            {/* Shopping Bag Trigger in Frosted Luxury Pill */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Acquisitions Bag"
              className="glass-pill-luxury rounded-full px-4 py-2 text-xs font-sans-luxury tracking-wide text-zinc-900 flex items-center gap-2.5 shadow-2xs hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-1.5 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-zinc-700"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span>Bag</span>
              </div>

              <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-zinc-950 text-white text-[10px] font-mono-luxury font-medium">
                {totalItems}
              </span>

              {totalItems > 0 && (
                <div className="hidden sm:flex items-center gap-2 border-l border-zinc-200/80 pl-2 text-xs">
                  <span className="font-medium text-zinc-900 font-mono-luxury">
                    ${(grandTotalCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-mono-luxury uppercase ${
                      requiresPickup
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-emerald-50 text-emerald-900 border border-emerald-300/60"
                    }`}
                  >
                    {totalWeightLbs} lbs {requiresPickup ? "• Pickup" : "• Ships"}
                  </span>
                </div>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden glass-pill-luxury rounded-full h-9 w-9 flex items-center justify-center text-zinc-700"
              aria-label="Toggle Navigation"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-2 glass-luxury rounded-2xl p-5 flex flex-col gap-3.5 text-xs font-sans-luxury tracking-wider uppercase text-zinc-800 shadow-xl">
            <Link href="/?placement=interior#collection" onClick={(event) => selectPlacement(event, "interior")} className="py-1">
              Interior
            </Link>
            <Link href="/?placement=exterior#collection" onClick={(event) => selectPlacement(event, "exterior")} className="py-1">
              Exterior
            </Link>
            <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="py-1">
              About
            </Link>
            <button type="button" onClick={() => { setMobileMenuOpen(false); setShippingTermsOpen(true); }} className="py-1 text-left uppercase">Shipping and Terms</button>
          </div>
        )}
      </div>
    </header>
    <ShippingAndTermsModal isOpen={shippingTermsOpen} onClose={() => setShippingTermsOpen(false)} />
    </>
  );
}
