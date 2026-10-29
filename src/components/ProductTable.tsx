"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types/store";
import { useCart } from "@/context/CartContext";

interface ProductTableProps {
  products: Product[];
  onOpenQuickView: (product: Product) => void;
}

export function ProductTable({ products, onOpenQuickView }: ProductTableProps) {
  const { addItem } = useCart();

  return (
    <div className="overflow-x-auto glass-luxury rounded-3xl p-3 sm:p-5 shadow-xs">
      <table className="w-full text-left font-sans-luxury text-xs border-collapse">
        <thead>
          <tr className="border-b border-zinc-200/60 text-zinc-400 font-mono-luxury uppercase tracking-widest text-[10px]">
            <th className="p-3 w-16">Preview</th>
            <th className="p-3">Reference</th>
            <th className="p-3">Work Title</th>
            <th className="p-3 hidden md:table-cell">Timber &amp; Joinery</th>
            <th className="p-3 hidden lg:table-cell">Dimensions</th>
            <th className="p-3">Mass</th>
            <th className="p-3">Fulfillment Directive</th>
            <th className="p-3 text-right">Acquisition</th>
            <th className="p-3 text-center">Acquire</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100/80">
          {products.map((product) => {
            const isPickupOnly = product.weightLbs >= 10;
            return (
              <tr
                key={product.id}
                onClick={() => onOpenQuickView(product)}
                className="hover:bg-white/60 cursor-pointer transition-colors"
              >
                <td className="p-3">
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-zinc-100 shadow-2xs">
                    <Image
                      unoptimized
                      src={product.primaryImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="p-3 whitespace-nowrap font-mono-luxury text-[11px]">
                  <span className="font-semibold text-zinc-900 block">{product.lotNumber}</span>
                  <span className="text-[10px] text-zinc-400">{product.itemCode}</span>
                </td>
                <td className="p-3">
                  <div className="font-roffelia text-lg text-zinc-950 font-normal leading-tight">{product.name}</div>
                  <div className="text-[11px] text-zinc-400 truncate max-w-xs">{product.tagline}</div>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <div className="text-zinc-800 font-medium">{product.woodSpecies}</div>
                  <div className="text-[10px] text-zinc-400 font-mono-luxury">{product.joinery}</div>
                </td>
                <td className="p-3 hidden lg:table-cell text-zinc-600 whitespace-nowrap font-mono-luxury text-[11px]">
                  {product.dimensions}
                </td>
                <td className="p-3 whitespace-nowrap font-mono-luxury">
                  <span className={`font-medium ${isPickupOnly ? "text-amber-800" : "text-emerald-800"}`}>
                    {product.weightLbs} lbs
                  </span>
                </td>
                <td className="p-3 whitespace-nowrap">
                  {isPickupOnly ? (
                    <span className="inline-block rounded-full bg-amber-100/90 text-amber-950 border border-amber-300/60 px-2.5 py-0.5 text-[10px] font-mono-luxury">
                      Atelier Collection (FL)
                    </span>
                  ) : (
                    <span className="inline-block rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300/60 px-2.5 py-0.5 text-[10px] font-mono-luxury">
                      Insured Transit
                    </span>
                  )}
                </td>
                <td className="p-3 text-right font-mono-luxury font-medium text-sm whitespace-nowrap text-zinc-950">
                  ${(product.priceCents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })} USD
                </td>
                <td className="p-3 text-center whitespace-nowrap">
                  <button
                    disabled={!product.inStock || product.isSoldOut || product.stockCount < 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(product, 1);
                    }}
                    className="rounded-full bg-zinc-900 hover:bg-black text-white px-3 py-1.5 text-[11px] font-sans-luxury tracking-wide transition-all shadow-2xs active:scale-95"
                  >
                    {!product.inStock || product.isSoldOut || product.stockCount < 1 ? "Sold Out" : "+ Bag"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
