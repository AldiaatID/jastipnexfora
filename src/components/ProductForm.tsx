"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatRupiah } from "@/lib/format";

type Category = { id: string; name: string };

export type ProductFormValues = {
  id?: string;
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  costPrice?: number;
  sellPrice?: number;
  stock?: number;
  isActive?: boolean;
  estimatedAt?: string | null;
  categoryId?: string | null;
};

export default function ProductForm({
  initial,
  categories,
}: {
  initial?: ProductFormValues;
  categories: Category[];
}) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    imageUrl: initial?.imageUrl || "",
    costPrice: initial?.costPrice ?? 0,
    sellPrice: initial?.sellPrice ?? 0,
    stock: initial?.stock ?? 0,
    isActive: initial?.isActive ?? true,
    estimatedAt: initial?.estimatedAt
      ? new Date(initial.estimatedAt).toISOString().slice(0, 10)
      : "",
    categoryId: initial?.categoryId || "",
    newCategory: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: string, value: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: value as never }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const url = isEdit ? `/api/products/${initial!.id}` : "/api/products";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Gagal menyimpan");
      return;
    }
    router.push("/dashboard/products");
    router.refresh();
  }

  async function onDelete() {
    if (!isEdit) return;
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    setLoading(true);
    const res = await fetch(`/api/products/${initial!.id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard/products");
      router.refresh();
    }
  }

  const profit = (Number(form.sellPrice) || 0) - (Number(form.costPrice) || 0);

  return (
    <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-3">
      <div className="card md:col-span-2 space-y-4">
        <div>
          <label className="label">Nama Produk *</label>
          <input
            required
            className="input"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Deskripsi</label>
          <textarea
            rows={4}
            className="input"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Link Gambar (URL)</label>
          <input
            type="url"
            placeholder="https://..."
            className="input"
            value={form.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
          />
          {form.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.imageUrl}
              alt="Preview"
              className="mt-2 h-32 w-32 rounded-lg object-cover"
              onError={(e) => ((e.currentTarget.style.display = "none"))}
            />
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="label">Harga Modal *</label>
            <input
              required
              type="number"
              min={0}
              className="input"
              value={form.costPrice}
              onChange={(e) => update("costPrice", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Harga Jual *</label>
            <input
              required
              type="number"
              min={0}
              className="input"
              value={form.sellPrice}
              onChange={(e) => update("sellPrice", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Stok *</label>
            <input
              required
              type="number"
              min={0}
              className="input"
              value={form.stock}
              onChange={(e) => update("stock", Number(e.target.value))}
            />
          </div>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3 text-sm">
          Profit per item:{" "}
          <span className="font-semibold text-emerald-700">{formatRupiah(profit)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <label className="label">Status</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => update("isActive", true)}
                className={
                  "btn flex-1 " +
                  (form.isActive ? "bg-emerald-600 text-white" : "btn-secondary")
                }
              >
                Aktif
              </button>
              <button
                type="button"
                onClick={() => update("isActive", false)}
                className={
                  "btn flex-1 " +
                  (!form.isActive ? "bg-slate-700 text-white" : "btn-secondary")
                }
              >
                Nonaktif
              </button>
            </div>
          </div>
          <div>
            <label className="label">Kategori</label>
            <select
              className="input"
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
            >
              <option value="">- pilih -</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">atau buat kategori baru</label>
            <input
              className="input"
              placeholder="contoh: Skincare"
              value={form.newCategory}
              onChange={(e) => update("newCategory", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Estimasi Kedatangan</label>
            <input
              type="date"
              className="input"
              value={form.estimatedAt}
              onChange={(e) => update("estimatedAt", e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div className="flex flex-col gap-2">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
          {isEdit && (
            <button type="button" className="btn-danger" onClick={onDelete} disabled={loading}>
              Hapus Produk
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
