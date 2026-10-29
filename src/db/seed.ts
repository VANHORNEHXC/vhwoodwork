import { db } from "./index";
import { products } from "./schema";
import { PRODUCTS } from "../data/products";

export async function seedDatabase() {
  try {
    for (const p of PRODUCTS) {
      await db.insert(products).values({
        lotNumber: p.lotNumber,
        itemCode: p.itemCode,
        name: p.name,
        tagline: p.tagline,
        category: p.category,
        description: p.description,
        priceCents: p.priceCents,
        weightLbs: String(p.weightLbs),
        woodSpecies: p.woodSpecies,
        finish: p.finish,
        dimensions: p.dimensions,
        joinery: p.joinery,
        leadTime: p.leadTime,
        requiresPickup: p.weightLbs >= 10,
        primaryImage: p.primaryImage,
        secondaryImage: p.secondaryImage,
        inStock: p.inStock,
        stockCount: p.stockCount,
      });
    }
    console.log("Database seeded successfully with VH Woodwork catalog.");
  } catch (err) {
    console.error("Seed error:", err);
  }
}

