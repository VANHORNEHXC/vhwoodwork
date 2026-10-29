import { NextResponse } from "next/server";
import { PRODUCTS } from "@/data/products";

export async function GET() {
  return NextResponse.json({
    studio: "VH Woodwork",
    location: "Fort Lauderdale, FL",
    policy: {
      under10Lbs: "Nationwide Tracked Parcel Shipping ($18 flat or free >$300) or Local Studio Pickup",
      over10Lbs: "Local Studio Pickup Mandatory at Fort Lauderdale Workshop (1104 NE 3rd Ave)",
      taxRate: "7.0% Florida / Broward County",
      gateways: ["Stripe Commercial", "PayPal Business / Commercial"],
    },
    count: PRODUCTS.length,
    products: PRODUCTS,
  });
}

