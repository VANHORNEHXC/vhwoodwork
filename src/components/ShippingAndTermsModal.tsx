"use client";

import React from "react";

interface ShippingAndTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShippingAndTermsModal({ isOpen, onClose }: ShippingAndTermsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md overflow-y-auto font-sans-luxury"
      onClick={onClose}
    >
      <div
        className="relative my-8 w-full max-w-3xl glass-luxury rounded-3xl p-8 sm:p-12 text-zinc-900 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Shipping and Terms"
          className="absolute top-6 right-6 rounded-full bg-zinc-100/80 hover:bg-zinc-200 text-zinc-700 h-9 w-9 flex items-center justify-center transition-colors shadow-2xs"
        >
          ✕
        </button>

        {/* Header */}
        <div className="border-b border-zinc-200/60 pb-6 mb-8">
          <span className="font-mono-luxury text-[10px] tracking-[0.25em] text-zinc-400 uppercase block mb-1">
            Studio Policy &bull; Coral Springs, FL
          </span>
          <h2 className="text-3xl sm:text-4xl font-roffelia font-normal text-zinc-950 tracking-tight">
            Shipping, Atelier Collection &amp; Terms
          </h2>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-xs sm:text-sm text-zinc-600 font-sans-luxury leading-relaxed">
          {/* Section 1: The Weight & Fulfillment Policy */}
          <div className="rounded-2xl bg-[#f9f8f5] border border-zinc-200/60 p-6 space-y-3">
            <h3 className="font-roffelia font-normal text-xl text-zinc-950">
              Fulfillment &bull; Weight Threshold Policy
            </h3>
            <p>
              To ensure every solid timber piece reaches its permanent residence in museum-grade condition, fulfillment is determined by object mass:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl bg-white border border-zinc-200/60 p-4">
                <span className="font-mono-luxury text-[11px] font-semibold text-emerald-800 uppercase block mb-1">
                  Objects under 10 lbs
                </span>
                <p className="text-xs text-zinc-600">
                  Precision cutting blocks, bookends, and studio objects ship nationwide via tracked and fully insured parcel carriage ($18 flat or complimentary on orders over $300).
                </p>
              </div>
              <div className="rounded-xl bg-white border border-amber-200/80 p-4">
                <span className="font-mono-luxury text-[11px] font-semibold text-amber-900 uppercase block mb-1">
                  Works 10 lbs or more
                </span>
                <p className="text-xs text-zinc-600">
                  Architectural furniture and heavy timber works are restricted to <strong>Local Studio Collection</strong> at our Coral Springs atelier to eliminate transit vibration and protect organic finishes.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Studio Pickup Details */}
          <div className="space-y-2">
            <h3 className="font-roffelia font-normal text-xl text-zinc-950">
              Coral Springs Atelier Collection
            </h3>
            <p>
              <strong>Collection area:</strong> Coral Springs, Florida. The exact address is shared when your appointment is confirmed.
            </p>
            <p>
              <strong>Collection hours:</strong> By appointment.
            </p>
            <p>
              Our atelier crew conditions every piece prior to your arrival, provides protective moving blankets, and assists with loading into your transport vehicle (SUV, covered truck, or van).
            </p>
            <p className="text-zinc-500 text-xs">Ask the studio about local delivery options when requesting an order.</p>
          </div>

          {/* Section 3: Commercial Payment & Florida Taxes */}
          <div className="space-y-2 pt-2 border-t border-zinc-200/50">
            <h3 className="font-roffelia font-normal text-xl text-zinc-950">
              Payment arrangements
            </h3>
            <p>
              Payment details are confirmed with each order:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-zinc-600">
              <li><strong>Stripe:</strong> A payment invoice can be requested through the order form.</li>
              <li><strong>PayPal:</strong> An invoice can be requested through the order form.</li>
              <li><strong>Sales Tax:</strong> Applicable tax is calculated after the delivery destination and order are reviewed, then confirmed before payment.</li>
            </ul>
          </div>
        </div>

        {/* Close Action */}
        <div className="mt-8 pt-6 border-t border-zinc-200/60 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-zinc-950 hover:bg-zinc-800 text-white px-8 py-3 text-xs font-sans-luxury uppercase tracking-wider font-medium shadow-xs transition-colors"
          >
            I Understand &bull; Return to Collection
          </button>
        </div>
      </div>
    </div>
  );
}

