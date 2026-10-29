import { getDb } from "./index";
import { products } from "./schema";
import { PRODUCTS } from "../data/products";

export async function seedDatabase() {
  const db = getDb();
  for (const product of PRODUCTS) {
    await db.insert(products).values({
      ...product,
      weightLbs: String(product.weightLbs),
      isSoldOut: product.isSoldOut ?? false,
    }).onConflictDoNothing();
  }
}
