"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), pin }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to sign in");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#efeee9] px-4 py-5 font-sans-luxury text-zinc-950 sm:px-6 sm:py-8 lg:flex lg:items-center lg:px-10">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[30px] border border-zinc-200/80 bg-white shadow-[0_32px_100px_-36px_rgba(34,30,24,.25)] lg:min-h-[680px] lg:grid-cols-[1.04fr_1fr]">
        <section className="relative hidden min-h-[680px] flex-col overflow-hidden bg-[#202522] px-12 py-11 text-[#f8f5ec] lg:flex">
          <div className="pointer-events-none absolute -right-44 -top-44 h-[540px] w-[540px] rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-28 -top-28 h-[420px] w-[420px] rounded-full border border-white/10" />
          <div className="pointer-events-none absolute bottom-[-220px] left-[-160px] h-[480px] w-[480px] rounded-full bg-[#be9461]/10 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <span className="font-roffelia text-3xl tracking-[0.14em]">VH WOODWORK</span>
            <span className="rounded-full border border-white/20 px-3 py-1 font-mono-luxury text-[10px] uppercase tracking-[0.16em] text-white/70">Owner access</span>
          </div>

          <div className="relative mt-auto max-w-md pb-4">
            <span className="mb-6 block h-px w-14 bg-[#d3a36e]" />
            <p className="font-mono-luxury text-[10px] uppercase tracking-[0.25em] text-[#d7b894]">The atelier workspace</p>
            <h2 className="mt-5 font-roffelia text-[58px] leading-[0.98] tracking-tight">The work behind every piece.</h2>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">A clear place to tend the collection, prepare orders, and keep the studio moving.</p>
            <div className="mt-12 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-sm">
                <span className="font-roffelia text-3xl text-[#d6ae7b]">01</span>
                <p className="mt-3 text-xs font-medium text-white/85">Collection inventory</p>
                <p className="mt-1 text-[11px] leading-5 text-white/50">Add and manage works for sale.</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-sm">
                <span className="font-roffelia text-3xl text-[#d6ae7b]">02</span>
                <p className="mt-3 text-xs font-medium text-white/85">Order fulfillment</p>
                <p className="mt-1 text-[11px] leading-5 text-white/50">Follow each request through delivery.</p>
              </div>
            </div>
          </div>
          <p className="relative mt-8 font-mono-luxury text-[10px] uppercase tracking-[0.16em] text-white/40">Coral Springs · Florida</p>
        </section>

        <section className="flex min-h-[620px] flex-col px-6 py-7 sm:px-12 sm:py-11 lg:px-16 lg:py-12">
          <div className="flex items-center justify-between gap-4">
            <span className="font-roffelia text-xl tracking-[0.14em] lg:hidden">VH WOODWORK</span>
            <span className="hidden font-mono-luxury text-[10px] uppercase tracking-[0.2em] text-zinc-400 lg:inline">Private dashboard</span>
            <Link href="/" className="text-xs text-zinc-500 transition hover:text-zinc-950">View shop ↗</Link>
          </div>

          <div className="my-auto w-full max-w-sm py-16 sm:py-20">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d8cab7] bg-[#f8f5ee] text-[#9e7143]">
              <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14v3" /></svg>
            </div>
            <p className="font-mono-luxury text-[10px] uppercase tracking-[0.2em] text-[#a0774c]">Dario VanHorne · Owner</p>
            <h1 className="mt-3 font-roffelia text-5xl leading-none tracking-tight sm:text-[58px]">Welcome back.</h1>
            <p className="mt-4 text-sm leading-6 text-zinc-500">Enter your username and PIN to manage the atelier.</p>

            <form onSubmit={signIn} className="mt-9 space-y-5">
              <label className="block text-xs font-semibold text-zinc-800">Username
                <input autoComplete="username" autoCapitalize="none" spellCheck={false} required value={username} onChange={(event) => { setUsername(event.target.value); setError(""); }} placeholder="Your username" className="mt-2.5 w-full rounded-xl border border-zinc-200 bg-[#faf9f6] px-4 py-3.5 text-sm font-normal outline-none transition focus:border-[#a0774c] focus:ring-2 focus:ring-[#a0774c]/15" />
              </label>
              <label className="block text-xs font-semibold text-zinc-800">PIN
                <span className="relative mt-2.5 block">
                  <input autoComplete="current-password" inputMode="numeric" pattern="[0-9]{6,12}" maxLength={12} type={showPin ? "text" : "password"} required value={pin} onChange={(event) => { setPin(event.target.value.replace(/\D/g, "")); setError(""); }} placeholder="Enter your PIN" className="w-full rounded-xl border border-zinc-200 bg-[#faf9f6] px-4 py-3.5 pr-16 text-sm font-normal tracking-[0.12em] outline-none transition focus:border-[#a0774c] focus:ring-2 focus:ring-[#a0774c]/15" />
                  <button type="button" onClick={() => setShowPin((visible) => !visible)} aria-label={showPin ? "Hide PIN" : "Show PIN"} className="absolute inset-y-0 right-3 px-2 text-xs font-medium text-zinc-500 transition hover:text-zinc-950">{showPin ? "Hide" : "Show"}</button>
                </span>
              </label>
              {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</p>}
              <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#202522] px-5 py-4 text-sm font-medium text-white transition hover:bg-[#343b35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a0774c] disabled:cursor-wait disabled:opacity-60">
                {busy ? "Opening dashboard…" : "Open dashboard"}
                {!busy && <span aria-hidden="true">↗</span>}
              </button>
            </form>
          </div>

          <p className="text-[11px] text-zinc-400">VH Woodwork · Private studio access</p>
        </section>
      </div>
    </main>
  );
}
