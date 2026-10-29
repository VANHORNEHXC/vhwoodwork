import { NextRequest, NextResponse } from "next/server";
import { adminCookie, createSessionToken, credentialsConfigured, isSameOrigin, verifyCredentials } from "@/lib/admin-auth";

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  if (!credentialsConfigured()) return NextResponse.json({ error: "Admin access is not configured" }, { status: 503 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && entry.resetAt > now && entry.count >= 5) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  let body: { username?: unknown; pin?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const username = typeof body.username === "string" ? body.username : "";
  const pin = typeof body.pin === "string" ? body.pin : "";
  if (!verifyCredentials(username, pin)) {
    attempts.set(ip, { count: (entry?.resetAt && entry.resetAt > now ? entry.count : 0) + 1, resetAt: now + 15 * 60 * 1000 });
    return NextResponse.json({ error: "Incorrect username or PIN" }, { status: 401 });
  }
  attempts.delete(ip);
  const response = NextResponse.json({ success: true });
  response.cookies.set({ ...adminCookie, value: createSessionToken() });
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  const response = NextResponse.json({ success: true });
  response.cookies.set({ ...adminCookie, value: "", maxAge: 0 });
  return response;
}
