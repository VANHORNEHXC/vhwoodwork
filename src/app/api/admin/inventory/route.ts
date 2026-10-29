import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest, isSameOrigin } from "@/lib/admin-auth";
import { deleteProduct, getProduct, insertProduct, listProducts, parseProduct, updateProduct } from "@/lib/catalog";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function failure(error: unknown) {
  const message = error instanceof Error ? error.message : "Inventory is unavailable";
  if (message.includes("products_item_code_unique")) return NextResponse.json({ error: "Item code already exists" }, { status: 409 });
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  try { return NextResponse.json({ products: await listProducts() }); } catch (error) { return failure(error); }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  try {
    const product = parseProduct(await request.json(), randomUUID());
    await insertProduct(product);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError || (error instanceof Error && error.message.startsWith("Invalid"))) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return failure(error);
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  try {
    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id : "";
    if (!id || !(await getProduct(id))) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    const product = parseProduct(body, id);
    await updateProduct(product);
    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof SyntaxError || (error instanceof Error && (error.message.startsWith("Invalid") || error.message.includes("required") || error.message.includes("must use")))) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return failure(error);
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  try {
    if (!(await getProduct(id))) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) { return failure(error); }
}
