"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

interface OrderData {
  orderId: string;
  paymentProvider: string;
  deliveryMethod: "shipping" | "pickup";
  grandTotalCents: number;
  totalWeightLbs: number;
  items: Array<{
    product: {
      name: string;
      itemCode: string;
      lotNumber: string;
      woodSpecies: string;
      weightLbs: number;
      priceCents: number;
    };
    quantity: number;
  }>;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    pickupDate?: string;
    pickupTimeSlot?: string;
    vehicleType?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  createdAt: string;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get("orderId");
  const queryProvider = searchParams.get("provider");

  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("vhw_latest_order");
      if (stored) {
        setOrder(JSON.parse(stored));
      } else {
        setOrder({
          orderId: queryOrderId || `VHW-FL-${Math.floor(100000 + Math.random() * 900000)}`,
          paymentProvider: queryProvider || "stripe",
          deliveryMethod: "pickup",
          grandTotalCents: 176550,
          totalWeightLbs: 48.0,
          items: [
            {
              product: {
                name: "Monolithic Slab Coffee Table",
                itemCode: "VHW-TB-02",
                lotNumber: "LOT #03",
                woodSpecies: "Single-Origin American Black Walnut",
                weightLbs: 48.0,
                priceCents: 165000,
              },
              quantity: 1,
            },
          ],
          customer: {
            name: "Private Collector",
            email: "collector@estate.com",
            phone: "(954) 555-0144",
            pickupDate: "Thursday, Next Week",
            pickupTimeSlot: "12:00 PM - 2:00 PM",
            vehicleType: "Full size SUV",
          },
          createdAt: new Date().toISOString(),
        });
      }
    } catch {
      // Ignore
    }
  }, [queryOrderId, queryProvider]);

  if (!order) {
    return (
      <div className="flex-1 flex items-center justify-center p-16 font-mono-luxury text-xs text-zinc-400">
        RETRIEVING ATELIER DISPATCH RECORD...
      </div>
    );
  }

  const isPickup = order.deliveryMethod === "pickup";

  return (
    <div className="relative flex-1 bg-[#fcfbf9] py-16 px-4 sm:px-6 font-sans-luxury">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-[15%] h-[600px] w-[600px] rounded-full bg-amber-200/15 blur-[150px]" />
        <div className="absolute bottom-[10%] right-[15%] h-[650px] w-[650px] rounded-full bg-stone-200/20 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-3xl">
        {/* Luxury Atelier Dossier */}
        <div className="glass-luxury rounded-3xl p-8 sm:p-12 shadow-2xl">
          {/* Header */}
          <div className="border-b border-zinc-200/70 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono-luxury text-[10px] text-amber-800 tracking-[0.2em] uppercase block mb-1">
                Official Atelier Acquisition &bull; Fort Lauderdale
              </span>
              <h1 className="text-3xl sm:text-4xl font-roffelia font-normal text-zinc-950 tracking-tight">
                VH Woodwork &bull; Receipt Dossier
              </h1>
            </div>
            <div className="text-left sm:text-right font-mono-luxury text-xs text-zinc-400">
              <span className="block text-[10px] uppercase">Dossier Ref</span>
              <span className="text-zinc-900 font-semibold text-sm">{order.orderId}</span>
            </div>
          </div>

          {/* Status Alert Banner */}
          <div className={`mt-6 rounded-2xl p-4 font-sans-luxury text-xs border ${
            isPickup
              ? "bg-amber-50/80 border-amber-200/80 text-amber-950"
              : "bg-emerald-50/80 border-emerald-200/80 text-emerald-950"
          }`}>
            <div className="flex items-center gap-2 font-medium font-mono-luxury text-[11px] uppercase tracking-wider">
              <span className="inline-block h-2 w-2 rounded-full bg-current" />
              <span>
                {isPickup
                  ? "Acquisition Confirmed &bull; Atelier Collection Reserved in Fort Lauderdale, FL"
                  : "Acquisition Confirmed &bull; Insured Nationwide Transit Queued"}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed">
              {isPickup
                ? "This acquisition includes solid hardwood pieces over 10 lbs. Studio technicians are preparing and conditioning your timber piece for inspection and private collection."
                : "This acquisition is under 10 lbs. Our crew will custom-crate your piece in reinforced cartons with full insured tracking within 24–48 hours."}
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {/* Fulfillment Directives Box */}
            <div className="rounded-2xl bg-[#f9f8f5] border border-zinc-200/60 p-5 font-sans-luxury text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2.5">
                <span className="font-mono-luxury text-[11px] font-semibold text-zinc-950 uppercase tracking-wider">
                  {isPickup ? "Atelier Collection Directive:" : "Delivery Destination:"}
                </span>
                <span className="rounded-full bg-zinc-950 text-white px-3 py-0.5 text-[10px] font-mono-luxury">
                  Mass: {order.totalWeightLbs} lbs
                </span>
              </div>

              {isPickup ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-400 font-mono-luxury block text-[10px] uppercase">Atelier Location:</span>
                    <p className="font-semibold text-zinc-950 mt-1">
                      VH WOODWORK ATELIER
                      <br />
                      1104 NE 3rd Ave
                      <br />
                      Fort Lauderdale, FL 33304
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Broward County &bull; Ground loading bay access
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-mono-luxury block text-[10px] uppercase">Collection Appointment:</span>
                    <p className="font-semibold text-zinc-950 mt-1">
                      {order.customer?.pickupDate || "Tue–Sat, 10:00–17:00 EST"}
                    </p>
                    <p className="text-zinc-600 text-[11px]">
                      Window: {order.customer?.pickupTimeSlot || "Coordinated by concierge"}
                    </p>
                    {order.customer?.vehicleType && (
                      <p className="text-zinc-500 text-[11px] mt-0.5">
                        Vehicle: {order.customer.vehicleType}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-zinc-950">{order.customer?.name}</p>
                  <p className="text-zinc-600">{order.customer?.address}</p>
                  <p className="text-zinc-600">
                    {order.customer?.city}, {order.customer?.state} {order.customer?.postalCode}
                  </p>
                </div>
              )}
            </div>

            {/* Line Items Table */}
            <div>
              <span className="font-mono-luxury text-[11px] uppercase tracking-wider text-zinc-400 block mb-2.5">
                Acquired Works:
              </span>
              <table className="w-full text-left font-sans-luxury text-xs border border-zinc-200/60 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-zinc-100/60 border-b border-zinc-200/60 text-[10px] font-mono-luxury uppercase text-zinc-500">
                    <th className="p-3">Reference</th>
                    <th className="p-3">Work &amp; Timber</th>
                    <th className="p-3 text-center">Mass</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Acquisition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 whitespace-nowrap font-mono-luxury text-zinc-900 font-semibold">
                        {item.product.lotNumber}
                        <span className="block text-[10px] font-normal text-zinc-400">{item.product.itemCode}</span>
                      </td>
                      <td className="p-3">
                        <div className="font-roffelia text-base font-normal text-zinc-950">{item.product.name}</div>
                        <div className="text-[11px] text-zinc-500">{item.product.woodSpecies}</div>
                      </td>
                      <td className="p-3 text-center font-mono-luxury whitespace-nowrap">
                        {item.product.weightLbs} lbs
                      </td>
                      <td className="p-3 text-center font-mono-luxury">{item.quantity}</td>
                      <td className="p-3 text-right font-mono-luxury font-medium whitespace-nowrap">
                        ${((item.product.priceCents * item.quantity) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Ledger */}
            <div className="border-t border-zinc-200/60 pt-4 flex flex-col items-end font-sans-luxury text-xs space-y-1.5">
              <div className="flex justify-between w-64 text-zinc-500">
                <span>Fulfillment Fee:</span>
                <span className="font-mono-luxury font-medium text-zinc-950">{isPickup ? "Complimentary" : "$18.00"}</span>
              </div>
              <div className="flex justify-between w-64 text-zinc-500">
                <span>FL Sales Tax (7.0%):</span>
                <span className="font-mono-luxury font-medium text-zinc-950">
                  ${(Math.round(order.grandTotalCents * 0.07 / 1.07) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between w-64 text-sm font-semibold text-zinc-950 border-t border-zinc-200 pt-2 font-mono-luxury">
                <span>Total Settled:</span>
                <span>${(order.grandTotalCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })} USD</span>
              </div>
              <div className="text-[10px] font-mono-luxury text-zinc-400 pt-1">
                Settled via {order.paymentProvider.toUpperCase()} Commercial Concierge Gateway
              </div>
            </div>

            {/* Back action */}
            <div className="border-t border-zinc-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/"
                className="w-full sm:w-auto rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-sans-luxury text-xs uppercase tracking-wider font-medium py-3.5 px-8 text-center transition-colors shadow-xs"
              >
                &larr; Return to Collection
              </Link>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto rounded-full border border-zinc-300 hover:bg-zinc-100 text-zinc-800 font-sans-luxury text-xs uppercase tracking-wider font-medium py-3.5 px-8 text-center transition-colors"
              >
                Print Acquisition Dossier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#fcfbf9]">
        <Header />
        <Suspense fallback={<div className="p-16 text-center font-mono-luxury text-xs text-zinc-400">LOADING DOSSIER...</div>}>
          <OrderConfirmationContent />
        </Suspense>
        <Footer />
      </div>
    </CartProvider>
  );
}
