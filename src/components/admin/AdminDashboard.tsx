"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/store";
import { InventoryPanel } from "@/components/admin/InventoryPanel";

type Tab = "overview" | "orders" | "inventory";
type Order = {
  id: string;
  paymentProvider: string;
  paymentStatus: "pending" | "paid";
  deliveryMethod: "shipping" | "pickup";
  grandTotalCents: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string | null;
  pickupDate: string | null;
  pickupTimeSlot: string | null;
  items: Array<{ id: string; name: string; quantity: number; priceCents: number }>;
  status: string;
  trackingNumber: string | null;
  fulfillmentNotes: string | null;
  createdAt: string;
};
type OrderDraft = { status: string; paymentStatus: "pending" | "paid"; trackingNumber: string; fulfillmentNotes: string };

const statusLabels: Record<string, string> = {
  new: "New", preparing: "Preparing", ready_for_pickup: "Ready for pickup", shipped: "Shipped", fulfilled: "Fulfilled", cancelled: "Cancelled",
};
const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
const date = (value: string) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

async function jsonRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...options?.headers } });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Request failed");
  return result as T;
}

function StatCard({ label, value, note }: { label: string; value: string | number; note: string }) {
  return <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
    <p className="text-xs text-zinc-500">{label}</p><p className="mt-4 font-roffelia text-4xl text-zinc-950">{value}</p><p className="mt-2 text-[11px] text-zinc-400">{note}</p>
  </div>;
}
export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDraft, setOrderDraft] = useState<OrderDraft | null>(null);
  const [saving, setSaving] = useState(false);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [inventoryResult, orderResult] = await Promise.all([
        jsonRequest<{ products: Product[] }>("/api/admin/inventory"),
        jsonRequest<{ orders: Order[] }>("/api/admin/orders"),
      ]);
      setProducts(inventoryResult.products);
      setOrders(orderResult.orders);
      setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Data unavailable"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { queueMicrotask(() => { void refreshData(); }); }, [refreshData]);

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) || null;
  const visibleOrders = orders.filter((order) => `${order.id} ${order.customerName} ${order.customerEmail}`.toLowerCase().includes(search.toLowerCase()));
  const paidOrders = orders.filter((order) => order.paymentStatus === "paid" && order.status !== "cancelled");
  const openOrders = orders.filter((order) => !["fulfilled", "cancelled"].includes(order.status));
  const lowStock = products.filter((product) => product.stockCount <= 2 || !product.inStock || product.isSoldOut);

  const sevenDays = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const day = new Date(); day.setHours(0, 0, 0, 0); day.setDate(day.getDate() - (6 - index));
    const count = orders.filter((order) => new Date(order.createdAt).toDateString() === day.toDateString()).length;
    return { label: day.toLocaleDateString("en-US", { weekday: "short" }), count };
  }), [orders]);
  const maxBar = Math.max(1, ...sevenDays.map((day) => day.count));

  function selectOrder(order: Order) {
    setSelectedOrderId(order.id);
    setOrderDraft({ status: order.status, paymentStatus: order.paymentStatus, trackingNumber: order.trackingNumber || "", fulfillmentNotes: order.fulfillmentNotes || "" });
  }

  async function saveOrder() {
    if (!selectedOrder || !orderDraft) return;
    setSaving(true); setNotice(""); setError("");
    try {
      const result = await jsonRequest<{ order: Order }>("/api/admin/orders", { method: "PATCH", body: JSON.stringify({ id: selectedOrder.id, ...orderDraft }) });
      setOrders((current) => current.map((order) => order.id === result.order.id ? result.order : order));
      setNotice(`Order ${result.order.id} updated.`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save order"); }
    finally { setSaving(false); }
  }

  async function signOut() {
    await jsonRequest("/api/admin/auth", { method: "DELETE" });
    router.refresh();
  }

  return <div className="min-h-screen bg-[#f5f5f2] font-sans-luxury text-zinc-900 md:flex">
    <aside className="flex shrink-0 flex-col bg-[#171a1b] p-5 text-white md:min-h-screen md:w-64 md:p-6">
      <div className="flex items-center justify-between md:block">
        <div><p className="font-roffelia text-xl tracking-[0.12em]">VH WOODWORK</p><p className="mt-1 font-mono-luxury text-[9px] uppercase tracking-[0.22em] text-zinc-400">Owner dashboard</p></div>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] text-zinc-300 md:mt-8 md:inline-block">Coral Springs, FL</span>
      </div>
      <nav aria-label="Admin sections" className="mt-5 flex gap-2 overflow-x-auto md:mt-10 md:flex-col">
        {(["overview", "orders", "inventory"] as Tab[]).map((item) => <button key={item} onClick={() => { setTab(item); setSearch(""); }} className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm capitalize transition ${tab === item ? "bg-white text-zinc-950" : "text-zinc-400 hover:bg-white/10 hover:text-white"}`}>{item === "orders" ? "Orders & fulfillment" : item}</button>)}
      </nav>
      <div className="mt-auto hidden border-t border-white/10 pt-6 md:block"><p className="text-sm">Dario VanHorne</p><p className="mt-1 text-xs text-zinc-500">Owner</p></div>
    </aside>

    <div className="min-w-0 flex-1">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 bg-white px-5 py-5 sm:px-8">
        <div><p className="font-mono-luxury text-[10px] uppercase tracking-[0.2em] text-zinc-400">VH Woodwork / Admin</p><h1 className="mt-1 font-roffelia text-3xl capitalize">{tab === "orders" ? "Orders & Fulfillment" : tab}</h1></div>
        <div className="flex items-center gap-3"><Link href="/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs hover:bg-zinc-50">View shop ↗</Link><button onClick={signOut} className="rounded-xl bg-zinc-950 px-4 py-2.5 text-xs text-white hover:bg-zinc-800">Sign out</button></div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-6 p-5 sm:p-8">
        {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
        {loading ? <div className="rounded-2xl bg-white p-12 text-center text-sm text-zinc-500">Loading dashboard…</div> : <>
          {tab === "overview" && <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Paid order estimates" value={money(paidOrders.reduce((sum, order) => sum + order.grandTotalCents, 0))} note="Recorded value before tax" />
              <StatCard label="Open orders" value={openOrders.length} note="Awaiting fulfillment" />
              <StatCard label="Inventory items" value={products.length} note="Current collection" />
              <StatCard label="Low stock" value={lowStock.length} note="Two or fewer remaining" />
            </div>
            <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs"><div className="flex items-center justify-between"><div><h2 className="text-base font-semibold">Orders received</h2><p className="mt-1 text-xs text-zinc-500">Last seven days</p></div><span className="text-xs text-zinc-400">{orders.length} total</span></div><div className="mt-8 flex h-52 items-end gap-3 border-b border-zinc-100 pb-3">{sevenDays.map((day, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] text-zinc-500">{day.count || ""}</span><div className="w-full max-w-12 rounded-t-lg bg-amber-500/80" style={{ height: `${Math.max(day.count ? 12 : 2, day.count / maxBar * 75)}%` }} /><span className="text-[10px] text-zinc-400">{day.label}</span></div>)}</div></section>
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs"><h2 className="text-base font-semibold">Needs attention</h2><p className="mt-1 text-xs text-zinc-500">Orders and stock to review</p><div className="mt-6 space-y-3"><button onClick={() => setTab("orders")} className="flex w-full items-center justify-between rounded-xl bg-[#f8f7f4] px-4 py-4 text-left text-sm"><span>Pending payment</span><strong>{orders.filter((order) => order.paymentStatus === "pending").length}</strong></button><button onClick={() => setTab("orders")} className="flex w-full items-center justify-between rounded-xl bg-[#f8f7f4] px-4 py-4 text-left text-sm"><span>Open fulfillment</span><strong>{openOrders.length}</strong></button><button onClick={() => setTab("inventory")} className="flex w-full items-center justify-between rounded-xl bg-[#f8f7f4] px-4 py-4 text-left text-sm"><span>Low stock or unavailable</span><strong>{lowStock.length}</strong></button></div></section>
            </div>
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs"><div className="mb-5 flex items-center justify-between"><h2 className="text-base font-semibold">Recent orders</h2><button onClick={() => setTab("orders")} className="text-xs text-amber-800">View all →</button></div>{orders.length ? <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-zinc-100 text-xs text-zinc-400"><tr><th className="pb-3">Order</th><th>Customer</th><th>Placed</th><th>Payment</th><th>Status</th><th className="text-right">Est. value</th></tr></thead><tbody>{orders.slice(0, 5).map((order) => <tr key={order.id} className="border-b border-zinc-100 last:border-0"><td className="py-4 font-mono-luxury text-xs">{order.id}</td><td>{order.customerName}</td><td>{date(order.createdAt)}</td><td className="capitalize">{order.paymentStatus}</td><td>{statusLabels[order.status] || order.status}</td><td className="text-right">{money(order.grandTotalCents)}</td></tr>)}</tbody></table></div> : <p className="py-8 text-sm text-zinc-500">No orders yet. New order requests will appear here.</p>}</section>
          </>}

          {tab === "orders" && <><div className="flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-zinc-500">Track payment, preparation, collection, and shipping from one place.</p><input aria-label="Search orders" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search orders or customers" className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-900 sm:w-72" /></div><div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,.8fr)]"><section className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-xs"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-zinc-100 bg-zinc-50 text-xs text-zinc-500"><tr><th className="px-5 py-4">Order / customer</th><th>Method</th><th>Payment</th><th>Status</th><th className="pr-5 text-right">Est. value</th></tr></thead><tbody>{visibleOrders.map((order) => <tr key={order.id} onClick={() => selectOrder(order)} className={`cursor-pointer border-b border-zinc-100 last:border-0 hover:bg-amber-50/50 ${selectedOrderId === order.id ? "bg-amber-50" : ""}`}><td className="px-5 py-4"><span className="block font-mono-luxury text-[11px] font-medium">{order.id}</span><span className="mt-1 block text-zinc-500">{order.customerName} · {date(order.createdAt)}</span></td><td className="capitalize">{order.deliveryMethod}</td><td><span className={`rounded-full px-2.5 py-1 text-[11px] ${order.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>{order.paymentStatus}</span></td><td>{statusLabels[order.status] || order.status}</td><td className="pr-5 text-right font-medium">{money(order.grandTotalCents)}</td></tr>)}</tbody></table>{visibleOrders.length === 0 && <p className="p-8 text-center text-sm text-zinc-500">No orders match your search.</p>}</section><section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">{selectedOrder && orderDraft ? <div className="space-y-5"><div><p className="font-mono-luxury text-xs text-amber-800">{selectedOrder.id}</p><h2 className="mt-1 font-roffelia text-2xl">Fulfillment details</h2></div><div className="grid gap-2 rounded-xl bg-[#f8f7f4] p-4 text-xs"><p><strong>Customer:</strong> {selectedOrder.customerName}</p><p><strong>Email:</strong> {selectedOrder.customerEmail}</p>{selectedOrder.customerPhone && <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>}<p><strong>Delivery:</strong> {selectedOrder.deliveryMethod === "shipping" ? selectedOrder.shippingAddress : "Pickup in Coral Springs (address by appointment)"}</p>{selectedOrder.pickupDate && <p><strong>Requested date:</strong> {selectedOrder.pickupDate} {selectedOrder.pickupTimeSlot || ""}</p>}</div><div className="space-y-1 text-xs">{selectedOrder.items.map((item) => <p key={item.id} className="flex justify-between"><span>{item.quantity} × {item.name}</span><span>{money(item.priceCents * item.quantity)}</span></p>)}</div><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-medium">Payment status<select value={orderDraft.paymentStatus} onChange={(event) => setOrderDraft({ ...orderDraft, paymentStatus: event.target.value as OrderDraft["paymentStatus"] })} className="mt-2 w-full rounded-xl border border-zinc-200 p-3 text-sm"><option value="pending">Pending</option><option value="paid">Paid</option></select></label><label className="text-xs font-medium">Fulfillment status<select value={orderDraft.status} onChange={(event) => setOrderDraft({ ...orderDraft, status: event.target.value })} className="mt-2 w-full rounded-xl border border-zinc-200 p-3 text-sm">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div><label className="block text-xs font-medium">Tracking number<input value={orderDraft.trackingNumber} onChange={(event) => setOrderDraft({ ...orderDraft, trackingNumber: event.target.value })} placeholder="Add once shipped" className="mt-2 w-full rounded-xl border border-zinc-200 p-3 text-sm" /></label><label className="block text-xs font-medium">Fulfillment notes<textarea rows={3} value={orderDraft.fulfillmentNotes} onChange={(event) => setOrderDraft({ ...orderDraft, fulfillmentNotes: event.target.value })} placeholder="Internal notes for this order" className="mt-2 w-full rounded-xl border border-zinc-200 p-3 text-sm" /></label><button disabled={saving} onClick={saveOrder} className="w-full rounded-xl bg-zinc-950 px-5 py-3 text-sm text-white hover:bg-zinc-800 disabled:opacity-50">Save order</button></div> : <div className="py-16 text-center text-sm text-zinc-500">Select an order to manage fulfillment.</div>}</section></div></>}

          {tab === "inventory" && <InventoryPanel products={products} setProducts={setProducts} />}
        </>}
      </main>
    </div>
  </div>;
}
