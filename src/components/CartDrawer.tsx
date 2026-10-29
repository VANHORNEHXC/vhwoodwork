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
    grandTotalCents,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        <div className="w-screen max-w-md glass-luxury rounded-l-3xl p-6 sm:p-8 shadow-2xl flex flex-col font-sans-luxury">
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-zinc-200/60">
            <div className="flex items-baseline gap-2.5">
              <span className="font-roffelia font-normal text-2xl text-zinc-950">Acquisitions Bag</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-mono-luxury text-zinc-600">
                {totalItems} works
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close bag drawer"
              className="rounded-full bg-zinc-100/80 hover:bg-zinc-200 text-zinc-700 h-8 w-8 flex items-center justify-center transition-colors shadow-2xs"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Luxury Weight & Fulfillment Directive Notice */}
          <div className={`mt-4 rounded-2xl p-4 text-xs ${
            requiresPickup
              ? "bg-amber-50/90 border border-amber-200/80 text-amber-950"
              : "bg-emerald-50/70 border border-emerald-200/60 text-emerald-950"
          }`}>
            <div className="flex items-center gap-2 font-medium font-mono-luxury text-[11px] uppercase tracking-wider">
              <span className="inline-block h-2 w-2 rounded-full bg-current animate-pulse" />
              <span>
                {requiresPickup
                  ? `Atelier Collection Required (${totalWeightLbs} lbs)`
                  : `Insured Nationwide Eligible (${totalWeightLbs} lbs)`}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed font-sans-luxury">
              {requiresPickup
                ? "This acquisition includes solid hardwood pieces exceeding 10 lbs. Studio collection in Coral Springs is required; the address is shared after confirmation."
                : "Your acquisition weighs under 10 lbs. You may select complimentary insured nationwide parcel delivery or private studio collection in Coral Springs."}
            </p>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto my-4 space-y-3.5 pr-1">
            {items.length === 0 ? (
              <div className="py-28 text-center font-sans-luxury text-xs text-zinc-400">
                <p className="font-roffelia font-normal text-xl text-zinc-700 mb-1">Your bag is empty</p>
                <p>Explore our handcrafted heirloom furniture and studio objects.</p>
              </div>
            ) : (
              items.map((item) => {
                const itemIsHeavy = item.product.weightLbs >= 10;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3.5 rounded-2xl p-3.5 bg-white/80 border border-zinc-200/50 shadow-2xs"
                  >
                    <div className="relative h-20 w-20 shrink-0 rounded-xl bg-zinc-100 overflow-hidden shadow-2xs">
                      <Image
                        unoptimized
                        src={item.product.primaryImage}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-roffelia font-normal text-base text-zinc-950 leading-tight">
                            {item.product.name}
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            aria-label="Remove piece"
                            className="text-zinc-400 hover:text-zinc-700 text-xs px-1"
                          >
                            ×
                          </button>
                        </div>
                        <div className="mt-0.5 text-[11px] font-sans-luxury text-zinc-500">
                          {item.product.woodSpecies}
                        </div>
                        <div className="mt-1">
                          {itemIsHeavy ? (
                            <span className="inline-block rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 text-[9px] font-mono-luxury font-medium">
                              {item.product.weightLbs} lbs &bull; Atelier Pickup (FL)
                            </span>
                          ) : (
                            <span className="inline-block rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300/60 px-2.5 py-0.5 text-[9px] font-mono-luxury font-medium">
                              {item.product.weightLbs} lbs &bull; Insured Transit
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 text-xs">
                        <div className="flex items-center rounded-full bg-zinc-100/80 p-0.5 font-mono-luxury">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-6 w-6 rounded-full hover:bg-white flex items-center justify-center transition-colors"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-medium text-[11px]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-6 w-6 rounded-full hover:bg-white flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-mono-luxury font-medium text-zinc-950">
                          ${((item.product.priceCents * item.quantity) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
              <span className="font-mono-luxury text-[10px] uppercase tracking-widest text-zinc-400 block">
                Fulfillment Protocol
              </span>

              <div className="space-y-1.5">
                {/* Nationwide shipping option */}
                <label
                  className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-all ${
                    requiresPickup
                      ? "border-zinc-200 bg-zinc-100/50 text-zinc-400 cursor-not-allowed opacity-50"
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
                      <span>Complimentary Insured Nationwide Transit</span>
                      <span className="font-mono-luxury font-medium">
                        {subtotalCents > 30000 ? "Complimentary" : "$18.00"}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      Double-wall crating for works under 10 lbs
                    </p>
                    {requiresPickup && (
                      <p className="text-[10px] text-amber-700 font-medium mt-1">
                        Locked: Selection contains works exceeding 10 lbs limit.
                      </p>
                    )}
                  </div>
                </label>

                {/* Local studio pickup option */}
                <label
                  className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer ${
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
                      <span>Private Atelier Collection (Coral Springs, FL)</span>
                      <span className="font-mono-luxury text-emerald-800 font-medium">Complimentary</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      Coral Springs, FL &bull; By appointment
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Order Summary & Checkout CTAs */}
          {items.length > 0 && (
            <div className="pt-4 border-t border-zinc-200/60 mt-3 text-xs space-y-3">
              <div className="space-y-1 text-zinc-600 font-sans-luxury text-xs">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono-luxury font-medium text-zinc-950">${(subtotalCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fulfillment</span>
                  <span className="font-mono-luxury font-medium text-zinc-950">
                    {deliveryMethod === "pickup" ? "Atelier Collection (Free)" : `$${(shippingFeeCents / 100).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sales tax</span>
                  <span className="font-mono-luxury font-medium text-zinc-950">Confirmed before payment</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm font-semibold text-zinc-950 font-mono-luxury">
                  <span>Estimate before tax</span>
                  <span>${(grandTotalCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })} USD</span>
                </div>
              </div>

              {/* High-Class Payment Gateways */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => onOpenCheckout("stripe")}
                  className="w-full rounded-full bg-zinc-950 hover:bg-zinc-800 text-white py-3.5 px-4 font-sans-luxury text-xs tracking-wider uppercase font-medium flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                  <span>Request a Stripe invoice</span>
                </button>

                <button
                  onClick={() => onOpenCheckout("paypal")}
                  className="w-full rounded-full bg-[#ffc439] hover:bg-[#f6b720] text-[#003087] py-3.5 px-4 font-sans-luxury text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 border border-amber-300"
                >
                  <span className="italic font-black text-sm">PayPal</span>
                  <span className="text-zinc-900 font-semibold">&bull; Request an invoice</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
