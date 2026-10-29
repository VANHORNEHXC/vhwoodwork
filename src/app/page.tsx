import { connection } from "next/server";
import Storefront from "@/components/Storefront";
import { listProducts } from "@/lib/catalog";

export default async function HomePage() {
  await connection();
  const products = await listProducts();
  return <Storefront products={products} />;
}
