import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDateTime } from "@/lib/format";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = (await getCurrentUser())!;
  const storeId = user.store!.id;

  const [productCount, orderCount, unpaid, done, agg, latest] = await Promise.all([
    prisma.product.count({ where: { storeId } }),
    prisma.order.count({ where: { storeId } }),
    prisma.order.count({ where: { storeId, paymentStatus: { in: ["UNPAID", "DP"] } } }),
    prisma.order.count({ where: { storeId, status: "DONE" } }),
    prisma.order.aggregate({
      where: { storeId, status: { not: "CANCELLED" } },
      _sum: { totalAmount: true, totalCost: true },
    }),
    prisma.order.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const omzet = agg._sum.totalAmount || 0;
  const profit = omzet - (agg._sum.totalCost || 0);

  const stats = [
    { label: "Total Produk", value: productCount, icon: "🛍️" },
    { label: "Total Pesanan", value: orderCount, icon: "📦" },
    { label: "Belum Dibayar", value: unpaid, icon: "⏳" },
    { label: "Pesanan Selesai", value: done, icon: "✅" },
    { label: "Total Omzet", value: formatRupiah(omzet), icon: "💰" },
    { label: "Estimasi Profit", value: formatRupiah(profit), icon: "📈" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Halo, {user.name} 👋</h1>
          <p className="text-sm text-slate-500">Ringkasan toko {user.store!.name}.</p>
        </div>
        <Link
          href={`/store/${user.store!.username}`}
          target="_blank"
          className="btn-secondary"
        >
          Lihat Toko Publik ↗
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-xl">
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-lg font-semibold">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Pesanan Terbaru</h2>
          <Link href="/dashboard/orders" className="text-sm text-brand-600 hover:underline">
            Lihat semua →
          </Link>
        </div>
        {latest.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon="📦"
              title="Belum ada pesanan"
              description="Pesanan baru akan muncul di sini saat ada customer yang order."
            />
          </div>
        ) : (
          <div className="mt-4 -mx-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-slate-500">
                <tr>
                  <th className="px-2 py-2">Kode</th>
                  <th className="px-2 py-2">Customer</th>
                  <th className="px-2 py-2">Total</th>
                  <th className="px-2 py-2">Bayar</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {latest.map((o) => (
                  <tr key={o.id} className="border-t border-slate-100">
                    <td className="px-2 py-2 font-mono text-xs">
                      <Link href={`/dashboard/orders/${o.id}`} className="text-brand-600 hover:underline">
                        {o.code}
                      </Link>
                    </td>
                    <td className="px-2 py-2">{o.customerName}</td>
                    <td className="px-2 py-2">{formatRupiah(o.totalAmount)}</td>
                    <td className="px-2 py-2"><PaymentStatusBadge status={o.paymentStatus} /></td>
                    <td className="px-2 py-2"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-2 py-2 text-xs text-slate-500">{formatDateTime(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
