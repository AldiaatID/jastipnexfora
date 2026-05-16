import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDateTime } from "@/lib/format";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";
import { PAYMENT_METHOD_LABEL } from "@/lib/constants";
import OrderActions from "@/components/OrderActions";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = (await getCurrentUser())!;
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, store: true },
  });
  if (!order || order.storeId !== user.store!.id) notFound();
  const templates = await prisma.template.findMany({
    where: { storeId: user.store!.id },
    orderBy: { title: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/orders" className="text-sm text-brand-600 hover:underline">
          ← Kembali ke pesanan
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Pesanan {order.code}</h1>
            <p className="text-sm text-slate-500">{formatDateTime(order.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <div className="card">
            <h3 className="font-semibold">Customer</h3>
            <dl className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <div>
                <dt className="text-slate-500">Nama</dt>
                <dd className="font-medium">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">WhatsApp</dt>
                <dd className="font-medium">{order.customerPhone}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-slate-500">Alamat</dt>
                <dd>{order.customerAddress || "-"}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-slate-500">Catatan</dt>
                <dd>{order.notes || "-"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Metode Pembayaran</dt>
                <dd>
                  {order.paymentMethod
                    ? (PAYMENT_METHOD_LABEL as Record<string, string>)[order.paymentMethod] ||
                      order.paymentMethod
                    : "-"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h3 className="font-semibold">Item Pesanan</h3>
            <div className="mt-3 -mx-2 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-slate-500">
                  <tr>
                    <th className="px-2 py-2">Produk</th>
                    <th className="px-2 py-2">Qty</th>
                    <th className="px-2 py-2">Harga</th>
                    <th className="px-2 py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it) => (
                    <tr key={it.id} className="border-t border-slate-100">
                      <td className="px-2 py-2">{it.productName}</td>
                      <td className="px-2 py-2">{it.quantity}</td>
                      <td className="px-2 py-2">{formatRupiah(it.unitPrice)}</td>
                      <td className="px-2 py-2 font-medium">{formatRupiah(it.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200">
                    <td className="px-2 py-2 font-semibold" colSpan={3}>Total</td>
                    <td className="px-2 py-2 font-bold">{formatRupiah(order.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <OrderActions
          order={{
            id: order.id,
            code: order.code,
            status: order.status,
            paymentStatus: order.paymentStatus,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            totalAmount: order.totalAmount,
            items: order.items.map((i) => ({
              productName: i.productName,
              quantity: i.quantity,
            })),
          }}
          templates={templates.map((t) => ({
            key: t.key,
            title: t.title,
            body: t.body,
          }))}
          storeName={order.store.name}
        />
      </div>
    </div>
  );
}
