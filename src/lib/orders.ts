import { randomBytes } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { listProducts } from "@/lib/catalog";

export type OrderRecord = typeof orders.$inferSelect;
export type FulfillmentStatus = "new" | "preparing" | "ready_for_pickup" | "shipped" | "fulfilled" | "cancelled";

type CustomerInput = {
  name: string;
  email: string;
  phone?: string;
  pickupDate?: string;
  pickupTimeSlot?: string;
  vehicleType?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
};

export type PreparedOrder = {
  id: string;
  deliveryMethod: "shipping" | "pickup";
  totalWeightLbs: number;
  subtotalCents: number;
  shippingFeeCents: number;
  taxCents: number;
  grandTotalCents: number;
  customer: CustomerInput;
  items: Array<{ id: string; name: string; quantity: number; priceCents: number; weightLbs: number }>;
};

export async function prepareOrder(body: unknown): Promise<PreparedOrder> {
  if (!body || typeof body !== "object") throw new Error("Invalid order");
  const input = body as Record<string, unknown>;
  const requested = Array.isArray(input.items) ? input.items : [];
  if (requested.length === 0 || requested.length > 40) throw new Error("Order must contain 1–40 items");
  const seenIds = new Set<string>();
  if (input.deliveryMethod !== "shipping" && input.deliveryMethod !== "pickup") throw new Error("Invalid delivery method");
  const available = new Map((await listProducts()).map((product) => [product.id, product]));
  const items = requested.map((item: unknown) => {
    if (!item || typeof item !== "object") throw new Error("Invalid order item");
    const raw = item as Record<string, unknown>;
    const id = String(raw.id);
    if (seenIds.has(id)) throw new Error("Duplicate item in order");
    seenIds.add(id);
    const product = available.get(id);
    const quantity = Number(raw.quantity);
    if (!product || !product.inStock || product.isSoldOut) throw new Error("A selected item is unavailable");
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > product.stockCount) throw new Error(`Not enough stock for ${product.name}`);
    return { id: product.id, name: product.name, quantity, priceCents: product.priceCents, weightLbs: product.weightLbs };
  });
  const subtotalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  const totalWeightLbs = Number(items.reduce((sum, item) => sum + item.weightLbs * item.quantity, 0).toFixed(2));
  if (totalWeightLbs >= 10 && input.deliveryMethod !== "pickup") throw new Error("This order requires Coral Springs studio pickup");
  const shippingFeeCents = input.deliveryMethod === "shipping" && subtotalCents <= 30000 ? 1800 : 0;
  // Tax depends on the destination and, for some items, surtax limits.
  // Orders are requests; the studio confirms the final tax before payment.
  const taxCents = 0;
  const grandTotalCents = subtotalCents + shippingFeeCents + taxCents;
  if (["subtotalCents", "shippingFeeCents", "taxCents", "grandTotalCents"].some((key) => Number(input[key]) !== ({ subtotalCents, shippingFeeCents, taxCents, grandTotalCents } as Record<string, number>)[key])) {
    throw new Error("Cart prices changed. Refresh the page and review your bag before ordering.");
  }
  const customerRaw = input.customer && typeof input.customer === "object" ? input.customer as Record<string, unknown> : {};
  const field = (key: string, max = 180) => typeof customerRaw[key] === "string" ? String(customerRaw[key]).trim().slice(0, max) : "";
  const customer: CustomerInput = {
    name: field("name"), email: field("email"), phone: field("phone", 40),
    pickupDate: field("pickupDate", 80), pickupTimeSlot: field("pickupTimeSlot", 80), vehicleType: field("vehicleType", 80),
    address: field("address"), city: field("city"), state: field("state", 80), postalCode: field("postalCode", 30),
  };
  if (!customer.name || !/^\S+@\S+\.\S+$/.test(customer.email)) throw new Error("Customer name and valid email are required");
  if (input.deliveryMethod === "shipping" && (!customer.address || !customer.city || !customer.state || !customer.postalCode)) throw new Error("Complete shipping address is required");
  return {
    id: `VHW-${randomBytes(8).toString("hex").toUpperCase()}`,
    deliveryMethod: input.deliveryMethod,
    totalWeightLbs,
    subtotalCents,
    shippingFeeCents,
    taxCents,
    grandTotalCents,
    customer,
    items,
  };
}

export async function savePendingOrder(order: PreparedOrder, paymentProvider: "stripe" | "paypal") {
  await getDb().insert(orders).values({
    id: order.id,
    paymentProvider,
    paymentStatus: "pending",
    deliveryMethod: order.deliveryMethod,
    totalWeightLbs: String(order.totalWeightLbs),
    subtotalCents: order.subtotalCents,
    shippingFeeCents: order.shippingFeeCents,
    taxCents: order.taxCents,
    grandTotalCents: order.grandTotalCents,
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    customerPhone: order.customer.phone || null,
    pickupDate: order.customer.pickupDate || null,
    pickupTimeSlot: order.customer.pickupTimeSlot || null,
    vehicleType: order.customer.vehicleType || null,
    shippingAddress: order.deliveryMethod === "shipping" ? [order.customer.address, order.customer.city, order.customer.state, order.customer.postalCode].filter(Boolean).join(", ") : null,
    items: order.items.map(({ id, name, quantity, priceCents }) => ({ id, name, quantity, priceCents })),
    status: "new",
  });
}

export async function listOrders() {
  const rows = await getDb().select().from(orders).orderBy(desc(orders.createdAt));
  return rows.map((row) => ({ ...row, totalWeightLbs: Number(row.totalWeightLbs) }));
}

export async function updateOrder(id: string, changes: {
  status: FulfillmentStatus;
  paymentStatus: "pending" | "paid";
  trackingNumber: string;
  fulfillmentNotes: string;
}) {
  const [updated] = await getDb().update(orders).set({ ...changes, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
  return updated ? { ...updated, totalWeightLbs: Number(updated.totalWeightLbs) } : null;
}

export async function markOrderPaid(id: string) {
  await getDb().update(orders).set({ paymentStatus: "paid", updatedAt: new Date() }).where(eq(orders.id, id));
}
