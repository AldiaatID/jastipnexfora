# JastipFlow

SaaS web app untuk pelaku jastip & reseller. Kelola katalog produk, pre-order, pesanan pelanggan, pembayaran, stok, dan laporan profit dalam satu dashboard yang clean dan mobile-friendly.

> Stack: **Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS** · **Prisma** · **SQLite** · **JWT (jose)**

## Fitur MVP

- Authentication (register/login/logout) dengan JWT cookie + middleware proteksi route
- Dashboard ringkasan: total produk, total pesanan, belum dibayar, selesai, omzet, profit
- CRUD produk lengkap: harga modal, harga jual, profit otomatis, stok, kategori, estimasi kedatangan, status aktif/nonaktif
- Halaman katalog publik di `/store/[username]` dengan search, filter kategori, modal pemesanan, dan tombol WhatsApp
- Sistem pre-order: pelanggan mengisi data, owner menerima pesanan dengan status pembayaran (Belum bayar / DP / Lunas) dan status pesanan (Pending / Diproses / Dikirim / Selesai / Dibatalkan)
- Dashboard pesanan: filter status, search nama, detail, update status, hapus
- Template WhatsApp dengan variabel `{{nama}}`, `{{kode}}`, `{{produk}}`, `{{total}}`, `{{toko}}` dan generator `wa.me`
- Laporan: omzet & profit bulan ini, total semua waktu, pesanan selesai, belum dibayar, top 5 produk laris, export CSV
- Pengaturan toko: nama, username, logo, deskripsi, WhatsApp, Instagram, TikTok, info rekening
- Landing page SaaS: hero, fitur, pricing (Free / Basic / Pro), FAQ, CTA
- Responsive: sidebar di desktop, bottom nav di mobile

## Cara menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env

# 3. Setup database (SQLite)
npx prisma db push
npm run db:seed

# 4. Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Akun Demo

- Email: `demo@jastipflow.id`
- Password: `demo1234`
- Toko publik: [http://localhost:3000/store/demo](http://localhost:3000/store/demo)

## Struktur Folder

```
prisma/
├── schema.prisma         # Skema database
└── seed.ts               # Dummy data demo

src/
├── app/
│   ├── (auth)/           # Halaman login & register
│   ├── api/              # API routes (auth, products, orders, store, templates, reports)
│   ├── dashboard/        # Halaman owner: ringkasan, produk, pesanan, template, laporan, pengaturan
│   ├── store/[username]/ # Halaman publik katalog
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page SaaS
│   └── globals.css       # Tailwind + komponen utility (btn, card, input, badge)
├── components/           # UI komponen reusable (DashboardNav, StatusBadge, EmptyState, ProductForm, OrderActions, TemplateEditor, SettingsForm)
├── lib/                  # prisma, auth, format, constants
└── middleware.ts         # Proteksi /dashboard
```

## Database Schema

Model utama:

- **User** — owner login (email + password hash + role)
- **Store** — toko, terhubung 1-1 dengan User, punya username unik untuk URL publik
- **Category** — kategori produk per toko
- **Product** — katalog produk (harga modal, jual, stok, gambar, estimasi kedatangan, kategori)
- **Customer** — riwayat pelanggan (opsional, untuk pengembangan)
- **Order** — pesanan dengan status & status pembayaran
- **OrderItem** — item dalam pesanan, snapshot harga modal & jual
- **Payment** — pencatatan pembayaran (siap untuk pengembangan multi-DP)
- **Template** — template pesan WhatsApp per toko

## Tips Pengembangan

- Reset database: hapus `prisma/dev.db` lalu jalankan ulang `npx prisma db push && npm run db:seed`.
- Tambah image upload (S3) cukup ganti field `imageUrl` jadi upload-then-store-URL.
- Plan limit: lihat `src/lib/constants.ts` (`PLAN_LIMITS`).
- Variabel template: ditambahkan di `src/components/OrderActions.tsx` (`sendTemplate`) dan `src/lib/format.ts` (`applyTemplate`).
