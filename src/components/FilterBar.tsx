"use client";

import React from "react";
import { WoodCategory } from "@/types/store";

interface FilterBarProps {
  selectedCategory: WoodCategory;
  onSelectCategory: (category: WoodCategory) => void;
  weightFilter: "all" | "under10" | "over10";
  onSelectWeightFilter: (filter: "all" | "under10" | "over10") => void;
  viewMode: "grid" | "table";
  onSelectViewMode: (mode: "grid" | "table") => void;
  totalCount: number;
}

export function FilterBar({
  selectedCategory,
  onSelectCategory,
  weightFilter,
  onSelectWeightFilter,
  viewMode,
  onSelectViewMode,
  totalCount,
}: FilterBarProps) {
  const categories: { label: string; value: WoodCategory }[] = [
    { label: "All Works", value: "all" },
    { label: "Seating", value: "seating" },
    { label: "Tables & Slabs", value: "tables" },
    { label: "Cabinetry", value: "storage" },
    { label: "Atelier Objects", value: "studio-objects" },
  ];

  return (
    <div id="collection" className="py-3">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass-luxury rounded-full px-5 py-2.5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between shadow-2xs">
          {/* Ben Young / WoodFurniture category selection */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => onSelectCategory(cat.value)}
                  className={`rounded-full px-4 py-1.5 text-xs font-sans-luxury tracking-wide whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? "glass-pill-active font-medium shadow-xs"
                      : "glass-pill-luxury text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Fulfillment Toggle & View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 border-t border-zinc-200/40 pt-2 lg:border-t-0 lg:pt-0">
            {/* Weight rules quick filter */}
            <div className="flex items-center rounded-full bg-zinc-100/70 p-1 text-xs font-mono-luxury border border-zinc-200/50 shadow-2xs">
              <button
                onClick={() => onSelectWeightFilter("all")}
                className={`rounded-full px-3 py-1 transition-all ${
                  weightFilter === "all"
                    ? "bg-white text-zinc-950 font-medium shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => onSelectWeightFilter("under10")}
                className={`rounded-full px-3 py-1 transition-all ${
                  weightFilter === "under10"
                    ? "bg-emerald-700 text-white font-medium shadow-2xs"
                    : "text-emerald-800 hover:text-emerald-950"
                }`}
              >
                Ships Nationwide
              </button>
              <button
                onClick={() => onSelectWeightFilter("over10")}
                className={`rounded-full px-3 py-1 transition-all ${
                  weightFilter === "over10"
                    ? "bg-amber-400 text-zinc-950 font-medium shadow-2xs"
                    : "text-amber-800 hover:text-zinc-900"
                }`}
              >
                Studio Pickup
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-full bg-zinc-100/70 p-1 text-xs font-mono-luxury border border-zinc-200/50 shadow-2xs">
              <button
                onClick={() => onSelectViewMode("grid")}
                aria-label="Gallery View"
                className={`rounded-full px-3 py-1 flex items-center gap-1.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-zinc-950 font-medium shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <span>Gallery</span>
              </button>
              <button
                onClick={() => onSelectViewMode("table")}
                aria-label="Dossier View"
                className={`rounded-full px-3 py-1 flex items-center gap-1.5 transition-all ${
                  viewMode === "table"
                    ? "bg-white text-zinc-950 font-medium shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <span>Dossier</span>
              </button>
            </div>

            <span className="hidden sm:inline-block text-[11px] font-mono-luxury text-zinc-400 pl-1">
              ({totalCount})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
