import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const user = (await getCurrentUser())!;
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product || product.storeId !== user.store!.id) notFound();
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
        <h1 className="mt-2 text-2xl font-bold">Edit Produk</h1>
      </div>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          costPrice: product.costPrice,
          sellPrice: product.sellPrice,
          stock: product.stock,
          isActive: product.isActive,
          estimatedAt: product.estimatedAt?.toISOString() || null,
          categoryId: product.categoryId,
        }}
      />
    </div>
  );
}
