import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import type { Product } from "@/types/store";

type ProductRow = typeof products.$inferSelect;

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    lotNumber: row.lotNumber,
    itemCode: row.itemCode,
    name: row.name,
    tagline: row.tagline,
    category: row.category as Product["category"],
    placement: row.placement as Product["placement"],
    description: row.description,
    priceCents: row.priceCents,
    weightLbs: Number(row.weightLbs),
    woodSpecies: row.woodSpecies,
    finish: row.finish,
    dimensions: row.dimensions,
    joinery: row.joinery,
    leadTime: row.leadTime,
    primaryImage: row.primaryImage,
    secondaryImage: row.secondaryImage,
    inStock: row.inStock,
    stockCount: row.stockCount,
    isSoldOut: row.isSoldOut,
    provenance: row.provenance,
  };
}

export async function listProducts(): Promise<Product[]> {
  const rows = await getDb().select().from(products).orderBy(asc(products.createdAt), asc(products.id));
  return rows.map(toProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  const [row] = await getDb().select().from(products).where(eq(products.id, id)).limit(1);
  return row ? toProduct(row) : null;
}

export async function insertProduct(product: Product): Promise<void> {
  await getDb().insert(products).values({
    ...product,
    weightLbs: String(product.weightLbs),
    isSoldOut: product.isSoldOut ?? false,
  });
}

export async function updateProduct(product: Product): Promise<void> {
  await getDb().update(products).set({
    ...product,
    weightLbs: String(product.weightLbs),
    isSoldOut: product.isSoldOut ?? false,
    updatedAt: new Date(),
  }).where(eq(products.id, product.id));
}

export async function deleteProduct(id: string): Promise<void> {
  await getDb().delete(products).where(eq(products.id, id));
}

function validImageUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

export function parseProduct(input: unknown, id: string): Product {
  if (!input || typeof input !== "object") throw new Error("Invalid product data");
  const raw = input as Record<string, unknown>;
  const str = (key: string, max = 500) => typeof raw[key] === "string" ? String(raw[key]).trim().slice(0, max) : "";
  const priceCents = Number(raw.priceCents);
  const weightLbs = Number(raw.weightLbs);
  const stockCount = Number(raw.stockCount);
  const category = str("category");
  const placement = str("placement");
  const primaryImage = str("primaryImage", 2000);
  const secondaryImage = str("secondaryImage", 2000) || primaryImage;

  if (!str("name") || !str("itemCode") || !str("lotNumber") || !str("woodSpecies")) throw new Error("Name, code, lot and wood species are required");
  if (!["seating", "tables", "storage", "studio-objects"].includes(category)) throw new Error("Invalid category");
  if (!["interior", "exterior"].includes(placement)) throw new Error("Invalid placement");
  if (!Number.isSafeInteger(priceCents) || priceCents < 0) throw new Error("Invalid price");
  if (!Number.isFinite(weightLbs) || weightLbs <= 0 || weightLbs > 100000) throw new Error("Invalid weight");
  if (!Number.isSafeInteger(stockCount) || stockCount < 0) throw new Error("Invalid stock count");
  if (!validImageUrl(primaryImage) || !validImageUrl(secondaryImage)) throw new Error("Image URLs must use HTTPS or a local path");

  return {
    id,
    lotNumber: str("lotNumber", 60),
    itemCode: str("itemCode", 60),
    name: str("name", 150),
    tagline: str("tagline", 240),
    category: category as Product["category"],
    placement: placement as Product["placement"],
    priceCents,
    weightLbs,
    woodSpecies: str("woodSpecies", 160),
    finish: str("finish", 160),
    dimensions: str("dimensions", 160),
    joinery: str("joinery", 160),
    leadTime: str("leadTime", 160),
    inStock: Boolean(raw.inStock) && stockCount > 0,
    stockCount,
    isSoldOut: Boolean(raw.isSoldOut),
    description: str("description", 5000),
    primaryImage,
    secondaryImage,
    provenance: str("provenance", 240),
  };
}
