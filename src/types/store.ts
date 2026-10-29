export type WoodCategory = 
  | "all" 
  | "interior" 
  | "exterior" 
  | "seating" 
  | "tables" 
  | "storage" 
  | "studio-objects";

export interface Product {
  id: string;
  lotNumber: string; // e.g. "LOT #01"
  itemCode: string; // e.g. "VHW-ST-01"
  name: string;
  tagline: string;
  category: "seating" | "tables" | "storage" | "studio-objects";
  placement: "interior" | "exterior"; // INTERIOR vs EXTERIOR
  priceCents: number;
  weightLbs: number; // Stored for backend shipping calculation (<10 vs >10)
  woodSpecies: string;
  finish: string;
  dimensions: string;
  joinery: string;
  leadTime: string;
  inStock: boolean;
  stockCount: number;
  isSoldOut?: boolean;
  description: string;
  primaryImage: string;
  secondaryImage: string;
  provenance: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DeliveryMethod = "shipping" | "pickup";

export interface PickupDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
  pickupTimeSlot: string;
  vehicleType?: string;
  notes?: string;
}

export interface ShippingDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type PaymentMethod = "stripe" | "paypal";
