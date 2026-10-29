import { NextRequest, NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/admin-auth";
import { prepareOrder, savePendingOrder } from "@/lib/orders";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  try {
    const order = await prepareOrder(await request.json());
    await savePendingOrder(order, "paypal");
    return NextResponse.json({ orderId: order.id, paymentStatus: "pending", message: "Order request received. PayPal payment has not been charged." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create order";
    const clientError = /^(Invalid|Order must|A selected|Not enough|This order|Customer name|Complete shipping|Duplicate item|Cart prices)/.test(message);
    return NextResponse.json({ error: clientError ? message : "Unable to create order" }, { status: clientError ? 400 : 503 });
  }
}
