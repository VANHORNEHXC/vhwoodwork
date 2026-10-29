"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/store";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
}

export function ProductCard({ product, onOpenQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isPickupOnly = product.weightLbs >= 10;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <article
      onClick={() => onOpenQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col ff-card rounded-2xl p-3 cursor-pointer transition-all duration-300"
    >
      {/* Image Container with FF-Shop rounded geometry and smooth zoom */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={isHovered ? product.secondaryImage : product.primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* FF-Shop Floating Glass Pills */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10 pointer-events-none">
          {/* Weight & Pickup Rule Pill */}
          {isPickupOnly ? (
            <span className="rounded-full bg-amber-400/90 text-zinc-950 backdrop-blur-md px-3 py-1 text-[10px] font-mono-spec font-semibold shadow-xs border border-amber-300/80">
              {product.weightLbs} lbs • Local Pickup
            </span>
          ) : (
            <span className="rounded-full bg-emerald-50/90 text-emerald-900 backdrop-blur-md px-3 py-1 text-[10px] font-mono-spec font-medium shadow-xs border border-emerald-300/60">
              {product.weightLbs} lbs • Ships US
            </span>
          )}

          {/* Lot Number */}
          <span className="rounded-full bg-black/60 text-white backdrop-blur-md px-2.5 py-1 text-[10px] font-mono-spec tracking-wider border border-white/20">
            {product.lotNumber}
          </span>
        </div>

        {/* Hover Quick View Button (FF-Shop style pill overlay) */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="rounded-full ff-glass px-5 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-950 hover:text-white transition-all shadow-md active:scale-95 flex items-center gap-1.5"
          >
            <span>Quick Inspect</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editorial Content Below Image */}
      <div className="flex flex-col pt-3.5 px-1">
        {/* Title & Price */}
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display font-semibold text-base tracking-tight text-zinc-950 group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>
          <span className="font-mono-spec text-sm font-semibold text-zinc-900 shrink-0">
            ${(product.priceCents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}
          </span>
        </div>

        {/* Timber details */}
        <div className="mt-1 flex items-center justify-between text-xs text-zinc-500 font-mono-spec">
          <span className="truncate">{product.woodSpecies}</span>
          <span className="shrink-0 text-[11px] text-zinc-400 pl-2">{product.dimensions}</span>
        </div>

        {/* Direct Add to Bag Pill button */}
        <div className="mt-3 pt-2.5 border-t border-zinc-100/80 flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono-spec text-zinc-400 uppercase">
            {isPickupOnly ? "Fort Lauderdale, FL" : "Ready to dispatch"}
          </span>

          <button
            onClick={handleAddToCart}
            className={`rounded-full px-3.5 py-1.5 text-xs font-mono-spec transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 ${
              justAdded
                ? "bg-emerald-600 text-white font-medium"
                : "bg-zinc-100 hover:bg-zinc-950 text-zinc-800 hover:text-white font-medium"
            }`}
          >
            {justAdded ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Added</span>
              </>
            ) : (
              <>
                <span>Add</span>
                <span className="text-zinc-400 group-hover:text-zinc-300">+</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
