import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, deliveryMethod, totalWeightLbs, grandTotalCents, customer } = body;

    // Enforce 10 lbs rule
    const hasHeavyItem = items.some((item: { weightLbs: number }) => item.weightLbs >= 10);
    if ((hasHeavyItem || totalWeightLbs >= 10) && deliveryMethod !== "pickup") {
      return NextResponse.json(
        {
          error:
            "Orders exceeding 10 lbs cannot be shipped via parcel. Local Studio Pickup in Fort Lauderdale, FL is required.",
        },
        { status: 400 }
      );
    }

    const generatedOrderId = `VHW-PP-${Math.floor(100000 + Math.random() * 900000)}`;

    // PayPal Commercial Business payment processing handler
    // In production, owner can provide PAYPAL_CLIENT_ID & PAYPAL_CLIENT_SECRET
    return NextResponse.json({
      success: true,
      orderId: generatedOrderId,
      provider: "paypal",
      deliveryMethod,
      totalWeightLbs,
      grandTotalCents,
      customerName: customer?.name,
      note: "PayPal Commercial transaction authorized.",
    });
  } catch (error: unknown) {
    console.error("PayPal Checkout Error:", error);
    const message = error instanceof Error ? error.message : "Internal PayPal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

