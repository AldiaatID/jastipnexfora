import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const user = (await getCurrentUser())!;
  const categories = await prisma.category.findMany({
    where: { storeId: user.store!.id },
    orderBy: { name: "asc" },
  });
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/products" className="text-sm text-brand-600 hover:underline">
          ← Kembali ke produk
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Tambah Produk</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
