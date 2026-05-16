"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    storeName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Gagal daftar");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white font-bold">
            J
          </div>
          <span className="text-lg font-semibold">JastipFlow</span>
        </Link>
        <div className="card">
          <h1 className="text-xl font-semibold">Daftar gratis</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-brand-600 hover:underline">
              Masuk
            </Link>
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <div>
              <label className="label">Nama Pemilik</label>
              <input
                required
                className="input"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Nama Toko</label>
              <input
                required
                className="input"
                value={form.storeName}
                onChange={(e) => update("storeName", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Username Toko</label>
              <input
                required
                pattern="[a-z0-9_-]+"
                placeholder="contoh: tokojastip"
                className="input"
                value={form.username}
                onChange={(e) =>
                  update("username", e.target.value.toLowerCase().replace(/\s/g, ""))
                }
              />
              <p className="mt-1 text-xs text-slate-500">
                Halaman publikmu: /store/{form.username || "username"}
              </p>
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                className="input"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="input"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
              <p className="mt-1 text-xs text-slate-500">Minimal 6 karakter.</p>
            </div>
            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Memproses..." : "Buat Akun"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
