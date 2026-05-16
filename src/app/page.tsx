import Link from "next/link";

const FEATURES = [
  {
    title: "Katalog Produk",
    desc: "Kelola produk lengkap dengan harga modal, harga jual, stok, kategori, dan estimasi kedatangan.",
    icon: "🛍️",
  },
  {
    title: "Pre-Order Otomatis",
    desc: "Customer bisa order langsung dari halaman katalog publik tokomu.",
    icon: "📝",
  },
  {
    title: "Status Pembayaran",
    desc: "Lacak pesanan: belum bayar, DP, atau lunas dengan badge yang mudah dibaca.",
    icon: "💳",
  },
  {
    title: "Template WhatsApp",
    desc: "Generate pesan konfirmasi, reminder, dan info pengiriman dalam satu klik.",
    icon: "💬",
  },
  {
    title: "Laporan Profit",
    desc: "Lihat omzet bulanan, profit, dan produk paling laris secara realtime.",
    icon: "📊",
  },
  {
    title: "Mobile Friendly",
    desc: "Dashboard nyaman dipakai dari HP maupun laptop.",
    icon: "📱",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "Rp0",
    suffix: "/selamanya",
    features: ["Maksimal 10 produk", "Maksimal 20 pesanan/bulan", "Halaman katalog publik", "Template WhatsApp"],
    cta: "Daftar Gratis",
    popular: false,
  },
  {
    name: "Basic",
    price: "Rp49.000",
    suffix: "/bulan",
    features: ["Hingga 100 produk", "Hingga 500 pesanan/bulan", "Laporan & export CSV", "Multi kategori"],
    cta: "Pilih Basic",
    popular: true,
  },
  {
    name: "Pro",
    price: "Rp99.000",
    suffix: "/bulan",
    features: ["Produk unlimited", "Pesanan unlimited", "Prioritas support", "Custom domain (segera)"],
    cta: "Pilih Pro",
    popular: false,
  },
];

const FAQS = [
  {
    q: "Apakah JastipFlow cocok untuk pemula?",
    a: "Sangat cocok. Tampilannya sederhana dan kamu bisa langsung jualan dengan link katalog publik.",
  },
  {
    q: "Apakah ada free trial?",
    a: "Plan Free bisa dipakai selamanya untuk skala kecil. Upgrade hanya kalau memang butuh.",
  },
  {
    q: "Bisa pakai dari HP?",
    a: "Tentu. Dashboard JastipFlow responsive dan nyaman digunakan dari layar mobile.",
  },
  {
    q: "Bagaimana cara customer order?",
    a: "Setiap toko punya halaman publik di /store/username. Cukup share linknya ke social media.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-brand-50 to-white text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white font-bold">
            J
          </div>
          <span className="text-lg font-semibold">JastipFlow</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <a href="#fitur" className="text-slate-600 hover:text-slate-900">Fitur</a>
          <a href="#harga" className="text-slate-600 hover:text-slate-900">Harga</a>
          <a href="#faq" className="text-slate-600 hover:text-slate-900">FAQ</a>
          <Link href="/login" className="text-slate-600 hover:text-slate-900">Masuk</Link>
          <Link href="/register" className="btn-primary">Daftar Gratis</Link>
        </nav>
        <Link href="/register" className="btn-primary md:hidden">Daftar</Link>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-10 md:pb-20 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="badge bg-brand-100 text-brand-700">Untuk Jastip & Reseller</span>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Kelola toko jastip kamu{" "}
              <span className="text-brand-600">tanpa ribet</span>.
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              JastipFlow bantu kamu mengatur produk, pre-order, pembayaran, dan
              laporan profit dalam satu dashboard yang simple dan mobile
              friendly.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/register" className="btn-primary px-5 py-3 text-base">
                Mulai Gratis Sekarang
              </Link>
              <Link href="/store/demo" className="btn-secondary px-5 py-3 text-base">
                Lihat Demo Toko
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Tanpa kartu kredit. Setup &lt; 1 menit.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="rounded-xl bg-gradient-to-br from-brand-50 to-white p-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Omzet bulan ini</p>
                    <p className="text-lg font-semibold">Rp4.250.000</p>
                  </div>
                  <div className="rounded-lg bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Profit</p>
                    <p className="text-lg font-semibold text-emerald-600">Rp1.380.000</p>
                  </div>
                  <div className="rounded-lg bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Pesanan</p>
                    <p className="text-lg font-semibold">28</p>
                  </div>
                  <div className="rounded-lg bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Belum bayar</p>
                    <p className="text-lg font-semibold text-amber-600">5</p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold">Pesanan terbaru</p>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex justify-between"><span>Sari Wulandari</span><span className="badge bg-emerald-100 text-emerald-700">Lunas</span></li>
                    <li className="flex justify-between"><span>Andi Pratama</span><span className="badge bg-amber-100 text-amber-700">Belum bayar</span></li>
                    <li className="flex justify-between"><span>Linda Permata</span><span className="badge bg-sky-100 text-sky-700">DP</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Semua yang kamu butuhkan</h2>
          <p className="mt-2 text-slate-600">
            Dirancang khusus untuk pelaku jastip dan reseller di Indonesia.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="harga" className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Pilih paket yang sesuai</h2>
          <p className="mt-2 text-slate-600">Mulai gratis, upgrade saat butuh.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={
                "card flex flex-col " +
                (p.popular ? "border-brand-500 ring-2 ring-brand-200" : "")
              }
            >
              {p.popular && (
                <span className="badge mb-2 self-start bg-brand-100 text-brand-700">
                  Paling Populer
                </span>
              )}
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <p className="mt-3">
                <span className="text-3xl font-bold">{p.price}</span>
                <span className="text-slate-500">{p.suffix}</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {p.features.map((feat) => (
                  <li key={feat} className="flex gap-2">
                    <span className="text-brand-600">✓</span> {feat}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={
                  "mt-6 " + (p.popular ? "btn-primary" : "btn-secondary")
                }
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Pertanyaan yang sering ditanyakan</h2>
        </div>
        <div className="mt-8 space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-slate-200 bg-white p-4"
            >
              <summary className="flex cursor-pointer items-center justify-between font-medium">
                {f.q}
                <span className="text-slate-400 group-open:rotate-180 transition">▾</span>
              </summary>
              <p className="mt-2 text-sm text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-2xl bg-brand-600 p-8 text-center text-white shadow-soft md:p-12">
          <h2 className="text-3xl font-bold">Siap naik level jualanmu?</h2>
          <p className="mt-2 text-brand-100">
            Daftar gratis sekarang dan dapatkan halaman katalog publik dalam hitungan menit.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50"
          >
            Buat Akun Gratis
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} JastipFlow. Dibuat untuk UMKM Indonesia.
      </footer>
    </div>
  );
}
