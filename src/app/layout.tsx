import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VH WOODWORK — Studio & Furniture / Fort Lauderdale, FL",
  description:
    "Handcrafted solid wood furniture and architectural woodwork. Made in Fort Lauderdale, Florida. Studio pickup and nationwide shipping for select objects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <body className="min-h-full flex flex-col bg-white text-zinc-950 font-sans tracking-tight">
        {children}
      </body>
    </html>
  );
}
