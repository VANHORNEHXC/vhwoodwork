import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";

export async function GET(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!/^VHW-[A-F0-9]{16}$/.test(id)) return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  try {
    const [order] = await getDb().select({ paymentStatus: orders.paymentStatus, status: orders.status }).from(orders).where(eq(orders.id, id)).limit(1);
    return order ? NextResponse.json(order, { headers: { "Cache-Control": "no-store" } }) : NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch { return NextResponse.json({ error: "Order status unavailable" }, { status: 503 }); }
}
