"use client";

import { useRef, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import Image from "next/image";
import type { Product } from "@/types/store";

type Filter = "all" | "available" | "unavailable";
type Props = {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
};

const categoryOptions: Array<{ value: Product["category"]; label: string }> = [
  { value: "seating", label: "Seating" },
  { value: "tables", label: "Tables & slabs" },
  { value: "storage", label: "Cabinetry" },
  { value: "studio-objects", label: "Wood objects" },
];

function newProduct(): Product {
  return {
    id: "", itemCode: "", lotNumber: "", name: "", tagline: "", category: "studio-objects",
    placement: "interior", priceCents: 0, weightLbs: 0, woodSpecies: "", finish: "",
    dimensions: "", joinery: "", leadTime: "", stockCount: 1, inStock: true,
    isSoldOut: false, description: "", primaryImage: "", secondaryImage: "", provenance: "Coral Springs, FL",
  };
}

function available(product: Product): boolean {
  return product.inStock && !product.isSoldOut && product.stockCount > 0;
}

function imageSrc(value: string): string {
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try { if (new URL(value).protocol === "https:") return value; } catch { /* Preview uses placeholder */ }
  return "/wood-placeholder.svg";
}

function editableProduct(product: Product): Product {
  return {
    ...product,
    primaryImage: product.primaryImage === "/wood-placeholder.svg" ? "" : product.primaryImage,
    secondaryImage: product.secondaryImage === product.primaryImage ? "" : product.secondaryImage,
  };
}

async function inventoryRequest<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json" } });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Could not update inventory");
  return result as T;
}

