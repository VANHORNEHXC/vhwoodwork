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

  // Form handling
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
                pickupDate: pickupDetails.pickupDate || "Next Available Studio Day",
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

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      const orderId = data.orderId || `VHW-${Math.floor(100000 + Math.random() * 900000)}`;
      
      sessionStorage.setItem(
        "vhw_latest_order",
        JSON.stringify({
          orderId,
          paymentProvider,
          deliveryMethod,
          grandTotalCents,
          totalWeightLbs,
          items,
          customer: payload.customer,
          createdAt: new Date().toISOString(),
        })
      );

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md overflow-y-auto">
      <div
        className="relative my-6 w-full max-w-2xl border border-white/60 bg-white/90 backdrop-blur-2xl text-zinc-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-zinc-950/90 backdrop-blur-md px-5 py-3 text-white">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
            <span className="font-bold text-amber-400">CHECKOUT DISPATCH</span>
            <span className="text-zinc-500">//</span>
            <span>FORT LAUDERDALE, FL</span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest px-2 py-0.5 border border-zinc-700"
          >
            [CLOSE]
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
          {/* Order Snapshot & Fulfillment Type */}
          <div className="border border-white/80 bg-white/60 backdrop-blur-md p-4 font-mono text-xs space-y-2 shadow-xs">
            <div className="flex items-center justify-between font-bold text-zinc-950 uppercase border-b border-zinc-200/60 pb-1.5">
              <span>FULFILLMENT SPECIFICATION:</span>
              <span className={requiresPickup ? "text-amber-800" : "text-emerald-800"}>
                {deliveryMethod === "pickup"
                  ? "LOCAL STUDIO PICKUP (FORT LAUDERDALE)"
                  : "NATIONWIDE TRACKED SHIPPING"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-zinc-600">
              <div>
                <span className="block text-[10px] text-zinc-400">TOTAL WEIGHT:</span>
                <span className="font-bold text-zinc-950">{totalWeightLbs} LBS</span>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-400">PIECES:</span>
                <span className="font-bold text-zinc-950">{items.length} LOTS</span>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-400">FULFILLMENT FEE:</span>
                <span className="font-bold text-zinc-950">
                  {deliveryMethod === "pickup" ? "$0.00 (FREE)" : `$${(shippingFeeCents / 100).toFixed(2)}`}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-400">TOTAL DUE:</span>
                <span className="font-bold text-zinc-950">${(grandTotalCents / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Fulfillment Form */}
          {deliveryMethod === "pickup" ? (
            /* FORT LAUDERDALE STUDIO PICKUP FORM */
            <div className="space-y-4 font-mono text-xs">
              <div className="border-l-2 border-amber-500 pl-3">
                <h4 className="font-bold text-zinc-950 uppercase text-xs">
                  FORT LAUDERDALE STUDIO PICKUP SCHEDULE
                </h4>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  Workshop Location: <strong>1104 NE 3rd Ave, Fort Lauderdale, FL 33304</strong>.
                  Studio team will prep your piece and provide load-in assistance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-700 font-bold uppercase mb-1">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    name="customerName"
                    value={pickupDetails.customerName}
                    onChange={handleInputChange}
                    placeholder="e.g. John Miller"
                    className="w-full border border-zinc-300 bg-white/80 backdrop-blur-xs p-2 font-mono text-xs text-zinc-950 focus:border-black outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-700 font-bold uppercase mb-1">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    name="customerEmail"
                    value={pickupDetails.customerEmail}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full border border-zinc-300 bg-white/80 backdrop-blur-xs p-2 font-mono text-xs text-zinc-950 focus:border-black outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-700 font-bold uppercase mb-1">
                    PHONE (FOR PICKUP COORDINATION) *
                  </label>
                  <input
                    type="tel"
                    required
                    name="customerPhone"
                    value={pickupDetails.customerPhone}
                    onChange={handleInputChange}
                    placeholder="(954) 555-0199"
                    className="w-full border border-zinc-300 bg-white/80 backdrop-blur-xs p-2 font-mono text-xs text-zinc-950 focus:border-black outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-700 font-bold uppercase mb-1">
                    PREFERRED PICKUP TIME SLOT
                  </label>
                  <select
                    name="pickupTimeSlot"
                    value={pickupDetails.pickupTimeSlot}
                    onChange={handleInputChange}
                    className="w-full border border-zinc-300 bg-white/80 backdrop-blur-xs p-2 font-mono text-xs text-zinc-950 focus:border-black outline-hidden"
                  >
                    <option value="10:00 AM - 12:00 PM">Morning (10:00 AM - 12:00 PM)</option>
                    <option value="12:00 PM - 2:00 PM">Midday (12:00 PM - 2:00 PM)</option>
                    <option value="2:00 PM - 4:00 PM">Afternoon (2:00 PM - 4:00 PM)</option>
                    <option value="4:00 PM - 6:00 PM">Late Afternoon (4:00 PM - 6:00 PM)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-zinc-700 font-bold uppercase mb-1">
                    VEHICLE TYPE &amp; LOADING NOTES (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={pickupDetails.vehicleType}
                    onChange={handleInputChange}
                    placeholder="e.g. Ford F-150 / SUV / Van with seats folded"
                    className="w-full border border-zinc-300 bg-white/80 backdrop-blur-xs p-2 font-mono text-xs text-zinc-950 focus:border-black outline-hidden"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* STANDARD SHIPPING ADDRESS FORM (< 10 LBS) */
            <div className="space-y-4 font-mono text-xs">
              <div className="border-l-2 border-emerald-500 pl-3">
                <h4 className="font-bold text-zinc-950 uppercase text-xs">
                  NATIONWIDE SHIPPING DESTINATION (&lt; 10 LBS)
                </h4>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  Packaged in reinforced studio cardboard with biodegradable wood-wool padding.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-700 font-bold uppercase mb-1">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    name="customerName"
                    value={shippingDetails.customerName}
                    onChange={handleInputChange}
                    placeholder="Full recipient name"
                    className="w-full border border-zinc-300 bg-white/80 backdrop-blur-xs p-2 font-mono text-xs text-zinc-950 focus:border-black outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-700 font-bold uppercase mb-1">
                    EMAIL FOR TRACKING *
                  </label>
                  <input
                    type="email"
                    required
                    name="customerEmail"
                    value={shippingDetails.customerEmail}
                    onChange={handleInputChange}
                    placeholder="recipient@example.com"
                    className="w-full border border-zinc-300 bg-white/80 backdrop-blur-xs p-2 font-mono text-xs text-zinc-950 focus:border-black outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-zinc-700 font-bold uppercase mb-1">
                    STREET ADDRESS *
                  </label>
                  <input
                    type="text"
                    required
                    name="addressLine1"
                    value={shippingDetails.addressLine1}
                    onChange={handleInputChange}
                    placeholder="123 Woodworker Blvd, Apt 4"
                    className="w-full border border-zinc-300 bg-white/80 backdrop-blur-xs p-2 font-mono text-xs text-zinc-950 focus:border-black outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-700 font-bold uppercase mb-1">
                    CITY *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full border border-zinc-300 bg-white/80 backdrop-blur-xs p-2 font-mono text-xs text-zinc-950 focus:border-black outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-zinc-700 font-bold uppercase mb-1">
                      STATE *
                    </label>
                    <input
                      type="text"
                      required
                      name="state"
                      value={shippingDetails.state}
                      onChange={handleInputChange}
                      placeholder="FL"
                      maxLength={2}
                      className="w-full border border-zinc-300 bg-white/80 backdrop-blur-xs p-2 font-mono text-xs text-zinc-950 focus:border-black outline-hidden uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-700 font-bold uppercase mb-1">
                      ZIP CODE *
                    </label>
                    <input
                      type="text"
                      required
                      name="postalCode"
                      value={shippingDetails.postalCode}
                      onChange={handleInputChange}
                      placeholder="33301"
                      className="w-full border border-zinc-300 bg-white/80 backdrop-blur-xs p-2 font-mono text-xs text-zinc-950 focus:border-black outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Switcher */}
          <div className="border-t border-zinc-200/60 pt-4 space-y-3 font-mono text-xs">
            <span className="text-[11px] font-bold uppercase text-zinc-950 block">
              COMMERCIAL PAYMENT GATEWAY:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Stripe Option */}
              <button
                type="button"
                onClick={() => setPaymentProvider("stripe")}
                className={`p-3.5 border text-left flex flex-col justify-between transition-all ${
                  paymentProvider === "stripe"
                    ? "border-black bg-zinc-950 text-white shadow-md ring-1 ring-black"
                    : "border-white/80 bg-white/80 hover:border-zinc-500 text-zinc-900 backdrop-blur-xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase text-xs">STRIPE CHECKOUT</span>
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-current" />
                  </div>
                </div>
                <p className={`text-[10px] mt-2 ${paymentProvider === "stripe" ? "text-zinc-300" : "text-zinc-500"}`}>
                  Credit / Debit cards, Apple Pay, Google Pay, Bank Transfer.
                </p>
              </button>

              {/* PayPal Commercial Option */}
              <button
                type="button"
                onClick={() => setPaymentProvider("paypal")}
                className={`p-3.5 border text-left flex flex-col justify-between transition-all ${
                  paymentProvider === "paypal"
                    ? "border-amber-500 bg-[#003087] text-white shadow-md ring-1 ring-amber-500"
                    : "border-white/80 bg-white/80 hover:border-zinc-500 text-zinc-900 backdrop-blur-xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black italic text-sm text-[#ffc439]">PayPal</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider bg-amber-400 text-black px-1.5 py-0.5">
                    COMMERCIAL
                  </span>
                </div>
                <p className={`text-[10px] mt-2 ${paymentProvider === "paypal" ? "text-zinc-200" : "text-zinc-500"}`}>
                  PayPal Balance, Pay in 4 monthly installments, Venmo US.
                </p>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="border border-red-500 bg-red-50 p-3 text-red-700 font-mono text-xs">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Complete Button */}
          <div className="border-t border-zinc-200/60 pt-4 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3.5 px-4 font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                paymentProvider === "paypal"
                  ? "bg-[#ffc439] hover:bg-[#f6b720] text-[#003087]"
                  : "bg-black hover:bg-zinc-800 text-white"
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="inline-block h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>AUTHORIZING {paymentProvider.toUpperCase()} DISPATCH...</span>
                </>
              ) : (
                <span>
                  CONFIRM &amp; PAY ${(grandTotalCents / 100).toFixed(2)} VIA {paymentProvider.toUpperCase()}
                </span>
              )}
            </button>
            <p className="text-center font-mono text-[10px] text-zinc-500">
              Encrypted 256-bit Commercial Transaction. Sales tax (7.0%) included for Florida studio jurisdiction.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
