import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/format";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const user = (await getCurrentUser())!;
  const storeId = user.store!.id;

  const products = await prisma.product.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Produk</h1>
          <p className="text-sm text-slate-500">Kelola katalog produk tokomu.</p>
        </div>
        <Link href="/dashboard/products/new" className="btn-primary">
          + Tambah Produk
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon="🛍️"
          title="Belum ada produk"
          description="Tambahkan produk pertamamu agar customer bisa mulai memesan."
          action={
            <Link href="/dashboard/products/new" className="btn-primary">
              Tambah Produk
            </Link>
          }
        />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3">Produk</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Harga Modal</th>
                <th className="px-4 py-3">Harga Jual</th>
                <th className="px-4 py-3">Profit</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="grid h-10 w-10 place-items-center rounded bg-slate-100 text-slate-400">
                          📦
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="line-clamp-1 text-xs text-slate-500">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {p.category?.name || "-"}
                  </td>
                  <td className="px-4 py-3">{formatRupiah(p.costPrice)}</td>
                  <td className="px-4 py-3 font-medium">{formatRupiah(p.sellPrice)}</td>
                  <td className="px-4 py-3 text-emerald-600">
                    {formatRupiah(p.sellPrice - p.costPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.stock === 0 ? "text-red-600" : ""}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    {p.isActive ? (
                      <span className="badge bg-emerald-100 text-emerald-700">Aktif</span>
                    ) : (
                      <span className="badge bg-slate-200 text-slate-600">Nonaktif</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/products/${p.id}`}
                      className="text-sm text-brand-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
