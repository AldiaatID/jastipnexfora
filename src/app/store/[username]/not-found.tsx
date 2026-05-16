import Link from "next/link";

export default function NotFoundStore() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center">
      <div>
        <p className="text-5xl">🛍️</p>
        <h1 className="mt-3 text-2xl font-bold">Toko tidak ditemukan</h1>
        <p className="mt-2 text-sm text-slate-500">
          Username yang kamu cari belum terdaftar di JastipFlow.
        </p>
        <Link href="/" className="btn-primary mt-4">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
