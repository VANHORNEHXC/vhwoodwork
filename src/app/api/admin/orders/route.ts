import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest, isSameOrigin } from "@/lib/admin-auth";
import { listOrders, updateOrder, type FulfillmentStatus } from "@/lib/orders";

const statuses: FulfillmentStatus[] = ["new", "preparing", "ready_for_pickup", "shipped", "fulfilled", "cancelled"];

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json({ orders: await listOrders() }); }
  catch { return NextResponse.json({ error: "Orders are unavailable" }, { status: 503 }); }
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const id = typeof body.id === "string" ? body.id : "";
  const status = body.status;
  const paymentStatus = body.paymentStatus;
  if (!id || !statuses.includes(status as FulfillmentStatus) || !["pending", "paid"].includes(String(paymentStatus))) {
    return NextResponse.json({ error: "Invalid order update" }, { status: 400 });
  }
  const trackingNumber = typeof body.trackingNumber === "string" ? body.trackingNumber.trim().slice(0, 120) : "";
  const fulfillmentNotes = typeof body.fulfillmentNotes === "string" ? body.fulfillmentNotes.trim().slice(0, 2000) : "";
  try {
    const order = await updateOrder(id, { status: status as FulfillmentStatus, paymentStatus: paymentStatus as "pending" | "paid", trackingNumber, fulfillmentNotes });
    return order ? NextResponse.json({ order }) : NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch { return NextResponse.json({ error: "Could not update order" }, { status: 503 }); }
}
