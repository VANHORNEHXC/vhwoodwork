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
  const unavailable = !product.inStock || product.isSoldOut || product.stockCount < 1;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unavailable) return;
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <article
      onClick={() => onOpenQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col glass-card-luxury rounded-2xl p-3 sm:p-4 cursor-pointer"
    >
      {/* Sculptural Photographic Frame */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-[#f2f1ed]">
        <Image
          unoptimized
          src={isHovered ? product.secondaryImage : product.primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Quiet Luxury Glass Floating Pills */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
          {/* Fulfillment Directive Indicator */}
          {isPickupOnly ? (
            <span className="rounded-full bg-amber-400/90 text-zinc-950 backdrop-blur-md px-3 py-1 text-[10px] font-mono-luxury font-medium shadow-xs border border-amber-300/80">
              {product.weightLbs} lbs &bull; Atelier Collection (FL)
            </span>
          ) : (
            <span className="rounded-full bg-white/90 text-zinc-800 backdrop-blur-md px-3 py-1 text-[10px] font-mono-luxury font-medium shadow-xs border border-white/80">
              {product.weightLbs} lbs &bull; Insured Transit
            </span>
          )}

          {/* Series Number */}
          <span className="rounded-full bg-black/60 text-white backdrop-blur-md px-2.5 py-1 text-[10px] font-mono-luxury tracking-wider border border-white/20">
            {product.lotNumber}
          </span>
        </div>

        {/* Hover Quick Inspection Overlay Button */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="rounded-full glass-luxury px-5 py-2 text-xs font-sans-luxury tracking-wide text-zinc-900 hover:bg-zinc-950 hover:text-white transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <span>View Dossier</span>
            <span className="text-zinc-400">&rarr;</span>
          </button>
        </div>
      </div>

      {/* Editorial Content Below Image (Ben Young / WoodFurniture gallery style) */}
      <div className="flex flex-col pt-4 px-1">
        {/* Title in ROFFELIA Luxury Serif & Price */}
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-roffelia font-normal text-xl sm:text-2xl text-zinc-950 group-hover:text-amber-900 transition-colors tracking-tight leading-tight">
            {product.name}
          </h3>
          <span className="font-mono-luxury text-sm font-medium text-zinc-900 shrink-0">
            ${(product.priceCents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })} USD
          </span>
        </div>

        {/* Timber Specification & Dimensions */}
        <div className="mt-1.5 flex items-center justify-between text-xs text-zinc-500 font-sans-luxury">
          <span className="truncate">{product.woodSpecies}</span>
          <span className="shrink-0 text-[11px] text-zinc-400 pl-2 font-mono-luxury">{product.dimensions}</span>
        </div>

        {/* Discrete Acquisition Bar */}
        <div className="mt-4 pt-3 border-t border-zinc-200/50 flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono-luxury text-zinc-400 uppercase tracking-wider">
            {isPickupOnly ? "Coral Springs Atelier" : "Atelier Batch • Ready"}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={unavailable}
            className={`rounded-full px-4 py-1.5 text-xs font-sans-luxury transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 ${
              justAdded
                ? "bg-zinc-900 text-white font-medium"
                : "bg-zinc-100 hover:bg-zinc-950 text-zinc-800 hover:text-white font-medium"
            }`}
          >
            {unavailable ? (
              <span>Sold Out</span>
            ) : justAdded ? (
              <span>Acquisition Added ✓</span>
            ) : (
              <span>Acquire +</span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
