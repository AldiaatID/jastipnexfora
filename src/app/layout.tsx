import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JastipFlow - Kelola Jastip & Reseller Lebih Mudah",
  description:
    "Aplikasi all-in-one untuk pelaku jastip dan reseller. Kelola produk, pre-order, pembayaran, dan laporan dalam satu dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
