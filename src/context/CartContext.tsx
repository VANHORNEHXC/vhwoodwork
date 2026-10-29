"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, CartItem, DeliveryMethod, PickupDetails, ShippingDetails } from "@/types/store";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Weights and fulfillment logic
  totalItems: number;
  subtotalCents: number;
  totalWeightLbs: number;
  hasHeavyItem: boolean; // At least one product >= 10 lbs
  requiresPickup: boolean; // Over 10 lbs threshold
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  shippingFeeCents: number;
  taxCents: number;
  grandTotalCents: number;
  
  // Checkout details
  pickupDetails: PickupDetails;
  setPickupDetails: React.Dispatch<React.SetStateAction<PickupDetails>>;
  shippingDetails: ShippingDetails;
  setShippingDetails: React.Dispatch<React.SetStateAction<ShippingDetails>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "vh_woodwork_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethodState] = useState<DeliveryMethod>("pickup");
  const [isHydrated, setIsHydrated] = useState(false);

  const [pickupDetails, setPickupDetails] = useState<PickupDetails>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    pickupDate: "",
    pickupTimeSlot: "11:00 AM - 1:00 PM",
    vehicleType: "",
    notes: "",
  });

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "FL",
    postalCode: "",
    country: "US",
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        queueMicrotask(() => setItems(JSON.parse(saved)));
      }
    } catch {
      // Ignore localstorage errors
    }
    queueMicrotask(() => setIsHydrated(true));
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Ignore
      }
    }
  }, [items, isHydrated]);

  const addItem = (product: Product, quantity = 1) => {
    if (!product.inStock || product.isSoldOut || product.stockCount < 1) return;
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stockCount, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stockCount, quantity) }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.min(item.product.stockCount, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculations
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalCents = items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0
  );
  const totalWeightLbs = Number(
    items
      .reduce((sum, item) => sum + item.product.weightLbs * item.quantity, 0)
      .toFixed(1)
  );

  // Strict Florida Woodwork rule:
  // Any individual item >= 10 lbs OR total order weight >= 10 lbs -> Local Coral Springs Studio Pickup Only
  const hasHeavyItem = items.some((item) => item.product.weightLbs >= 10);
  const requiresPickup = hasHeavyItem || totalWeightLbs >= 10;

  // Auto-enforce pickup if required
  useEffect(() => {
    if (requiresPickup && deliveryMethod !== "pickup") {
      queueMicrotask(() => setDeliveryMethodState("pickup"));
    }
  }, [requiresPickup, deliveryMethod]);

  const setDeliveryMethod = (method: DeliveryMethod) => {
    if (requiresPickup && method === "shipping") {
      // Prevent selecting shipping when pickup is required
      return;
    }
    setDeliveryMethodState(method);
  };

  // Shipping fee: $0 for Coral Springs studio pickup; $18 flat for nationwide lightweight items (< 10 lbs)
  const shippingFeeCents =
    deliveryMethod === "pickup" || totalItems === 0
      ? 0
      : subtotalCents > 30000
      ? 0 // Free shipping over $300 for lightweight objects
      : 1800; // $18.00 flat tracked shipping via USPS/UPS

  // Tax is confirmed with the final invoice after destination review.
  const taxCents = 0;
  const grandTotalCents = subtotalCents + shippingFeeCents + taxCents;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotalCents,
        totalWeightLbs,
        hasHeavyItem,
        requiresPickup,
        deliveryMethod,
        setDeliveryMethod,
        shippingFeeCents,
        taxCents,
        grandTotalCents,
        pickupDetails,
        setPickupDetails,
        shippingDetails,
        setShippingDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

