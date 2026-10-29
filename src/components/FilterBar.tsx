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
    { label: "All Objects", value: "all" },
    { label: "Seating", value: "seating" },
    { label: "Tables & Desks", value: "tables" },
    { label: "Storage", value: "storage" },
    { label: "Studio Objects (< 10 lbs)", value: "studio-objects" },
  ];

  return (
    <div id="catalog" className="sticky top-[78px] z-30 transition-all py-3">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="ff-glass rounded-2xl p-2.5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between shadow-xs">
          {/* FF-Shop style rounded pill categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => onSelectCategory(cat.value)}
                  className={`rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "ff-pill-active font-semibold shadow-xs"
                      : "ff-pill text-zinc-600 hover:text-zinc-950"
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
            <div className="flex items-center rounded-full bg-zinc-100/80 p-1 text-xs font-mono-spec border border-zinc-200/60 shadow-2xs">
              <button
                onClick={() => onSelectWeightFilter("all")}
                className={`rounded-full px-3 py-1 transition-all ${
                  weightFilter === "all"
                    ? "bg-white text-zinc-950 font-bold shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => onSelectWeightFilter("under10")}
                className={`rounded-full px-3 py-1 transition-all ${
                  weightFilter === "under10"
                    ? "bg-emerald-600 text-white font-bold shadow-xs"
                    : "text-emerald-700 hover:text-emerald-900"
                }`}
              >
                &lt; 10 lbs (Ships)
              </button>
              <button
                onClick={() => onSelectWeightFilter("over10")}
                className={`rounded-full px-3 py-1 transition-all ${
                  weightFilter === "over10"
                    ? "bg-amber-400 text-zinc-950 font-bold shadow-xs"
                    : "text-amber-800 hover:text-zinc-900"
                }`}
              >
                &gt; 10 lbs (Pickup)
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-full bg-zinc-100/80 p-1 text-xs font-mono-spec border border-zinc-200/60 shadow-2xs">
              <button
                onClick={() => onSelectViewMode("grid")}
                aria-label="Grid View"
                className={`rounded-full px-3 py-1 flex items-center gap-1.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-zinc-950 font-bold shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="7" height="7" x="3" y="3" rx="1.5" />
                  <rect width="7" height="7" x="14" y="3" rx="1.5" />
                  <rect width="7" height="7" x="14" y="14" rx="1.5" />
                  <rect width="7" height="7" x="3" y="14" rx="1.5" />
                </svg>
                <span>Grid</span>
              </button>
              <button
                onClick={() => onSelectViewMode("table")}
                aria-label="Spec Sheet View"
                className={`rounded-full px-3 py-1 flex items-center gap-1.5 transition-all ${
                  viewMode === "table"
                    ? "bg-white text-zinc-950 font-bold shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </svg>
                <span>Specs</span>
              </button>
            </div>

            <span className="hidden sm:inline-block text-xs font-mono-spec text-zinc-400 pl-1">
              ({totalCount})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
