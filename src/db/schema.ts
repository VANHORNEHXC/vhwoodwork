import { pgTable, serial, text, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  lotNumber: text("lot_number").notNull(), // "LOT #01"
  itemCode: text("item_code").notNull(), // "VHW-ST-01"
  name: text("name").notNull(),
  tagline: text("tagline"),
  category: text("category").notNull(), // "seating" | "tables" | "storage" | "studio-objects"
  description: text("description"),
  priceCents: integer("price_cents").notNull(),
  weightLbs: numeric("weight_lbs").notNull(), // < 10 lbs vs >= 10 lbs
  woodSpecies: text("wood_species").notNull(),
  finish: text("finish"),
  dimensions: text("dimensions"),
  joinery: text("joinery"),
  leadTime: text("lead_time"),
  requiresPickup: boolean("requires_pickup").notNull().default(false),
  primaryImage: text("primary_image"),
  secondaryImage: text("secondary_image"),
  inStock: boolean("in_stock").default(true),
  stockCount: integer("stock_count").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull(), // "VHW-ST-123456"
  paymentProvider: text("payment_provider").notNull(), // "stripe" | "paypal"
  deliveryMethod: text("delivery_method").notNull(), // "shipping" | "pickup"
  totalWeightLbs: numeric("total_weight_lbs").notNull(),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingFeeCents: integer("shipping_fee_cents").notNull().default(0),
  taxCents: integer("tax_cents").notNull().default(0),
  grandTotalCents: integer("grand_total_cents").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  pickupDate: text("pickup_date"),
  pickupTimeSlot: text("pickup_time_slot"),
  vehicleType: text("vehicle_type"),
  shippingAddress: text("shipping_address"),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").defaultNow(),
});
