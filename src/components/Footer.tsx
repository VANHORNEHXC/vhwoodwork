"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-black text-zinc-400 font-mono text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-800">
          {/* Brand */}
          <div className="space-y-3">
            <span className="text-xl font-black uppercase text-white font-sans tracking-tight">
              VH WOODWORK
            </span>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
              Hand-built utilitarian hardwood furniture and fine studio sculpture. Made with pride in Fort Lauderdale, Broward County, Florida.
            </p>
            <div className="text-[10px] text-zinc-600">
              SERIAL REGISTER // EDITION 2026.1
            </div>
          </div>

          {/* Location & Pickup */}
          <div className="space-y-2">
            <span className="text-white font-bold uppercase text-[11px] block">
              FORT LAUDERDALE STUDIO
            </span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              1104 NE 3rd Ave
              <br />
              Fort Lauderdale, FL 33304
              <br />
              United States
            </p>
            <p className="text-zinc-500 text-[10px]">
              Studio Pickup: Tue–Sat, 10am–5pm by appointment. Loading dock available for truck/SUV transport.
            </p>
          </div>

          {/* Shipping Policy Breakdown */}
          <div className="space-y-2">
            <span className="text-white font-bold uppercase text-[11px] block">
              FULFILLMENT DIRECTIVE
            </span>
            <ul className="space-y-1.5 text-[11px] text-zinc-400">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">&lt; 10 LBS:</span>
                <span>Tracked nationwide shipping via USPS / UPS.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">&gt; 10 LBS:</span>
                <span>Studio pickup required in Fort Lauderdale, FL.</span>
              </li>
              <li className="text-[10px] text-zinc-500 pt-1">
                Custom interstate freight quotes available upon request.
              </li>
            </ul>
          </div>

          {/* Accepted Payments */}
          <div className="space-y-2">
            <span className="text-white font-bold uppercase text-[11px] block">
              COMMERCIAL PAYMENT
            </span>
            <p className="text-[11px] text-zinc-400">
              Florida Merchant Account powered by:
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
              <span className="border border-zinc-700 bg-zinc-900 px-2 py-1 text-white font-bold">
                STRIPE VERIFIED
              </span>
              <span className="border border-amber-600 bg-amber-400 text-black px-2 py-1 font-bold">
                PAYPAL BUSINESS
              </span>
              <span className="border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-300">
                PAY IN 4
              </span>
              <span className="border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-300">
                APPLE PAY
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 pt-1">
              7.0% Broward County / Florida Sales Tax applies to FL deliveries &amp; pickups.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} VH WOODWORK LLC. ALL RIGHTS RESERVED. FORT LAUDERDALE, FL.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">TERMS OF SALE</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">WOOD CARE PROTOCOL</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">STUDIO POLICIES</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

