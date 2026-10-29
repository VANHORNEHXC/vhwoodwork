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
    <div className="overflow-x-auto ff-glass rounded-2xl p-2 shadow-xs">
      <table className="w-full text-left font-mono-spec text-xs border-collapse">
        <thead>
          <tr className="border-b border-zinc-200/60 text-zinc-400 uppercase tracking-wider text-[10px]">
            <th className="p-3 w-16">Preview</th>
            <th className="p-3">Lot / Code</th>
            <th className="p-3">Object</th>
            <th className="p-3 hidden md:table-cell">Species &amp; Joinery</th>
            <th className="p-3 hidden lg:table-cell">Dimensions</th>
            <th className="p-3">Weight</th>
            <th className="p-3">Fulfillment</th>
            <th className="p-3 text-right">Price</th>
            <th className="p-3 text-center">Add</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
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
                      src={product.primaryImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span className="font-semibold text-zinc-900 block">{product.lotNumber}</span>
                  <span className="text-[10px] text-zinc-400">{product.itemCode}</span>
                </td>
                <td className="p-3">
                  <div className="font-display font-semibold text-zinc-950 text-sm">{product.name}</div>
                  <div className="text-[11px] text-zinc-400 truncate max-w-xs">{product.tagline}</div>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <div className="text-zinc-800 font-medium">{product.woodSpecies}</div>
                  <div className="text-[10px] text-zinc-400">{product.joinery}</div>
                </td>
                <td className="p-3 hidden lg:table-cell text-zinc-600 whitespace-nowrap">
                  {product.dimensions}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span className={`font-semibold ${isPickupOnly ? "text-amber-800" : "text-emerald-800"}`}>
                    {product.weightLbs} lbs
                  </span>
                </td>
                <td className="p-3 whitespace-nowrap">
                  {isPickupOnly ? (
                    <span className="inline-block rounded-full bg-amber-400/80 text-amber-950 px-2.5 py-0.5 text-[10px] font-semibold">
                      Pickup Only (FL)
                    </span>
                  ) : (
                    <span className="inline-block rounded-full bg-emerald-100/80 text-emerald-900 px-2.5 py-0.5 text-[10px] font-semibold">
                      Ships Nationwide
                    </span>
                  )}
                </td>
                <td className="p-3 text-right font-semibold text-sm whitespace-nowrap text-zinc-950">
                  ${(product.priceCents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}
                </td>
                <td className="p-3 text-center whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(product, 1);
                    }}
                    className="rounded-full bg-zinc-900 hover:bg-black text-white px-3 py-1.5 text-[11px] font-medium transition-all shadow-2xs active:scale-95"
                  >
                    + Bag
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
