"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/store";
import { useCart } from "@/context/CartContext";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState<"primary" | "secondary">("primary");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<"specs" | "shipping" | "craft" | "">("specs");

  if (!product) return null;

  const isPickupOnly = product.weightLbs >= 10;
  const unavailable = !product.inStock || product.isSoldOut || product.stockCount < 1;

  const handleAddToCart = () => {
    if (unavailable) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-8 w-full max-w-4xl glass-luxury rounded-3xl p-6 sm:p-10 text-zinc-900 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating close pill */}
        <button
          onClick={onClose}
          aria-label="Close dossier"
          className="absolute top-6 right-6 z-20 rounded-full bg-zinc-100/80 hover:bg-zinc-200 text-zinc-700 h-9 w-9 flex items-center justify-center transition-colors shadow-2xs"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {/* Gallery Imagery */}
          <div className="flex flex-col gap-3.5">
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-[#f2f1ed] shadow-xs">
              <Image
                unoptimized
                src={selectedImage === "primary" ? product.primaryImage : product.secondaryImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-3 left-3">
                {isPickupOnly ? (
                  <span className="rounded-full bg-amber-400 text-zinc-950 px-3.5 py-1 text-[11px] font-mono-luxury font-medium shadow-xs">
                    Atelier Collection Required &bull; {product.weightLbs} lbs
                  </span>
                ) : (
                  <span className="rounded-full bg-white/90 text-zinc-900 px-3.5 py-1 text-[11px] font-mono-luxury font-medium shadow-xs">
                    Insured Nationwide Transit &bull; {product.weightLbs} lbs
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail switcher */}
            <div className="flex gap-2.5">
              <button
                onClick={() => setSelectedImage("primary")}
                className={`relative h-16 w-20 rounded-xl overflow-hidden transition-all ${
                  selectedImage === "primary" ? "ring-1 ring-zinc-950 shadow-xs" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image unoptimized src={product.primaryImage} alt="Primary" fill className="object-cover" />
              </button>
              <button
                onClick={() => setSelectedImage("secondary")}
                className={`relative h-16 w-20 rounded-xl overflow-hidden transition-all ${
                  selectedImage === "secondary" ? "ring-1 ring-zinc-950 shadow-xs" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image unoptimized src={product.secondaryImage} alt="Secondary detail" fill className="object-cover" />
              </button>
            </div>

            <div className="pt-2 text-xs font-mono-luxury text-zinc-400 flex items-center justify-between uppercase tracking-wider">
              <span>{product.lotNumber} &bull; {product.itemCode}</span>
              <span>Coral Springs Atelier</span>
            </div>
          </div>

          {/* Details in ROFFELIA Luxury Serif */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-3xl sm:text-4xl font-roffelia font-normal text-zinc-950 tracking-tight leading-tight">
                  {product.name}
                </h2>
                <span className="text-xl font-mono-luxury font-medium text-zinc-900 shrink-0">
                  ${(product.priceCents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })} USD
                </span>
              </div>

              <p className="mt-3 text-sm text-zinc-600 leading-relaxed font-sans-luxury">
                {product.description}
              </p>

              {/* Luxury Accordions */}
              <div className="mt-6 divide-y divide-zinc-200/60 border-t border-b border-zinc-200/60 font-sans-luxury">
                {/* Accordion 1: Specifications */}
                <div>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === "specs" ? "" : "specs")}
                    className="w-full py-3.5 flex items-center justify-between text-xs font-mono-luxury uppercase text-zinc-900 tracking-wider font-semibold"
                  >
                    <span>Material Provenance &amp; Joinery</span>
                    <span>{openAccordion === "specs" ? "−" : "+"}</span>
                  </button>
                  {openAccordion === "specs" && (
                    <div className="pb-4 grid grid-cols-2 gap-y-2.5 text-xs font-sans-luxury text-zinc-600">
                      <div>
                        <span className="text-zinc-400 block text-[10px] font-mono-luxury uppercase">Wood Species</span>
                        <span className="text-zinc-900 font-medium">{product.woodSpecies}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px] font-mono-luxury uppercase">Dimensions</span>
                        <span className="text-zinc-900 font-medium">{product.dimensions}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px] font-mono-luxury uppercase">Object Mass</span>
                        <span className="text-zinc-900 font-medium">{product.weightLbs} lbs</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px] font-mono-luxury uppercase">Surface Finish</span>
                        <span className="text-zinc-900 font-medium">{product.finish}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-zinc-100">
                        <span className="text-zinc-400 block text-[10px] font-mono-luxury uppercase">Structural Joinery</span>
                        <span className="text-zinc-900 font-medium">{product.joinery}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Fulfillment Directive */}
                <div>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === "shipping" ? "" : "shipping")}
                    className="w-full py-3.5 flex items-center justify-between text-xs font-mono-luxury uppercase text-zinc-900 tracking-wider font-semibold"
                  >
                    <span>Acquisition &amp; Coral Springs Pickup</span>
                    <span>{openAccordion === "shipping" ? "−" : "+"}</span>
                  </button>
                  {openAccordion === "shipping" && (
                    <div className="pb-4 text-xs font-sans-luxury text-zinc-600 space-y-2 leading-relaxed">
                      {isPickupOnly ? (
                        <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3.5 text-amber-950">
                          <strong className="block font-medium">Atelier Collection Only (Coral Springs, FL)</strong>
                          This work weighs {product.weightLbs} lbs. In accordance with studio policy, heavy architectural timber cannot be entrusted to standard parcel networks. Private pickup is arranged in Coral Springs; the address is shared after confirmation.
                        </div>
                      ) : (
                        <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5 text-zinc-900">
                          <strong className="block font-medium">Complimentary Insured Nationwide Transit</strong>
                          Weighs {product.weightLbs} lbs (&lt; 10 lbs). Custom-packaged in double-wall reinforced cartons with insured tracked delivery across the continental US, or available for atelier collection.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Purchase CTA */}
            <div className="mt-8 pt-4 flex items-center gap-3">
              <div className="flex items-center rounded-full bg-zinc-100/80 p-1 font-mono-luxury text-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-8 w-8 rounded-full hover:bg-white flex items-center justify-center transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                  className="h-8 w-8 rounded-full hover:bg-white flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={added || unavailable}
                className={`flex-1 rounded-full py-3.5 px-6 font-sans-luxury text-xs tracking-wider uppercase font-medium transition-all duration-300 shadow-md flex items-center justify-center gap-2 active:scale-98 ${
                  added
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-950 hover:bg-zinc-800 text-white"
                }`}
              >
                {unavailable ? (
                  <span>Sold Out</span>
                ) : added ? (
                  <span>Acquisition Confirmed ✓</span>
                ) : (
                  <span>
                    Acquire Work &bull; ${(product.priceCents * quantity / 100).toFixed(2)} USD
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
