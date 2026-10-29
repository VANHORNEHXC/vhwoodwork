"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  onOpenCheckout: (method: "stripe" | "paypal") => void;
}

export function CartDrawer({ onOpenCheckout }: CartDrawerProps) {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    totalItems,
    subtotalCents,
    totalWeightLbs,
    requiresPickup,
    deliveryMethod,
    setDeliveryMethod,
    shippingFeeCents,
    taxCents,
    grandTotalCents,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        <div className="w-screen max-w-md ff-glass rounded-l-3xl p-6 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200/60">
            <div className="flex items-center gap-2.5">
              <span className="font-display font-bold text-lg text-zinc-950">Shopping Bag</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-mono-spec text-zinc-600">
                {totalItems} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close bag drawer"
              className="rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 h-8 w-8 flex items-center justify-center transition-colors shadow-2xs"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Weight & Fulfillment notice banner */}
          <div className={`mt-4 rounded-2xl p-3.5 text-xs ${
            requiresPickup
              ? "bg-amber-50/90 border border-amber-200 text-amber-950"
              : "bg-emerald-50/90 border border-emerald-200 text-emerald-950"
          }`}>
            <div className="flex items-center gap-2 font-semibold">
              <span className="inline-block h-2 w-2 rounded-full bg-current animate-pulse" />
              <span>
                {requiresPickup
                  ? `Studio Pickup Required (${totalWeightLbs} lbs total)`
                  : `Nationwide Eligible (${totalWeightLbs} lbs total)`}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-600 leading-relaxed font-sans">
              {requiresPickup
                ? "One or more furniture items exceed 10 lbs. Studio pickup at our Fort Lauderdale workshop is required to protect solid hardwood finishes."
                : "Your batch is under 10 lbs. You can choose tracked nationwide shipping or free studio pickup in Fort Lauderdale."}
            </p>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
            {items.length === 0 ? (
              <div className="py-24 text-center font-sans text-xs text-zinc-400">
                <p className="font-display font-semibold text-base text-zinc-700 mb-1">Your bag is empty</p>
                <p>Explore our handcrafted solid wood pieces.</p>
              </div>
            ) : (
              items.map((item) => {
                const itemIsHeavy = item.product.weightLbs >= 10;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3.5 rounded-2xl p-3 bg-white/80 border border-zinc-200/50 shadow-2xs"
                  >
                    <div className="relative h-20 w-20 shrink-0 rounded-xl bg-zinc-100 overflow-hidden shadow-2xs">
                      <Image
                        src={item.product.primaryImage}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-display font-semibold text-xs text-zinc-950 leading-tight">
                            {item.product.name}
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            aria-label="Remove item"
                            className="text-zinc-400 hover:text-zinc-700 text-xs px-1"
                          >
                            ×
                          </button>
                        </div>
                        <div className="mt-0.5 text-[11px] font-mono-spec text-zinc-400">
                          {item.product.woodSpecies}
                        </div>
                        <div className="mt-1">
                          {itemIsHeavy ? (
                            <span className="inline-block rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 text-[9px] font-mono-spec font-medium">
                              {item.product.weightLbs} lbs • Pickup Only
                            </span>
                          ) : (
                            <span className="inline-block rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 text-[9px] font-mono-spec font-medium">
                              {item.product.weightLbs} lbs • Ships
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs">
                        <div className="flex items-center rounded-full bg-zinc-100 p-0.5 font-mono-spec">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-6 w-6 rounded-full hover:bg-white flex items-center justify-center transition-colors"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-semibold text-[11px]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-6 w-6 rounded-full hover:bg-white flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-mono-spec font-semibold text-zinc-950">
                          ${((item.product.priceCents * item.quantity) / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Fulfillment Method Selector */}
          {items.length > 0 && (
            <div className="pt-3 border-t border-zinc-200/60 text-xs space-y-2">
              <span className="font-mono-spec text-[11px] uppercase text-zinc-400 tracking-wider block">
                Fulfillment Method
              </span>

              <div className="space-y-1.5">
                {/* Nationwide shipping option */}
                <label
                  className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all ${
                    requiresPickup
                      ? "border-zinc-200 bg-zinc-100/60 text-zinc-400 cursor-not-allowed opacity-50"
                      : deliveryMethod === "shipping"
                      ? "border-zinc-950 bg-white shadow-xs cursor-pointer text-zinc-900 ring-1 ring-zinc-950"
                      : "border-zinc-200/80 bg-white/60 hover:bg-white cursor-pointer text-zinc-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="shipping"
                    checked={deliveryMethod === "shipping"}
                    disabled={requiresPickup}
                    onChange={() => setDeliveryMethod("shipping")}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-medium">
                      <span>Nationwide Tracked Shipping</span>
                      <span className="font-mono-spec">{subtotalCents > 30000 ? "Free" : "$18.00"}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      USPS / UPS Ground (orders under 10 lbs)
                    </p>
                    {requiresPickup && (
                      <p className="text-[10px] text-amber-700 font-semibold mt-1">
                        Locked: Furniture exceeds 10 lbs limit.
                      </p>
                    )}
                  </div>
                </label>

                {/* Local studio pickup option */}
                <label
                  className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                    deliveryMethod === "pickup"
                      ? "border-zinc-950 bg-white ring-1 ring-zinc-950 shadow-xs text-zinc-900"
                      : "border-zinc-200/80 bg-white/60 hover:bg-white text-zinc-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={deliveryMethod === "pickup"}
                    onChange={() => setDeliveryMethod("pickup")}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-medium">
                      <span>Studio Pickup (Fort Lauderdale, FL)</span>
                      <span className="font-mono-spec text-emerald-700 font-semibold">Free</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      1104 NE 3rd Ave • Tue–Sat 10am–5pm
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Order Summary & Checkout CTAs */}
          {items.length > 0 && (
            <div className="pt-4 border-t border-zinc-200/60 mt-3 text-xs space-y-3">
              <div className="space-y-1 text-zinc-600 font-mono-spec text-xs">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-950">${(subtotalCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fulfillment</span>
                  <span className="font-semibold text-zinc-950">
                    {deliveryMethod === "pickup" ? "Studio Pickup (Free)" : `$${(shippingFeeCents / 100).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>FL Sales Tax (7%)</span>
                  <span className="font-semibold text-zinc-950">${(taxCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm font-bold text-zinc-950">
                  <span>Total</span>
                  <span>${(grandTotalCents / 100).toFixed(2)} USD</span>
                </div>
              </div>

              {/* Payment Gateways */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => onOpenCheckout("stripe")}
                  className="w-full rounded-full bg-zinc-950 hover:bg-zinc-800 text-white py-3 px-4 font-display text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                  <span>Pay with Stripe (Card / Apple Pay)</span>
                </button>

                <button
                  onClick={() => onOpenCheckout("paypal")}
                  className="w-full rounded-full bg-[#ffc439] hover:bg-[#f6b720] text-[#003087] py-3 px-4 font-display text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 border border-amber-300"
                >
                  <span className="italic font-black text-sm">PayPal</span>
                  <span className="text-zinc-900 font-semibold">• Commercial &amp; Pay in 4</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
