import { NextResponse } from "next/server";
import Stripe from "stripe";
import { markOrderPaid } from "@/lib/orders";

export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!key || !webhookSecret || !signature) return NextResponse.json({ error: "Webhook unavailable" }, { status: 503 });
  const stripe = new Stripe(key);
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret); }
  catch { return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 }); }
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid" && session.metadata?.orderId) {
      await markOrderPaid(session.metadata.orderId);
    }
  }
  return NextResponse.json({ received: true });
}
