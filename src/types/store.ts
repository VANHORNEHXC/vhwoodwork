export type WoodCategory = 
  | "all" 
  | "furniture" 
  | "studio-objects" 
  | "seating" 
  | "tables" 
  | "storage";

export interface Product {
  id: string;
  lotNumber: string; // e.g. "LOT #01"
  itemCode: string; // e.g. "VHW-ST-04"
  name: string;
  tagline: string;
  category: "seating" | "tables" | "storage" | "studio-objects";
  priceCents: number;
  weightLbs: number; // The crucial rule: < 10 lbs vs >= 10 lbs
  woodSpecies: string; // e.g. "Solid Appalachian White Oak"
  finish: string; // e.g. "Matte Hardwax Oil (Zero VOC)"
  dimensions: string; // e.g. '18"W × 18"D × 19"H'
  joinery: string; // e.g. "Through-tenons with walnut wedges"
  leadTime: string; // e.g. "In Stock (Ready for pickup/ship)" | "Made to Order (2-3 weeks)"
  inStock: boolean;
  stockCount: number;
  isSoldOut?: boolean;
  description: string;
  primaryImage: string;
  secondaryImage: string;
  provenance: string; // e.g. "Crafted by hand in Fort Lauderdale, FL"
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

