"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { ProductCard } from "@/components/ProductCard";
import { ProductTable } from "@/components/ProductTable";
import { ProductModal } from "@/components/ProductModal";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { AboutSection } from "@/components/AboutSection";
import { ReviewSection } from "@/components/ReviewSection";
import { Footer } from "@/components/Footer";
import { PRODUCTS } from "@/data/products";
import { Product, WoodCategory } from "@/types/store";
import { CartProvider } from "@/context/CartContext";

function StoreContent() {
  const [selectedCategory, setSelectedCategory] = useState<WoodCategory>("all");
  const [selectedPlacement, setSelectedPlacement] = useState<"all" | "interior" | "exterior">("all");
  const [weightFilter, setWeightFilter] = useState<"all" | "under10" | "over10">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [checkoutMethod, setCheckoutMethod] = useState<"stripe" | "paypal" | null>(null);

  useEffect(() => {
    const placement = new URLSearchParams(window.location.search).get("placement");
    if (placement === "interior" || placement === "exterior") {
      queueMicrotask(() => setSelectedPlacement(placement));
    }
  }, []);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (selectedPlacement !== "all" && product.placement !== selectedPlacement) {
        return false;
      }
      // Category filter
      if (selectedCategory === "interior" || selectedCategory === "exterior") {
        if (product.placement !== selectedCategory) return false;
      } else if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
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
  }, [selectedCategory, selectedPlacement, weightFilter]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fcfbf9] text-zinc-950 font-sans-luxury selection:bg-amber-100 selection:text-zinc-900">
      {/* High-End Champagne Glassmorphism Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-[12%] h-[650px] w-[650px] rounded-full bg-amber-200/20 blur-[150px]" />
        <div className="absolute top-[35%] -right-24 h-[700px] w-[700px] rounded-full bg-stone-200/30 blur-[160px]" />
        <div className="absolute bottom-[10%] left-[20%] h-[750px] w-[750px] rounded-full bg-amber-100/25 blur-[160px]" />
      </div>

      <Header onSelectPlacement={setSelectedPlacement} selectedPlacement={selectedPlacement} />

      {/* Ben Young / WoodFurniture Serene Minimalist Hero */}
      <section className="pt-16 sm:pt-24 pb-14 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <span className="text-[10px] font-mono-luxury tracking-[0.28em] text-zinc-400 uppercase block">
              Fort Lauderdale Atelier &bull; Collection 2026
            </span>

            {/* Main Headline in ROFFELIA Luxury Serif */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-roffelia font-normal text-zinc-950 tracking-tight leading-[0.96]">
              Heirloom Timber &amp; Sculptural Form.
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 font-sans-luxury max-w-2xl mx-auto leading-relaxed pt-2">
              Bench-crafted in our South Florida workshop from single-origin American black walnut, Appalachian white oak, and century-old Florida river sinker cypress. Museum-grade joinery, zero veneers.
            </p>

          </div>
        </div>
      </section>

      {/* Discrete Horizontal Filter Bar */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        weightFilter={weightFilter}
        onSelectWeightFilter={setWeightFilter}
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
        totalCount={filteredProducts.length}
      />

      {/* Main Works Collection Grid */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-10 sm:px-6">
        {filteredProducts.length === 0 ? (
          <div className="py-32 text-center glass-luxury rounded-3xl p-12 font-sans-luxury shadow-xs max-w-md mx-auto">
            <p className="font-roffelia font-normal text-2xl text-zinc-800">No works match your selection</p>
            <p className="text-xs text-zinc-500 mt-2 font-mono-luxury">Adjust categories or weight rules to view the collection.</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedPlacement("all");
                setWeightFilter("all");
              }}
              className="mt-6 rounded-full bg-zinc-950 text-white text-xs font-sans-luxury uppercase tracking-wider px-6 py-2.5 font-medium hover:bg-zinc-800 transition-colors shadow-xs"
            >
              Reset Filter
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
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

      <AboutSection />
      <ReviewSection />

      {/* Footer */}
      <Footer />

      {/* Slide-over Bag Drawer */}
      <CartDrawer
        onOpenCheckout={(method) => {
          setCheckoutMethod(method);
        }}
      />

      {/* Quick View Modal */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Commercial Checkout Modal */}
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
