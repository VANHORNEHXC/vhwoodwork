import { NextResponse } from "next/server";
import { listProducts } from "@/lib/catalog";

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json({
      studio: "VH Woodwork",
      owner: "Dario VanHorne",
      location: "Coral Springs, FL",
      shippingOrigin: "Coral Springs, FL",
      count: products.length,
      products,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Catalog unavailable" }, { status: 503 });
  }
}
