"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface CheckoutModalProps {
  initialMethod: "stripe" | "paypal";
  onClose: () => void;
}

export function CheckoutModal({ initialMethod, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const {
    items,
    subtotalCents,
    totalWeightLbs,
    requiresPickup,
    deliveryMethod,
    shippingFeeCents,
    taxCents,
    grandTotalCents,
    pickupDetails,
    setPickupDetails,
    shippingDetails,
    setShippingDetails,
    clearCart,
  } = useCart();

  const [paymentProvider, setPaymentProvider] = useState<"stripe" | "paypal">(initialMethod);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (deliveryMethod === "pickup") {
      setPickupDetails((prev) => ({ ...prev, [name]: value }));
    } else {
      setShippingDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const payload = {
        paymentProvider,
        deliveryMethod,
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          priceCents: i.product.priceCents,
          weightLbs: i.product.weightLbs,
        })),
        totalWeightLbs,
        subtotalCents,
        shippingFeeCents,
        taxCents,
        grandTotalCents,
        customer:
          deliveryMethod === "pickup"
            ? {
                name: pickupDetails.customerName,
                email: pickupDetails.customerEmail,
                phone: pickupDetails.customerPhone,
                pickupDate: pickupDetails.pickupDate || "Next Available Atelier Day",
                pickupTimeSlot: pickupDetails.pickupTimeSlot,
                vehicleType: pickupDetails.vehicleType,
                notes: pickupDetails.notes,
              }
            : {
                name: shippingDetails.customerName,
                email: shippingDetails.customerEmail,
                phone: shippingDetails.customerPhone,
                address: shippingDetails.addressLine1,
                city: shippingDetails.city,
                state: shippingDetails.state,
                postalCode: shippingDetails.postalCode,
              },
      };

      const res = await fetch(`/api/checkout/${paymentProvider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process payment request");
      }

      if (!data.orderId) throw new Error("Order reference was not returned");
      const orderId = data.orderId;
      
      sessionStorage.setItem(
        "vhw_latest_order",
        JSON.stringify({
          orderId,
          paymentProvider,
          paymentStatus: data.paymentStatus || "pending",
          deliveryMethod,
          grandTotalCents,
          shippingFeeCents,
          taxCents,
          totalWeightLbs,
          items,
          customer: payload.customer,
          createdAt: new Date().toISOString(),
        })
      );

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      clearCart();
      onClose();
      router.push(`/order-confirmation?orderId=${orderId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Checkout error occurred";
      setErrorMessage(msg);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md overflow-y-auto font-sans-luxury">
      <div
        className="relative my-6 w-full max-w-2xl glass-luxury rounded-3xl p-6 sm:p-10 text-zinc-900 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-zinc-200/60">
          <div>
            <span className="font-mono-luxury text-[10px] uppercase tracking-widest text-zinc-400 block">
              Private Concierge &bull; Coral Springs
            </span>
            <h3 className="font-roffelia font-normal text-2xl sm:text-3xl text-zinc-950 mt-1">
              Acquisition Dispatch
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-zinc-100/80 hover:bg-zinc-200 text-zinc-700 h-8 w-8 flex items-center justify-center transition-colors shadow-2xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="pt-6 space-y-6">
          {/* Order Snapshot & Fulfillment Type */}
          <div className="rounded-2xl bg-[#f9f8f5] border border-zinc-200/60 p-4 font-sans-luxury text-xs space-y-2">
            <div className="flex items-center justify-between font-medium text-zinc-950 uppercase font-mono-luxury text-[11px] border-b border-zinc-200/60 pb-2">
              <span>Fulfillment Protocol:</span>
              <span className={requiresPickup ? "text-amber-800" : "text-emerald-800"}>
                {deliveryMethod === "pickup"
                  ? "Atelier Collection (Coral Springs, FL)"
                  : "Insured Nationwide Transit"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs text-zinc-600 font-sans-luxury">
              <div>
                <span className="block text-[10px] font-mono-luxury text-zinc-400 uppercase">Mass:</span>
                <span className="font-medium text-zinc-950">{totalWeightLbs} lbs</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono-luxury text-zinc-400 uppercase">Works:</span>
                <span className="font-medium text-zinc-950">{items.length} lots</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono-luxury text-zinc-400 uppercase">Transit Fee:</span>
                <span className="font-medium text-zinc-950">
                  {deliveryMethod === "pickup" ? "Complimentary" : `$${(shippingFeeCents / 100).toFixed(2)}`}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono-luxury text-zinc-400 uppercase">Estimate before tax:</span>
                <span className="font-semibold text-zinc-950">${(grandTotalCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Customer & Fulfillment Form */}
          {deliveryMethod === "pickup" ? (
            /* FORT LAUDERDALE ATELIER PICKUP FORM */
            <div className="space-y-4 text-xs font-sans-luxury">
              <div className="border-l-2 border-amber-500/80 pl-3.5">
                <h4 className="font-semibold text-zinc-950 text-xs">
                  Atelier Collection Appointment (Coral Springs, FL)
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Collection is arranged in <strong>Coral Springs, Florida</strong>. The exact address is shared after confirmation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] text-zinc-600 font-medium uppercase font-mono-luxury mb-1">
                    Collector Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="customerName"
                    value={pickupDetails.customerName}
                    onChange={handleInputChange}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full rounded-xl border border-zinc-200 bg-white/90 p-2.5 text-xs text-zinc-950 focus:border-zinc-950 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-600 font-medium uppercase font-mono-luxury mb-1">
                    Direct Email *
                  </label>
                  <input
                    type="email"
                    required
                    name="customerEmail"
                    value={pickupDetails.customerEmail}
                    onChange={handleInputChange}
                    placeholder="eleanor@estate.com"
                    className="w-full rounded-xl border border-zinc-200 bg-white/90 p-2.5 text-xs text-zinc-950 focus:border-zinc-950 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-600 font-medium uppercase font-mono-luxury mb-1">
                    Telephone (Concierge Coordination) *
                  </label>
                  <input
                    type="tel"
                    required
                    name="customerPhone"
                    value={pickupDetails.customerPhone}
                    onChange={handleInputChange}
                    placeholder="(954) 555-0199"
                    className="w-full rounded-xl border border-zinc-200 bg-white/90 p-2.5 text-xs text-zinc-950 focus:border-zinc-950 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-600 font-medium uppercase font-mono-luxury mb-1">
                    Preferred Collection Window
                  </label>
                  <select
                    name="pickupTimeSlot"
                    value={pickupDetails.pickupTimeSlot}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white/90 p-2.5 text-xs text-zinc-950 focus:border-zinc-950 outline-hidden"
                  >
                    <option value="10:00 AM - 12:00 PM">Morning (10:00 AM - 12:00 PM)</option>
                    <option value="12:00 PM - 2:00 PM">Midday (12:00 PM - 2:00 PM)</option>
                    <option value="2:00 PM - 4:00 PM">Afternoon (2:00 PM - 4:00 PM)</option>
                    <option value="4:00 PM - 6:00 PM">Late Afternoon (4:00 PM - 6:00 PM)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-zinc-600 font-medium uppercase font-mono-luxury mb-1">
                    Transport Vehicle / Loading Instructions
                  </label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={pickupDetails.vehicleType}
                    onChange={handleInputChange}
                    placeholder="e.g. Range Rover / Escalade / Covered Van"
                    className="w-full rounded-xl border border-zinc-200 bg-white/90 p-2.5 text-xs text-zinc-950 focus:border-zinc-950 outline-hidden"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* STANDARD SHIPPING ADDRESS FORM (< 10 LBS) */
            <div className="space-y-4 text-xs font-sans-luxury">
              <div className="border-l-2 border-emerald-500 pl-3.5">
                <h4 className="font-semibold text-zinc-950 text-xs">
                  Insured Nationwide Delivery (&lt; 10 lbs)
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Packaged in archival double-wall timber crating with full carrier insurance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] text-zinc-600 font-medium uppercase font-mono-luxury mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="customerName"
                    value={shippingDetails.customerName}
                    onChange={handleInputChange}
                    placeholder="Full recipient name"
                    className="w-full rounded-xl border border-zinc-200 bg-white/90 p-2.5 text-xs text-zinc-950 focus:border-zinc-950 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-600 font-medium uppercase font-mono-luxury mb-1">
                    Direct Email *
                  </label>
                  <input
                    type="email"
                    required
                    name="customerEmail"
                    value={shippingDetails.customerEmail}
                    onChange={handleInputChange}
                    placeholder="recipient@estate.com"
                    className="w-full rounded-xl border border-zinc-200 bg-white/90 p-2.5 text-xs text-zinc-950 focus:border-zinc-950 outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-zinc-600 font-medium uppercase font-mono-luxury mb-1">
                    Residence Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    name="addressLine1"
                    value={shippingDetails.addressLine1}
                    onChange={handleInputChange}
                    placeholder="Estate address, Suite, Villa"
                    className="w-full rounded-xl border border-zinc-200 bg-white/90 p-2.5 text-xs text-zinc-950 focus:border-zinc-950 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-600 font-medium uppercase font-mono-luxury mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full rounded-xl border border-zinc-200 bg-white/90 p-2.5 text-xs text-zinc-950 focus:border-zinc-950 outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-zinc-600 font-medium uppercase font-mono-luxury mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      name="state"
                      value={shippingDetails.state}
                      onChange={handleInputChange}
                      placeholder="FL"
                      maxLength={2}
                      className="w-full rounded-xl border border-zinc-200 bg-white/90 p-2.5 text-xs text-zinc-950 focus:border-zinc-950 outline-hidden uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-600 font-medium uppercase font-mono-luxury mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      name="postalCode"
                      value={shippingDetails.postalCode}
                      onChange={handleInputChange}
                      placeholder="33301"
                      className="w-full rounded-xl border border-zinc-200 bg-white/90 p-2.5 text-xs text-zinc-950 focus:border-zinc-950 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Switcher */}
          <div className="border-t border-zinc-200/60 pt-5 space-y-3 font-sans-luxury text-xs">
            <span className="text-[10px] font-mono-luxury uppercase tracking-widest text-zinc-400 block">
              Preferred payment method:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Stripe Option */}
              <button
                type="button"
                onClick={() => setPaymentProvider("stripe")}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentProvider === "stripe"
                    ? "border-zinc-950 bg-zinc-950 text-white shadow-md ring-1 ring-zinc-950"
                    : "border-zinc-200/80 bg-white/80 hover:border-zinc-400 text-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs font-sans-luxury">STRIPE</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
                <p className={`text-[11px] mt-2 ${paymentProvider === "stripe" ? "text-zinc-300" : "text-zinc-500"}`}>
                  Request a Stripe payment invoice after the studio confirms the order.
                </p>
              </button>

              {/* PayPal Commercial Option */}
              <button
                type="button"
                onClick={() => setPaymentProvider("paypal")}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentProvider === "paypal"
                    ? "border-amber-500 bg-[#003087] text-white shadow-md ring-1 ring-amber-500"
                    : "border-zinc-200/80 bg-white/80 hover:border-zinc-400 text-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black italic text-sm text-[#ffc439]">PayPal</span>
                  <span className="text-[9px] uppercase font-mono-luxury font-medium bg-amber-400 text-black px-2 py-0.5 rounded-full">
                    COMMERCIAL
                  </span>
                </div>
                <p className={`text-[11px] mt-2 ${paymentProvider === "paypal" ? "text-zinc-200" : "text-zinc-500"}`}>
                  Request a PayPal invoice from the studio.
                </p>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-red-700 font-sans-luxury text-xs">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Complete Button */}
          <div className="border-t border-zinc-200/60 pt-5 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 px-6 rounded-full font-sans-luxury text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-md ${
                paymentProvider === "paypal"
                  ? "bg-[#ffc439] hover:bg-[#f6b720] text-[#003087]"
                  : "bg-zinc-950 hover:bg-zinc-800 text-white"
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>SENDING ORDER REQUEST...</span>
                </>
              ) : (
                <span>
                  SUBMIT ORDER REQUEST &bull; ${(grandTotalCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              )}
            </button>
            <p className="text-center text-[10px] font-mono-luxury text-zinc-400 pt-1">
              Final tax and payment are confirmed separately. No charge is made on this form.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
