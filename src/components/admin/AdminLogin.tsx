"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, pin }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to sign in");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in");
    } finally { setBusy(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f2ef] px-4 py-12 font-sans-luxury">
      <div className="w-full max-w-md rounded-[28px] border border-zinc-200 bg-white p-8 shadow-[0_30px_100px_-40px_rgba(0,0,0,.2)] sm:p-10">
        <div className="mb-10 flex items-center justify-between">
          <span className="font-roffelia text-2xl tracking-[0.12em]">VH WOODWORK</span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 font-mono-luxury text-[10px] uppercase tracking-wider text-zinc-500">Private admin</span>
        </div>
        <p className="mb-2 font-mono-luxury text-[11px] uppercase tracking-[0.2em] text-amber-700">Owner workspace</p>
        <h1 className="font-roffelia text-4xl text-zinc-950">Welcome back, Dario.</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-500">Sign in to manage orders, fulfillment, and the collection.</p>
        <form onSubmit={signIn} className="mt-9 space-y-5">
          <label className="block text-xs font-medium text-zinc-700">Username
            <input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#faf9f7] px-4 py-3 text-sm outline-none focus:border-zinc-900" />
          </label>
          <label className="block text-xs font-medium text-zinc-700">PIN
            <input autoComplete="current-password" inputMode="numeric" pattern="[0-9]{6,12}" type="password" required value={pin} onChange={(event) => setPin(event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#faf9f7] px-4 py-3 text-sm outline-none focus:border-zinc-900" />
          </label>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700">{error}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-zinc-950 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <Link href="/" className="mt-8 block text-center text-xs text-zinc-500 hover:text-zinc-900">← Back to the shop</Link>
      </div>
    </main>
  );
}
