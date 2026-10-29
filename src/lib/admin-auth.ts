import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "vhw_admin_session";
const SESSION_SECONDS = 8 * 60 * 60;

function sessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function credentialsConfigured(): boolean {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PIN_SALT && process.env.ADMIN_PIN_HASH && process.env.ADMIN_SESSION_SECRET);
}

export function verifyCredentials(username: string, pin: string): boolean {
  if (!credentialsConfigured() || !/^\d{6,12}$/.test(pin)) return false;
  const expectedUsername = Buffer.from(process.env.ADMIN_USERNAME!, "utf8");
  const givenUsername = Buffer.from(username.trim(), "utf8");
  const usernameMatches = expectedUsername.length === givenUsername.length && timingSafeEqual(expectedUsername, givenUsername);
  const expectedHash = Buffer.from(process.env.ADMIN_PIN_HASH!, "hex");
  const givenHash = scryptSync(pin, process.env.ADMIN_PIN_SALT!, expectedHash.length);
  return usernameMatches && timingSafeEqual(expectedHash, givenHash);
}

export function createSessionToken(): string {
  const payload = Buffer.from(JSON.stringify({
    user: process.env.ADMIN_USERNAME,
    expires: Date.now() + SESSION_SECONDS * 1000,
    nonce: randomBytes(12).toString("hex"),
  })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !credentialsConfigured()) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;
  const expected = Buffer.from(sign(payload), "utf8");
  const given = Buffer.from(signature, "utf8");
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return parsed.user === process.env.ADMIN_USERNAME && Number.isFinite(parsed.expires) && parsed.expires > Date.now();
  } catch { return false; }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return verifySessionToken((await cookies()).get(COOKIE_NAME)?.value);
}

export function isAdminRequest(request: NextRequest): boolean {
  return verifySessionToken(request.cookies.get(COOKIE_NAME)?.value);
}

export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin);
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: SESSION_SECONDS,
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
