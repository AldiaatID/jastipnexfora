"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Values = {
  name: string;
  username: string;
  description: string | null;
  logoUrl: string | null;
  whatsapp: string | null;
  instagram: string | null;
  tiktok: string | null;
  bankInfo: string | null;
};

export default function SettingsForm({ initial }: { initial: Values }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial.name,
    username: initial.username,
    description: initial.description || "",
    logoUrl: initial.logoUrl || "",
    whatsapp: initial.whatsapp || "",
    instagram: initial.instagram || "",
    tiktok: initial.tiktok || "",
    bankInfo: initial.bankInfo || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value as never }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    const res = await fetch("/api/store", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Gagal menyimpan");
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
      <div className="card space-y-4">
        <h3 className="font-semibold">Identitas Toko</h3>
        <div>
          <label className="label">Nama Toko</label>
          <input
            required
            className="input"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Username Toko</label>
          <input
            required
            pattern="[a-z0-9_-]+"
            className="input"
            value={form.username}
            onChange={(e) => update("username", e.target.value.toLowerCase())}
          />
          <p className="mt-1 text-xs text-slate-500">
            Halaman publik: /store/{form.username}
          </p>
        </div>
        <div>
          <label className="label">Deskripsi</label>
          <textarea
            rows={3}
            className="input"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
        <div>
          <label className="label">URL Logo</label>
          <input
            type="url"
            className="input"
            value={form.logoUrl}
            onChange={(e) => update("logoUrl", e.target.value)}
            placeholder="https://..."
          />
          {form.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.logoUrl}
              alt="Logo"
              className="mt-2 h-16 w-16 rounded-lg object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold">Kontak & Pembayaran</h3>
        <div>
          <label className="label">Nomor WhatsApp</label>
          <input
            className="input"
            placeholder="6281234567890"
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value.replace(/\D/g, ""))}
          />
          <p className="mt-1 text-xs text-slate-500">Pakai format 62xxx tanpa spasi.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Instagram</label>
            <input
              className="input"
              value={form.instagram}
              onChange={(e) => update("instagram", e.target.value)}
              placeholder="username"
            />
          </div>
          <div>
            <label className="label">TikTok</label>
            <input
              className="input"
              value={form.tiktok}
              onChange={(e) => update("tiktok", e.target.value)}
              placeholder="username"
            />
          </div>
        </div>
        <div>
          <label className="label">Info Rekening Pembayaran</label>
          <textarea
            rows={3}
            className="input"
            placeholder="contoh: BCA 1234567890 a.n. Nama Anda"
            value={form.bankInfo}
            onChange={(e) => update("bankInfo", e.target.value)}
          />
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        {success && (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Berhasil disimpan.
          </p>
        )}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}
