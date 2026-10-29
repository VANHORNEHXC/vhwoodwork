import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "VH Woodwork | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  return (await isAdminAuthenticated()) ? <AdminDashboard /> : <AdminLogin />;
}
