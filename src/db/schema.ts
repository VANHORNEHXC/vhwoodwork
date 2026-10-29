import { pgTable, serial, text, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  priceCents: integer("price_cents").notNull(),
  weightLbs: numeric("weight_lbs").notNull(),
  requiresPickup: boolean("requires_pickup").notNull().default(false),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  stripeSessionId: text("stripe_session_id"),
  deliveryMethod: text("delivery_method").notNull(), // "shipping" | "pickup"
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});
