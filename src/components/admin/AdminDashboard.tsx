"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/store";

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

function blankProduct(): Product {
  return {
    id: "", lotNumber: "", itemCode: "", name: "", tagline: "", category: "studio-objects", placement: "interior",
    priceCents: 0, weightLbs: 1, woodSpecies: "", finish: "", dimensions: "", joinery: "", leadTime: "",
    inStock: true, stockCount: 1, isSoldOut: false, description: "", primaryImage: "", secondaryImage: "", provenance: "Coral Springs, FL",
  };
}

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
  const [draft, setDraft] = useState<Product | null>(null);
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
  const visibleProducts = products.filter((product) => `${product.name} ${product.itemCode} ${product.category}`.toLowerCase().includes(search.toLowerCase()));
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

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    setSaving(true); setNotice(""); setError("");
    try {
      const isNew = !draft.id;
      const result = await jsonRequest<{ product: Product }>("/api/admin/inventory", { method: isNew ? "POST" : "PUT", body: JSON.stringify(draft) });
      setProducts((current) => isNew ? [...current, result.product] : current.map((product) => product.id === result.product.id ? result.product : product));
      setDraft(result.product);
      setNotice(isNew ? "Item added to the collection." : "Item updated.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save item"); }
    finally { setSaving(false); }
  }

  async function removeProduct() {
    if (!draft?.id || !window.confirm(`Delete ${draft.name} from inventory? This cannot be undone.`)) return;
    setSaving(true); setNotice(""); setError("");
    try {
      await jsonRequest("/api/admin/inventory?id=" + encodeURIComponent(draft.id), { method: "DELETE" });
      setProducts((current) => current.filter((product) => product.id !== draft.id));
      setDraft(null);
      setNotice("Item deleted from inventory.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not delete item"); }
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

          {tab === "inventory" && <><div className="flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-zinc-500">Add, edit, and remove items shown in the shop.</p><div className="flex w-full gap-2 sm:w-auto"><input aria-label="Search inventory" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search inventory" className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-900 sm:w-64" /><button onClick={() => setDraft(blankProduct())} className="whitespace-nowrap rounded-xl bg-zinc-950 px-4 py-3 text-xs text-white hover:bg-zinc-800">+ Add item</button></div></div><div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,.9fr)]"><section className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-xs"><table className="w-full min-w-[610px] text-left text-sm"><thead className="border-b border-zinc-100 bg-zinc-50 text-xs text-zinc-500"><tr><th className="px-5 py-4">Item</th><th>Placement</th><th>Stock</th><th className="pr-5 text-right">Price</th></tr></thead><tbody>{visibleProducts.map((product) => <tr key={product.id} onClick={() => setDraft({ ...product })} className={`cursor-pointer border-b border-zinc-100 last:border-0 hover:bg-amber-50/50 ${draft?.id === product.id ? "bg-amber-50" : ""}`}><td className="flex items-center gap-3 px-5 py-3"><Image unoptimized src={product.primaryImage} alt="" width={48} height={48} className="h-12 w-12 rounded-lg bg-zinc-100 object-cover" /><span><span className="block font-medium">{product.name}</span><span className="mt-1 block font-mono-luxury text-[10px] text-zinc-400">{product.itemCode}</span></span></td><td className="capitalize">{product.placement}</td><td><span className={`rounded-full px-2.5 py-1 text-[11px] ${product.stockCount <= 2 ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}>{product.isSoldOut || !product.inStock ? "Unavailable" : product.stockCount}</span></td><td className="pr-5 text-right font-medium">{money(product.priceCents)}</td></tr>)}</tbody></table>{visibleProducts.length === 0 && <p className="p-8 text-center text-sm text-zinc-500">No inventory items match your search.</p>}</section><section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">{draft ? <form onSubmit={saveProduct} className="space-y-4"><div className="flex items-start justify-between gap-3"><div><p className="font-mono-luxury text-[11px] uppercase tracking-wider text-amber-800">{draft.id ? "Edit inventory" : "New inventory"}</p><h2 className="mt-1 font-roffelia text-2xl">{draft.id ? draft.name : "Add a work"}</h2></div><button type="button" onClick={() => setDraft(null)} aria-label="Close editor" className="text-zinc-400 hover:text-zinc-900">✕</button></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Name" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} required /><Field label="Item code" value={draft.itemCode} onChange={(value) => setDraft({ ...draft, itemCode: value })} required /><Field label="Lot number" value={draft.lotNumber} onChange={(value) => setDraft({ ...draft, lotNumber: value })} required /><Field label="Wood species" value={draft.woodSpecies} onChange={(value) => setDraft({ ...draft, woodSpecies: value })} required /><label className="text-xs font-medium">Category<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as Product["category"] })} className="mt-2 w-full rounded-xl border border-zinc-200 p-3 text-sm"><option value="seating">Seating</option><option value="tables">Tables & slabs</option><option value="storage">Cabinetry</option><option value="studio-objects">Atelier objects</option></select></label><label className="text-xs font-medium">Placement<select value={draft.placement} onChange={(event) => setDraft({ ...draft, placement: event.target.value as Product["placement"] })} className="mt-2 w-full rounded-xl border border-zinc-200 p-3 text-sm"><option value="interior">Interior</option><option value="exterior">Exterior</option></select></label><Field label="Price (USD)" type="number" value={String(draft.priceCents / 100)} onChange={(value) => setDraft({ ...draft, priceCents: Math.round(Number(value) * 100) })} required /><Field label="Weight (lbs)" type="number" value={String(draft.weightLbs)} onChange={(value) => setDraft({ ...draft, weightLbs: Number(value) })} required /><Field label="Stock count" type="number" value={String(draft.stockCount)} onChange={(value) => setDraft({ ...draft, stockCount: Number(value) })} required /><Field label="Dimensions" value={draft.dimensions} onChange={(value) => setDraft({ ...draft, dimensions: value })} /></div><Field label="Primary image URL (HTTPS or /path)" value={draft.primaryImage} onChange={(value) => setDraft({ ...draft, primaryImage: value })} required /><Field label="Secondary image URL" value={draft.secondaryImage} onChange={(value) => setDraft({ ...draft, secondaryImage: value })} /><Field label="Tagline" value={draft.tagline} onChange={(value) => setDraft({ ...draft, tagline: value })} /><Field label="Finish" value={draft.finish} onChange={(value) => setDraft({ ...draft, finish: value })} /><Field label="Joinery" value={draft.joinery} onChange={(value) => setDraft({ ...draft, joinery: value })} /><Field label="Lead time" value={draft.leadTime} onChange={(value) => setDraft({ ...draft, leadTime: value })} /><label className="block text-xs font-medium">Description<textarea rows={4} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="mt-2 w-full rounded-xl border border-zinc-200 p-3 text-sm" /></label><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={draft.inStock} onChange={(event) => setDraft({ ...draft, inStock: event.target.checked })} /> Available for purchase</label><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={Boolean(draft.isSoldOut)} onChange={(event) => setDraft({ ...draft, isSoldOut: event.target.checked })} /> Mark sold out</label><div className="flex gap-2 pt-2"><button disabled={saving} className="flex-1 rounded-xl bg-zinc-950 px-5 py-3 text-sm text-white hover:bg-zinc-800 disabled:opacity-50">{saving ? "Saving…" : draft.id ? "Save changes" : "Add item"}</button>{draft.id && <button type="button" disabled={saving} onClick={removeProduct} className="rounded-xl border border-red-200 px-4 py-3 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50">Delete</button>}</div></form> : <div className="py-16 text-center text-sm text-zinc-500">Select an item to edit or add a new work.</div>}</section></div></>}
        </>}
      </main>
    </div>
  </div>;
}

function Field({ label, value, onChange, required = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string }) {
  return <label className="block text-xs font-medium">{label}<input type={type} step={type === "number" ? "any" : undefined} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:border-zinc-900" /></label>;
}
