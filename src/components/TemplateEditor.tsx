"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { applyTemplate } from "@/lib/format";

type Template = { id: string; key: string; title: string; body: string };

const SAMPLE = {
  nama: "Sari Wulandari",
  kode: "ORD-AB12CD",
  produk: "COSRX Snail Mucin Essence 100ml",
  total: "165.000",
  toko: "Demo Jastip Korea",
};

export default function TemplateEditor({ templates }: { templates: Template[] }) {
  const router = useRouter();
  const [items, setItems] = useState(templates);
  const [savingId, setSavingId] = useState<string | null>(null);

  function update(id: string, key: "title" | "body", value: string) {
    setItems((arr) => arr.map((t) => (t.id === id ? { ...t, [key]: value } : t)));
  }

  async function save(t: Template) {
    setSavingId(t.id);
    const res = await fetch(`/api/templates/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: t.title, body: t.body }),
    });
    setSavingId(null);
    if (res.ok) router.refresh();
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((t) => (
        <div key={t.id} className="card space-y-3">
          <div>
            <label className="label">Judul</label>
            <input
              className="input"
              value={t.title}
              onChange={(e) => update(t.id, "title", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Pesan</label>
            <textarea
              rows={5}
              className="input"
              value={t.body}
              onChange={(e) => update(t.id, "body", e.target.value)}
            />
          </div>
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            <p className="font-medium text-slate-700">Preview:</p>
            <p className="mt-1 whitespace-pre-wrap">{applyTemplate(t.body, SAMPLE)}</p>
          </div>
          <button
            onClick={() => save(t)}
            disabled={savingId === t.id}
            className="btn-primary w-full"
          >
            {savingId === t.id ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      ))}
    </div>
  );
}
