"use client";

import { useMemo, useState } from "react";
import { formatRupiah, waLink } from "@/lib/format";
import EmptyState from "@/components/EmptyState";

type StoreLite = {
  id: string;
  username: string;
  name: string;
  whatsapp: string | null;
};

type ProductLite = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sellPrice: number;
  stock: number;
  estimatedAt: string | null;
  categoryName: string | null;
};

export default function StorefrontClient({
  store,
  products,
}: {
  store: StoreLite;
  products: ProductLite[];
}) {
  const [activeProduct, setActiveProduct] = useState<ProductLite | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.categoryName && set.add(p.categoryName));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (activeCategory && p.categoryName !== activeCategory) return false;
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [products, activeCategory, search]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          className="input flex-1"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            className={
              "badge cursor-pointer " +
              (activeCategory === ""
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-700")
            }
            onClick={() => setActiveCategory("")}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={
                "badge cursor-pointer " +
                (activeCategory === c
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-700")
              }
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Tidak ada produk"
          description="Coba ubah kata kunci atau kategori."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="card flex flex-col p-3">
              <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-3xl text-slate-400">
                    📦
                  </div>
                )}
              </div>
              <div className="mt-3 flex-1">
                {p.categoryName && (
                  <span className="badge bg-brand-50 text-brand-700">{p.categoryName}</span>
                )}
                <h3 className="mt-1 line-clamp-2 font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm font-bold text-brand-600">
                  {formatRupiah(p.sellPrice)}
                </p>
                {p.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {p.description}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  Stok: {p.stock} {p.estimatedAt && "• ETA: " + new Date(p.estimatedAt).toLocaleDateString("id-ID")}
                </p>
              </div>
              <button
                className="btn-primary mt-3 w-full"
                onClick={() => setActiveProduct(p)}
              >
                Pesan Sekarang
              </button>
            </div>
          ))}
        </div>
      )}

      {activeProduct && (
        <OrderModal
          store={store}
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </div>
  );
}

function OrderModal({
  store,
  product,
  onClose,
}: {
  store: StoreLite;
  product: ProductLite;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    notes: "",
    quantity: 1,
    paymentMethod: "TRANSFER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ code: string } | null>(null);

  const total = product.sellPrice * Math.max(1, form.quantity);

  function update(key: string, value: string | number) {
    setForm((f) => ({ ...f, [key]: value as never }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(`/api/store/${store.username}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items: [{ productId: product.id, quantity: form.quantity }],
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Gagal membuat pesanan");
      return;
    }
    setSuccess({ code: data.order.code });
  }

  function sendWhatsApp() {
    if (!store.whatsapp || !success) return;
    const msg = `Halo ${store.name}, saya baru saja melakukan pemesanan dengan kode ${success.code}.\n\nNama: ${form.customerName}\nProduk: ${product.name}\nJumlah: ${form.quantity}\nTotal: ${formatRupiah(total)}\n\nMohon konfirmasinya. Terima kasih!`;
    window.open(waLink(store.whatsapp, msg), "_blank");
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        {success ? (
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl">
              ✅
            </div>
            <h3 className="mt-3 text-lg font-bold">Pesanan Berhasil!</h3>
            <p className="mt-1 text-sm text-slate-600">
              Kode pesananmu: <span className="font-mono font-semibold">{success.code}</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Silakan konfirmasi via WhatsApp agar pesanan segera diproses.
            </p>
            {store.whatsapp && (
              <button onClick={sendWhatsApp} className="btn mt-4 w-full bg-emerald-600 text-white hover:bg-emerald-700">
                💬 Konfirmasi via WhatsApp
              </button>
            )}
            <button onClick={onClose} className="btn-secondary mt-2 w-full">
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-brand-600 font-medium">
                  {formatRupiah(product.sellPrice)}
                </p>
              </div>
              <button type="button" onClick={onClose} className="text-slate-400">✕</button>
            </div>
            <div>
              <label className="label">Nama *</label>
              <input
                required
                className="input"
                value={form.customerName}
                onChange={(e) => update("customerName", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Nomor WhatsApp *</label>
              <input
                required
                placeholder="contoh: 6281234567890"
                className="input"
                value={form.customerPhone}
                onChange={(e) => update("customerPhone", e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <div>
              <label className="label">Alamat</label>
              <textarea
                rows={2}
                className="input"
                value={form.customerAddress}
                onChange={(e) => update("customerAddress", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Jumlah</label>
                <input
                  type="number"
                  min={1}
                  required
                  className="input"
                  value={form.quantity}
                  onChange={(e) => update("quantity", Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div>
                <label className="label">Pembayaran</label>
                <select
                  className="input"
                  value={form.paymentMethod}
                  onChange={(e) => update("paymentMethod", e.target.value)}
                >
                  <option value="TRANSFER">Transfer Bank</option>
                  <option value="COD">Bayar di Tempat</option>
                  <option value="EWALLET">E-Wallet</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Catatan</label>
              <textarea
                rows={2}
                className="input"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
              />
            </div>
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
              Total: <span className="font-bold">{formatRupiah(total)}</span>
            </div>
            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Memproses..." : "Buat Pesanan"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
