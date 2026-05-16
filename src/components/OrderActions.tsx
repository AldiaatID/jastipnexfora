"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/constants";
import { applyTemplate, formatRupiah, waLink } from "@/lib/format";

type Template = { key: string; title: string; body: string };

export default function OrderActions({
  order,
  templates,
  storeName,
}: {
  order: {
    id: string;
    code: string;
    status: string;
    paymentStatus: string;
    customerName: string;
    customerPhone: string;
    totalAmount: number;
    items: { productName: string; quantity: number }[];
  };
  templates: Template[];
  storeName: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [payment, setPayment] = useState(order.paymentStatus);

  async function update(payload: Record<string, string>) {
    setBusy(true);
    const res = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  async function deleteOrder() {
    if (!confirm("Yakin ingin menghapus pesanan ini?")) return;
    setBusy(true);
    const res = await fetch(`/api/orders/${order.id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.push("/dashboard/orders");
  }

  function sendTemplate(t: Template) {
    const productList = order.items
      .map((it) => `${it.quantity}x ${it.productName}`)
      .join(", ");
    const msg = applyTemplate(t.body, {
      nama: order.customerName,
      kode: order.code,
      produk: productList,
      total: order.totalAmount.toLocaleString("id-ID"),
      toko: storeName,
    });
    window.open(waLink(order.customerPhone, msg), "_blank");
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <h3 className="font-semibold">Update Status</h3>
        <div>
          <label className="label">Status Pesanan</label>
          <div className="flex gap-2">
            <select
              className="input flex-1"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {Object.entries(ORDER_STATUS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <button
              className="btn-primary"
              disabled={busy || status === order.status}
              onClick={() => update({ status })}
            >
              Simpan
            </button>
          </div>
        </div>
        <div>
          <label className="label">Status Pembayaran</label>
          <div className="flex gap-2">
            <select
              className="input flex-1"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            >
              {Object.entries(PAYMENT_STATUS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <button
              className="btn-primary"
              disabled={busy || payment === order.paymentStatus}
              onClick={() => update({ paymentStatus: payment })}
            >
              Simpan
            </button>
          </div>
        </div>
      </div>

      <div className="card space-y-2">
        <h3 className="font-semibold">Kirim WhatsApp</h3>
        <p className="text-xs text-slate-500">
          Pilih template untuk auto-isi variabel pesanan.
        </p>
        <div className="grid gap-2">
          {templates.map((t) => (
            <button
              key={t.key}
              onClick={() => sendTemplate(t)}
              className="btn bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            >
              💬 {t.title}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          Total: {formatRupiah(order.totalAmount)}
        </p>
      </div>

      <button
        onClick={deleteOrder}
        disabled={busy}
        className="btn-danger w-full"
      >
        Hapus Pesanan
      </button>
    </div>
  );
}
