import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VH WOODWORK — Heirloom Timber Atelier / Coral Springs, FL",
  description:
    "Handcrafted solid wood furniture and architectural sculptural works. Bench-crafted in Coral Springs, Florida. Private atelier collection and insured nationwide transit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased selection:bg-amber-100 selection:text-zinc-900">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fcfbf9] text-[#141312]">
        {children}
      </body>
    </html>
  );
}
