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
  const [openAccordion, setOpenAccordion] = useState<"specs" | "shipping" | "craft">("specs");

  if (!product) return null;

  const isPickupOnly = product.weightLbs >= 10;

  const handleAddToCart = () => {
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
        className="relative my-8 w-full max-w-4xl ff-glass rounded-3xl p-6 sm:p-8 text-zinc-900 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating close pill */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 z-20 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 h-9 w-9 flex items-center justify-center transition-colors shadow-2xs"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-zinc-100 shadow-xs">
              <Image
                src={selectedImage === "primary" ? product.primaryImage : product.secondaryImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-3 left-3">
                {isPickupOnly ? (
                  <span className="rounded-full bg-amber-400 text-zinc-950 px-3 py-1 text-[11px] font-mono-spec font-semibold shadow-xs">
                    Local Pickup Required • {product.weightLbs} lbs
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 text-emerald-900 px-3 py-1 text-[11px] font-mono-spec font-medium shadow-xs">
                    Ships Nationwide • {product.weightLbs} lbs
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail switcher */}
            <div className="flex gap-2.5">
              <button
                onClick={() => setSelectedImage("primary")}
                className={`relative h-16 w-20 rounded-xl overflow-hidden transition-all ${
                  selectedImage === "primary" ? "ring-2 ring-zinc-950 shadow-xs" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={product.primaryImage} alt="Primary" fill className="object-cover" />
              </button>
              <button
                onClick={() => setSelectedImage("secondary")}
                className={`relative h-16 w-20 rounded-xl overflow-hidden transition-all ${
                  selectedImage === "secondary" ? "ring-2 ring-zinc-950 shadow-xs" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={product.secondaryImage} alt="Secondary detail" fill className="object-cover" />
              </button>
            </div>

            <div className="pt-2 text-xs font-mono-spec text-zinc-500 flex items-center justify-between">
              <span>{product.lotNumber} • {product.itemCode}</span>
              <span>Fort Lauderdale, FL</span>
            </div>
          </div>

          {/* Details & Custom FF-Shop Accordions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-zinc-950">
                  {product.name}
                </h2>
                <span className="text-xl font-mono-spec font-bold text-zinc-900 shrink-0">
                  ${(product.priceCents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}
                </span>
              </div>

              <p className="mt-2 text-sm text-zinc-600 leading-relaxed font-sans">
                {product.description}
              </p>

              {/* FF-Shop Style Custom Accordions */}
              <div className="mt-6 divide-y divide-zinc-200/60 border-t border-b border-zinc-200/60">
                {/* Accordion 1: Technical Specs */}
                <div>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === "specs" ? ("" as any) : "specs")}
                    className="w-full py-3.5 flex items-center justify-between text-xs font-mono-spec uppercase text-zinc-900 font-semibold"
                  >
                    <span>Specifications &amp; Joinery</span>
                    <span>{openAccordion === "specs" ? "−" : "+"}</span>
                  </button>
                  {openAccordion === "specs" && (
                    <div className="pb-4 grid grid-cols-2 gap-y-2 text-xs font-mono-spec text-zinc-600">
                      <div>
                        <span className="text-zinc-400 block text-[10px] uppercase">Wood Species</span>
                        <span className="text-zinc-900 font-medium">{product.woodSpecies}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px] uppercase">Dimensions</span>
                        <span className="text-zinc-900 font-medium">{product.dimensions}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px] uppercase">Weight</span>
                        <span className="text-zinc-900 font-medium">{product.weightLbs} lbs</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px] uppercase">Finish</span>
                        <span className="text-zinc-900 font-medium">{product.finish}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-zinc-100">
                        <span className="text-zinc-400 block text-[10px] uppercase">Craft Joinery</span>
                        <span className="text-zinc-900 font-medium">{product.joinery}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Fulfillment Directive */}
                <div>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === "shipping" ? ("" as any) : "shipping")}
                    className="w-full py-3.5 flex items-center justify-between text-xs font-mono-spec uppercase text-zinc-900 font-semibold"
                  >
                    <span>Delivery &amp; Fort Lauderdale Pickup</span>
                    <span>{openAccordion === "shipping" ? "−" : "+"}</span>
                  </button>
                  {openAccordion === "shipping" && (
                    <div className="pb-4 text-xs font-sans text-zinc-600 space-y-1.5 leading-relaxed">
                      {isPickupOnly ? (
                        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-950">
                          <strong className="block font-medium">Studio Pickup Only (Fort Lauderdale, FL)</strong>
                          This piece weighs {product.weightLbs} lbs (over our 10 lbs parcel safety limit). You can schedule a pickup appointment at our studio (1104 NE 3rd Ave). Loading assist is provided.
                        </div>
                      ) : (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-950">
                          <strong className="block font-medium">Nationwide Shipping Available</strong>
                          Weighs {product.weightLbs} lbs (&lt; 10 lbs). Ships safely across the continental US via tracked parcel or available for free studio pickup in Fort Lauderdale, FL.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Purchase Row */}
            <div className="mt-6 pt-4 flex items-center gap-3">
              <div className="flex items-center rounded-full bg-zinc-100 p-1 font-mono-spec text-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-8 w-8 rounded-full hover:bg-white flex items-center justify-center transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-8 w-8 rounded-full hover:bg-white flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 rounded-full py-3 px-6 font-display text-sm font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2 active:scale-98 ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-950 hover:bg-zinc-800 text-white"
                }`}
              >
                {added ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span>
                    Add to Bag • ${(product.priceCents * quantity / 100).toFixed(2)} USD
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
