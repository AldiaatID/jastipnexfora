import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDateTime } from "@/lib/format";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/constants";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const user = (await getCurrentUser())!;
  const storeId = user.store!.id;

  const where: Record<string, unknown> = { storeId };
  if (searchParams.status && searchParams.status in ORDER_STATUS) {
    where.status = searchParams.status;
  }
  if (searchParams.q) {
    where.customerName = { contains: searchParams.q };
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const statusFilters = ["", ...Object.keys(ORDER_STATUS)];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Pesanan</h1>
          <p className="text-sm text-slate-500">Kelola semua pesanan masuk.</p>
        </div>
      </div>

      <form className="card flex flex-wrap items-end gap-3" method="get">
        <div className="flex-1 min-w-[180px]">
          <label className="label">Cari nama customer</label>
          <input
            name="q"
            defaultValue={searchParams.q || ""}
            placeholder="contoh: Sari"
            className="input"
          />
        </div>
        <div>
          <label className="label">Status</label>
          <select name="status" defaultValue={searchParams.status || ""} className="input">
            {statusFilters.map((s) => (
              <option key={s || "all"} value={s}>
                {s ? (ORDER_STATUS as Record<string, string>)[s] : "Semua status"}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">Filter</button>
          <Link href="/dashboard/orders" className="btn-secondary">Reset</Link>
        </div>
      </form>

      {orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="Belum ada pesanan"
          description="Bagikan link toko publikmu agar customer mulai memesan."
          action={
            <Link
              href={`/store/${user.store!.username}`}
              target="_blank"
              className="btn-primary"
            >
              Lihat Toko Publik
            </Link>
          }
        />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Bayar</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-mono text-xs">{o.code}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{o.customerName}</p>
                    <p className="text-xs text-slate-500">{o.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {o.items.length} produk
                  </td>
                  <td className="px-4 py-3">{formatRupiah(o.totalAmount)}</td>
                  <td className="px-4 py-3"><PaymentStatusBadge status={o.paymentStatus} /></td>
                  <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{formatDateTime(o.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/orders/${o.id}`}
                      className="text-sm text-brand-600 hover:underline"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-3">
        <div className="card">
          <p className="text-xs text-slate-500">Total ditampilkan</p>
          <p className="text-lg font-semibold">{orders.length} pesanan</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500">Omzet (filter aktif)</p>
          <p className="text-lg font-semibold">
            {formatRupiah(orders.reduce((s, o) => s + o.totalAmount, 0))}
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500">Belum bayar</p>
          <p className="text-lg font-semibold">
            {orders.filter((o) => o.paymentStatus !== "PAID").length}
          </p>
        </div>
      </div>
    </div>
  );
}
