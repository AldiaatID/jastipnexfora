"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/dashboard", label: "Ringkasan", icon: "🏠" },
  { href: "/dashboard/products", label: "Produk", icon: "🛍️" },
  { href: "/dashboard/orders", label: "Pesanan", icon: "📦" },
  { href: "/dashboard/templates", label: "WhatsApp", icon: "💬" },
  { href: "/dashboard/reports", label: "Laporan", icon: "📊" },
  { href: "/dashboard/settings", label: "Pengaturan", icon: "⚙️" },
];

export default function DashboardNav({
  storeName,
  username,
  userName,
}: {
  storeName: string;
  username: string;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === href;
    return pathname?.startsWith(href);
  }

  return (
    <>
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white p-4 md:flex">
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white font-bold">
            J
          </div>
          <span className="text-base font-semibold">JastipFlow</span>
        </Link>
        <div className="mt-2 rounded-lg bg-slate-50 p-3 text-sm">
          <p className="font-medium leading-tight">{storeName}</p>
          <p className="truncate text-xs text-slate-500">/store/{username}</p>
        </div>
        <nav className="mt-4 flex-1 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm " +
                (isActive(item.href)
                  ? "bg-brand-50 text-brand-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50")
              }
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
          <p className="font-medium">{userName}</p>
          <button
            onClick={logout}
            disabled={loggingOut}
            className="mt-2 text-xs text-red-600 hover:underline disabled:opacity-60"
          >
            {loggingOut ? "Keluar..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white font-bold">
            J
          </div>
          <span className="text-sm font-semibold">{storeName}</span>
        </Link>
        <button
          onClick={logout}
          disabled={loggingOut}
          className="text-xs text-red-600"
        >
          {loggingOut ? "..." : "Logout"}
        </button>
      </header>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-slate-200 bg-white md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] " +
              (isActive(item.href)
                ? "text-brand-700 font-medium"
                : "text-slate-500")
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
