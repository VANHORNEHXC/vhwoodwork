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
        // Fallback simulated order if accessed directly via URL
        setOrder({
          orderId: queryOrderId || `VHW-FL-${Math.floor(100000 + Math.random() * 900000)}`,
          paymentProvider: queryProvider || "stripe",
          deliveryMethod: "pickup",
          grandTotalCents: 176550, // $1,765.50
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
            name: "Studio Collector",
            email: "collector@example.com",
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
      <div className="flex-1 flex items-center justify-center p-12 font-mono text-xs">
        LOADING DISPATCH RECORD...
      </div>
    );
  }

  const isPickup = order.deliveryMethod === "pickup";

  return (
    <div className="relative flex-1 bg-[#f7f7f5] py-12 px-4 sm:px-6">
      {/* Ambient background light gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-[15%] h-[500px] w-[500px] rounded-full bg-amber-500/8 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[15%] h-[550px] w-[550px] rounded-full bg-emerald-500/6 blur-[130px]" />
      </div>
      <div className="mx-auto max-w-3xl">
        {/* Tom Sachs style workshop invoice / dispatch docket with glassmorphism */}
        <div className="border border-white/80 bg-white/90 backdrop-blur-2xl shadow-2xl">
          {/* Header strip */}
          <div className="border-b-2 border-zinc-950 bg-zinc-950 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-widest block">
                OFFICIAL WORKSHOP DISPATCH DOCKET
              </span>
              <h1 className="text-xl font-black font-sans uppercase tracking-tight text-white mt-0.5">
                VH WOODWORK — FORT LAUDERDALE, FL
              </h1>
            </div>
            <div className="text-right font-mono text-xs">
              <span className="text-zinc-400 block text-[10px]">ORDER IDENTIFIER:</span>
              <span className="text-white font-bold text-sm">{order.orderId}</span>
            </div>
          </div>

          {/* Status Alert Banner */}
          <div className={`p-4 font-mono text-xs border-b border-zinc-900 ${
            isPickup
              ? "bg-amber-100 text-amber-950"
              : "bg-emerald-100 text-emerald-950"
          }`}>
            <div className="flex items-center gap-2 font-bold uppercase text-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-current" />
              <span>
                {isPickup
                  ? "✓ PAYMENT CONFIRMED — STUDIO PICKUP RESERVED IN FORT LAUDERDALE, FL"
                  : "✓ PAYMENT CONFIRMED — NATIONWIDE PARCEL DISPATCH QUEUED"}
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed">
              {isPickup
                ? "This order contains solid wood pieces over 10 lbs. Studio technicians are preparing and conditioning your timber piece for inspection and loading."
                : "This order is under 10 lbs. Studio technicians will custom-package your object in reinforced double-wall cartons with tracking dispatch within 24-48 hours."}
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Fulfillment Directives Box */}
            <div className="border border-zinc-900 bg-zinc-50 p-4 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-300 pb-2">
                <span className="font-bold text-zinc-950 uppercase">
                  {isPickup ? "STUDIO PICKUP INSTRUCTIONS:" : "SHIPPING DESTINATION:"}
                </span>
                <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase">
                  WEIGHT: {order.totalWeightLbs} LBS
                </span>
              </div>

              {isPickup ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-600 block text-[10px] uppercase font-semibold">STUDIO LOCATION:</span>
                    <p className="font-bold text-zinc-950 mt-0.5">
                      VH WOODWORK STUDIO
                      <br />
                      1104 NE 3rd Ave
                      <br />
                      Fort Lauderdale, FL 33304
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      (Just off Sunrise Blvd &amp; US-1 • Easy bay loading)
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[10px] uppercase font-semibold">PICKUP WINDOW:</span>
                    <p className="font-bold text-zinc-950 mt-0.5">
                      {order.customer?.pickupDate || "Tue–Sat, 10am–5pm"}
                    </p>
                    <p className="text-zinc-700 text-[11px]">
                      Time Slot: {order.customer?.pickupTimeSlot || "Coordinated by phone"}
                    </p>
                    {order.customer?.vehicleType && (
                      <p className="text-zinc-500 text-[10px] mt-1">
                        Vehicle: {order.customer.vehicleType}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2 bg-white border border-zinc-300 p-2.5 text-[11px] text-zinc-700">
                    <strong className="text-black uppercase">Studio Loading Notice:</strong> Heavy solid hardwood objects are wrapped in protective bubble foam and heavy mover blankets. Our studio crew will assist with vehicle loading and tie-downs.
                  </div>
                </div>
              ) : (
                <div className="text-xs space-y-1">
                  <p className="font-bold text-zinc-950">{order.customer?.name}</p>
                  <p className="text-zinc-700">{order.customer?.address}</p>
                  <p className="text-zinc-700">
                    {order.customer?.city}, {order.customer?.state} {order.customer?.postalCode}
                  </p>
                  <p className="text-zinc-500 text-[10px] pt-1">
                    Tracking number will be emailed to {order.customer?.email} as soon as carrier scans the parcel.
                  </p>
                </div>
              )}
            </div>

            {/* Line Items Table */}
            <div>
              <span className="font-mono text-xs font-bold uppercase text-zinc-950 block mb-2">
                ACQUIRED LOTS &amp; SPECIFICATIONS:
              </span>
              <table className="w-full text-left font-mono text-xs border border-zinc-900">
                <thead>
                  <tr className="bg-zinc-100 border-b border-zinc-900 text-[10px] uppercase text-zinc-600">
                    <th className="p-2.5">LOT / CODE</th>
                    <th className="p-2.5">DESCRIPTION &amp; TIMBER</th>
                    <th className="p-2.5 text-center">WEIGHT</th>
                    <th className="p-2.5 text-center">QTY</th>
                    <th className="p-2.5 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 whitespace-nowrap font-bold text-black">
                        {item.product.lotNumber}
                        <span className="block text-[10px] font-normal text-zinc-500">{item.product.itemCode}</span>
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-zinc-950">{item.product.name}</div>
                        <div className="text-[10px] text-zinc-500">{item.product.woodSpecies}</div>
                      </td>
                      <td className="p-2.5 text-center whitespace-nowrap font-semibold">
                        {item.product.weightLbs} lbs
                      </td>
                      <td className="p-2.5 text-center">{item.quantity}</td>
                      <td className="p-2.5 text-right font-bold whitespace-nowrap">
                        ${((item.product.priceCents * item.quantity) / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Ledger */}
            <div className="border-t border-zinc-900 pt-4 flex flex-col items-end font-mono text-xs space-y-1">
              <div className="flex justify-between w-64 text-zinc-600">
                <span>FULFILLMENT FEE:</span>
                <span className="text-zinc-950 font-bold">{isPickup ? "$0.00 (STUDIO PICKUP)" : "$18.00"}</span>
              </div>
              <div className="flex justify-between w-64 text-zinc-600">
                <span>FL SALES TAX (7.0%):</span>
                <span className="text-zinc-950 font-bold">
                  ${(Math.round(order.grandTotalCents * 0.07 / 1.07) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between w-64 text-sm font-black text-zinc-950 border-t border-zinc-900 pt-1.5">
                <span>TOTAL PAID:</span>
                <span>${(order.grandTotalCents / 100).toFixed(2)} USD</span>
              </div>
              <div className="text-[10px] text-zinc-500 pt-1">
                Settled via {order.paymentProvider.toUpperCase()} Commercial Gateway • Authorization Verified
              </div>
            </div>

            {/* Back action */}
            <div className="border-t border-zinc-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/"
                className="w-full sm:w-auto bg-black hover:bg-zinc-800 text-white font-mono text-xs uppercase font-bold py-3 px-6 text-center transition-colors"
              >
                &larr; RETURN TO CATALOG
              </Link>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto border border-zinc-900 hover:bg-zinc-100 text-zinc-900 font-mono text-xs uppercase font-bold py-3 px-6 text-center transition-colors"
              >
                PRINT DISPATCH DOCKET
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
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs">LOADING ORDER DOCKET...</div>}>
          <OrderConfirmationContent />
        </Suspense>
        <Footer />
      </div>
    </CartProvider>
  );
}