function Input({ label, value, onChange, required = false, type = "text", min, step, placeholder }: {
  label: string; value: string | number; onChange: (value: string) => void; required?: boolean;
  type?: string; min?: number; step?: string; placeholder?: string;
}) {
  return <label className="block text-xs font-medium text-zinc-700">
    {label}
    <input type={type} min={min} step={step} required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-950 outline-none transition focus:border-[#9e7143] focus:ring-2 focus:ring-[#9e7143]/10" />
  </label>;
}

export function InventoryPanel({ products, setProducts }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [draft, setDraft] = useState<Product | null>(null);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  const availableCount = products.filter(available).length;
  const matches = products.filter((product) => {
    const text = `${product.name} ${product.woodSpecies} ${product.itemCode}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) &&
      (filter === "all" || (filter === "available" ? available(product) : !available(product)));
  });

  function openEditor(product: Product) {
    setDraft(editableProduct(product));
    setPrice(product.id ? String(product.priceCents / 100) : "");
    setStock(String(product.stockCount));
    setWeight(product.id ? String(product.weightLbs) : "");
    setNotice("");
    setError("");
    requestAnimationFrame(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const isNew = !draft.id;
      const priceCents = Math.round(Number(price) * 100);
      if (!Number.isFinite(priceCents) || priceCents < 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0 || !Number.isFinite(Number(weight)) || Number(weight) <= 0) {
        throw new Error("Enter a valid price, stock quantity, and weight.");
      }
      const result = await inventoryRequest<{ product: Product }>("/api/admin/inventory", {
        method: isNew ? "POST" : "PUT", body: JSON.stringify({
          ...draft,
          priceCents,
          stockCount: Number(stock),
          weightLbs: Number(weight),
          secondaryImage: draft.secondaryImage === "/wood-placeholder.svg" ? "" : draft.secondaryImage,
        }),
      });
      setProducts((current) => isNew
        ? [...current, result.product]
        : current.map((item) => item.id === result.product.id ? result.product : item));
      setDraft(editableProduct(result.product));
      setNotice(isNew ? `${result.product.name} added to the shop.` : `${result.product.name} updated.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save item");
    } finally { setSaving(false); }
  }

  async function remove() {
    if (!draft?.id || saving || !window.confirm(`Remove ${draft.name} from the shop? This cannot be undone.`)) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await inventoryRequest("/api/admin/inventory?id=" + encodeURIComponent(draft.id), { method: "DELETE" });
      setProducts((current) => current.filter((item) => item.id !== draft.id));
      setDraft(null);
      setNotice("Item removed from the shop.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not remove item");
    } finally { setSaving(false); }
  }

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <p className="font-mono-luxury text-[10px] uppercase tracking-[0.2em] text-amber-800">Collection inventory</p>
        <h2 className="mt-1 font-roffelia text-3xl text-zinc-950">Works in the shop</h2>
        <p className="mt-1 text-sm text-zinc-500">{availableCount} for sale · {products.length} total</p>
      </div>
      <button type="button" onClick={() => openEditor(newProduct())} className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">+ Add a work</button>
    </div>

    {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">
      <section className="min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="space-y-4 border-b border-zinc-100 p-4 sm:p-5">
          <input aria-label="Search inventory" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or wood…" className="w-full rounded-xl border border-zinc-200 bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-[#9e7143]" />
          <div className="flex gap-2" aria-label="Filter inventory">
            {(["all", "available", "unavailable"] as Filter[]).map((option) => <button key={option} type="button" onClick={() => setFilter(option)} aria-pressed={filter === option} className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${filter === option ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>{option === "all" ? "All" : option === "available" ? "For sale" : "Unavailable"}</button>)}
          </div>
        </div>
        <div className="divide-y divide-zinc-100">
          {matches.map((product) => <div key={product.id} className={`flex items-center gap-4 p-4 transition sm:p-5 ${draft?.id === product.id ? "bg-amber-50/60" : "hover:bg-zinc-50"}`}>
            <Image unoptimized src={imageSrc(product.primaryImage)} alt="" width={72} height={72} className="h-16 w-16 shrink-0 rounded-xl bg-[#eee9df] object-cover sm:h-[72px] sm:w-[72px]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-950">{product.name}</p>
              <p className="mt-1 truncate text-xs text-zinc-500">{product.woodSpecies} · {money(product.priceCents)}</p>
              <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${available(product) ? "bg-emerald-50 text-emerald-800" : "bg-zinc-100 text-zinc-600"}`}>{available(product) ? `For sale · ${product.stockCount} in stock` : "Unavailable"}</p>
            </div>
            <button type="button" onClick={() => openEditor(product)} className="shrink-0 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-white">Edit</button>
          </div>)}
          {matches.length === 0 && <p className="px-5 py-14 text-center text-sm text-zinc-500">No items match this view.</p>}
        </div>
      </section>

      <div ref={editorRef} className={`${draft ? "order-first xl:order-last" : ""} scroll-mt-6`}>
        {draft ? <form onSubmit={save} className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div><p className="font-mono-luxury text-[10px] uppercase tracking-[0.18em] text-amber-800">{draft.id ? "Edit work" : "New work"}</p><h3 className="mt-1 font-roffelia text-3xl">{draft.id ? "Edit listing" : "Add to the shop"}</h3></div>
            <button type="button" onClick={() => setDraft(null)} aria-label="Close editor" className="rounded-lg px-2 py-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900">✕</button>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-[#f8f6f1] p-3">
            <Image unoptimized src={imageSrc(draft.primaryImage)} alt="Photo preview" width={76} height={76} className="h-[76px] w-[76px] rounded-lg bg-[#eee9df] object-cover" />
            <div className="min-w-0 flex-1"><p className="text-xs font-semibold text-zinc-800">Photo</p><p className="mt-1 text-[11px] leading-5 text-zinc-500">Paste a photo link below. A placeholder is used until you add one.</p></div>
          </div>
          <Input label="Photo link (optional)" value={draft.primaryImage} onChange={(value) => setDraft({ ...draft, primaryImage: value })} placeholder="https://…" />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <Input label="Name" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} required placeholder="e.g. Walnut side table" />
            <Input label="Wood species" value={draft.woodSpecies} onChange={(value) => setDraft({ ...draft, woodSpecies: value })} required placeholder="e.g. Black walnut" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="text-xs font-medium text-zinc-700">Type<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as Product["category"] })} className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#9e7143]">{categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label className="text-xs font-medium text-zinc-700">Placement<select value={draft.placement} onChange={(event) => setDraft({ ...draft, placement: event.target.value as Product["placement"] })} className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#9e7143]"><option value="interior">Interior</option><option value="exterior">Exterior</option></select></label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price ($)" type="number" min={0} step="0.01" value={price} onChange={setPrice} required />
            <Input label="Quantity" type="number" min={0} step="1" value={stock} onChange={setStock} required />
          </div>
          <Input label="Weight (lb)" type="number" min={0.01} step="0.01" value={weight} onChange={setWeight} required />
          <label className="block text-xs font-medium text-zinc-700">Description<textarea rows={3} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="What makes this piece special?" className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#9e7143]" /></label>

          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-[#faf9f6] px-4 py-3">
            <span><span className="block text-sm font-medium text-zinc-900">Available for purchase</span><span className="mt-0.5 block text-[11px] text-zinc-500">Requires stock above zero.</span></span>
            <input type="checkbox" checked={draft.inStock && !draft.isSoldOut} onChange={(event) => setDraft({ ...draft, inStock: event.target.checked, isSoldOut: false })} className="h-4 w-4 accent-zinc-900" />
          </label>

          <details className="rounded-xl border border-zinc-200 px-4 py-3 text-xs text-zinc-600">
            <summary className="cursor-pointer font-medium text-zinc-800">More details (optional)</summary>
            <div className="mt-4 space-y-4">
              <Input label="Short tagline" value={draft.tagline} onChange={(value) => setDraft({ ...draft, tagline: value })} />
              <Input label="Dimensions" value={draft.dimensions} onChange={(value) => setDraft({ ...draft, dimensions: value })} />
              <Input label="Finish" value={draft.finish} onChange={(value) => setDraft({ ...draft, finish: value })} />
              <Input label="Joinery" value={draft.joinery} onChange={(value) => setDraft({ ...draft, joinery: value })} />
              <Input label="Lead time" value={draft.leadTime} onChange={(value) => setDraft({ ...draft, leadTime: value })} />
              <Input label="Second photo link" value={draft.secondaryImage === "/wood-placeholder.svg" ? "" : draft.secondaryImage} onChange={(value) => setDraft({ ...draft, secondaryImage: value })} />
            </div>
          </details>

          <div className="flex gap-2 border-t border-zinc-100 pt-4">
            <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50">{saving ? "Saving…" : draft.id ? "Save changes" : "Add item"}</button>
            {draft.id && <button type="button" disabled={saving} onClick={remove} className="rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50">Remove</button>}
          </div>
        </form> : <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center"><p className="font-roffelia text-2xl text-zinc-800">Select a work to edit</p><p className="mt-2 text-sm text-zinc-500">Or add a new one using the button above.</p></div>}
      </div>
    </div>
  </div>;
}

function money(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
