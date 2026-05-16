import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/format";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const user = (await getCurrentUser())!;
  const storeId = user.store!.id;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [monthAgg, totalAgg, doneCount, unpaidCount, items] = await Promise.all([
    prisma.order.aggregate({
      where: {
        storeId,
        createdAt: { gte: monthStart },
        status: { not: "CANCELLED" },
      },
      _sum: { totalAmount: true, totalCost: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { storeId, status: { not: "CANCELLED" } },
      _sum: { totalAmount: true, totalCost: true },
    }),
    prisma.order.count({ where: { storeId, status: "DONE" } }),
    prisma.order.count({
      where: { storeId, paymentStatus: { in: ["UNPAID", "DP"] } },
    }),
    prisma.orderItem.groupBy({
      by: ["productName"],
      where: { order: { storeId, status: { not: "CANCELLED" } } },
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const monthOmzet = monthAgg._sum.totalAmount || 0;
  const monthProfit = monthOmzet - (monthAgg._sum.totalCost || 0);
  const allOmzet = totalAgg._sum.totalAmount || 0;
  const allProfit = allOmzet - (totalAgg._sum.totalCost || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Laporan</h1>
          <p className="text-sm text-slate-500">
            Periode: {monthStart.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
          </p>
        </div>
        <a href="/api/reports/export" className="btn-primary">
          ⬇ Export CSV
        </a>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="card">
          <p className="text-xs text-slate-500">Omzet Bulan Ini</p>
          <p className="mt-1 text-xl font-bold">{formatRupiah(monthOmzet)}</p>
          <p className="text-xs text-slate-500">{monthAgg._count} pesanan</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500">Profit Bulan Ini</p>
          <p className="mt-1 text-xl font-bold text-emerald-600">{formatRupiah(monthProfit)}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500">Pesanan Selesai</p>
          <p className="mt-1 text-xl font-bold">{doneCount}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500">Belum Dibayar</p>
          <p className="mt-1 text-xl font-bold text-amber-600">{unpaidCount}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="card">
          <p className="text-xs text-slate-500">Total Omzet (semua waktu)</p>
          <p className="mt-1 text-xl font-bold">{formatRupiah(allOmzet)}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500">Total Profit (semua waktu)</p>
          <p className="mt-1 text-xl font-bold text-emerald-600">{formatRupiah(allProfit)}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold">Produk Paling Laris</h3>
        {items.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon="🏆" title="Belum ada data" description="Mulai dapatkan pesanan untuk melihat ranking." />
          </div>
        ) : (
          <table className="mt-3 w-full text-sm">
            <thead className="text-left text-xs text-slate-500">
              <tr>
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">Produk</th>
                <th className="px-2 py-2">Qty Terjual</th>
                <th className="px-2 py-2">Total Penjualan</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.productName} className="border-t border-slate-100">
                  <td className="px-2 py-2">{idx + 1}</td>
                  <td className="px-2 py-2">{it.productName}</td>
                  <td className="px-2 py-2">{it._sum.quantity}</td>
                  <td className="px-2 py-2 font-medium">{formatRupiah(it._sum.subtotal || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
