"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { ProductCard } from "@/components/ProductCard";
import { ProductTable } from "@/components/ProductTable";
import { ProductModal } from "@/components/ProductModal";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { StudioBanner } from "@/components/StudioBanner";
import { Footer } from "@/components/Footer";
import { PRODUCTS } from "@/data/products";
import { Product, WoodCategory } from "@/types/store";
import { CartProvider } from "@/context/CartContext";

function StoreContent() {
  const [selectedCategory, setSelectedCategory] = useState<WoodCategory>("all");
  const [weightFilter, setWeightFilter] = useState<"all" | "under10" | "over10">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [checkoutMethod, setCheckoutMethod] = useState<"stripe" | "paypal" | null>(null);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "furniture") {
          if (product.category === "studio-objects") return false;
        } else if (product.category !== selectedCategory) {
          return false;
        }
      }

      // Weight rule filter (< 10 lbs vs >= 10 lbs)
      if (weightFilter === "under10" && product.weightLbs >= 10) {
        return false;
      }
      if (weightFilter === "over10" && product.weightLbs < 10) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, weightFilter]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#f7f7f5] text-zinc-950 font-sans selection:bg-amber-400 selection:text-black">
      {/* Ambient background light gradients for rich glassmorphism refraction */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-[10%] h-[500px] w-[500px] rounded-full bg-amber-500/8 blur-[120px]" />
        <div className="absolute top-[35%] -right-24 h-[600px] w-[600px] rounded-full bg-emerald-500/6 blur-[140px]" />
        <div className="absolute bottom-[10%] left-[25%] h-[550px] w-[550px] rounded-full bg-orange-500/7 blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <Header />

      {/* Hero Announcement & Workshop Statement with Frosted Glass */}
      <section className="border-b border-white/60 bg-white/50 backdrop-blur-xl px-4 py-10 sm:px-6 shadow-xs">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 border border-white/40 bg-zinc-950/90 backdrop-blur-md px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 mb-3 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>FLORIDA STUDIO INVENTORY // EDITION 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-zinc-950">
                SOLID WOOD FURNITURE &amp; STUDIO ARTIFACTS
              </h1>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed font-sans max-w-xl">
                Bench-made in Fort Lauderdale, Florida from kiln-dried Appalachian white oak, single-origin American walnut, and river-recovered sinker cypress. Built with mechanical honesty and zero veneers.
              </p>
            </div>

            {/* Tom Sachs style studio logistics card with Glassmorphic styling */}
            <div className="glass-card border border-white/80 p-5 font-mono text-xs max-w-md w-full shadow-md backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2 mb-2.5 font-bold uppercase">
                <span className="text-zinc-950">DISPATCH &amp; FULFILLMENT RULES</span>
                <span className="text-[10px] bg-zinc-950 text-white px-2 py-0.5 tracking-wider">FL PROTOCOL</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">&lt; 10 LBS:</span>
                  <span className="text-zinc-700">Nationwide parcel shipping (USPS/UPS) or local studio pickup.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-700 font-bold shrink-0">&gt; 10 LBS:</span>
                  <span className="text-zinc-900 font-semibold">
                    Studio Pickup ONLY at Fort Lauderdale workshop (1104 NE 3rd Ave).
                  </span>
                </div>
                <div className="flex items-start gap-2 pt-1.5 border-t border-zinc-200/50 text-[10px] text-zinc-500">
                  <span className="font-semibold text-zinc-700">PAYMENTS:</span>
                  <span className="text-zinc-700 font-medium">Stripe (Cards, Apple Pay) &amp; PayPal Commercial (Pay in 4).</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and View Controller */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        weightFilter={weightFilter}
        onSelectWeightFilter={setWeightFilter}
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
        totalCount={filteredProducts.length}
      />

      {/* Product Catalog Display */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6">
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-zinc-300 bg-white/50 backdrop-blur-md p-8 font-mono shadow-xs">
            <p className="text-sm font-bold uppercase text-zinc-700">NO PIECES MATCH CRITERIA</p>
            <p className="text-xs text-zinc-500 mt-1">Adjust category or weight filter parameters.</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setWeightFilter("all");
              }}
              className="mt-4 bg-zinc-950 text-white text-xs font-mono uppercase px-4 py-2 font-bold shadow-xs hover:bg-black transition-colors"
            >
              RESET FILTERS
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onOpenQuickView={setQuickViewProduct}
          />
        )}
      </main>

      {/* Studio Ethos & Florida Woodworking Banner */}
      <StudioBanner />

      {/* Footer */}
      <Footer />

      {/* Interactive Cart Slide-over Drawer */}
      <CartDrawer
        onOpenCheckout={(method) => {
          setCheckoutMethod(method);
        }}
      />

      {/* Quick View / Technical Spec Modal */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Commercial Checkout Modal (Stripe & PayPal) */}
      {checkoutMethod && (
        <CheckoutModal
          initialMethod={checkoutMethod}
          onClose={() => setCheckoutMethod(null)}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <StoreContent />
    </CartProvider>
  );
}
