import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatRupiah, waLink } from "@/lib/format";
import StorefrontClient from "./StorefrontClient";

export const dynamic = "force-dynamic";

export default async function StorefrontPage({
  params,
}: {
  params: { username: string };
}) {
  const store = await prisma.store.findUnique({
    where: { username: params.username },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: { category: true },
      },
      categories: { orderBy: { name: "asc" } },
    },
  });
  if (!store) notFound();

  const greetingMsg = `Halo ${store.name}, saya tertarik untuk pesan produk di toko kamu.`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-5">
          <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-xl bg-brand-100 text-2xl">
            {store.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" />
            ) : (
              "🛍️"
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{store.name}</h1>
            <p className="text-sm text-slate-500">@{store.username}</p>
          </div>
          {store.whatsapp && (
            <a
              href={waLink(store.whatsapp, greetingMsg)}
              target="_blank"
              className="hidden rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700 md:inline-flex"
              rel="noreferrer"
            >
              💬 Chat WhatsApp
            </a>
          )}
        </div>
        {store.description && (
          <div className="mx-auto max-w-4xl px-4 pb-4 text-sm text-slate-600">
            {store.description}
          </div>
        )}
        {(store.instagram || store.tiktok) && (
          <div className="mx-auto flex max-w-4xl gap-3 px-4 pb-4 text-xs text-slate-500">
            {store.instagram && <span>📸 IG: @{store.instagram}</span>}
            {store.tiktok && <span>🎵 TT: @{store.tiktok}</span>}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <StorefrontClient
          store={{
            id: store.id,
            username: store.username,
            name: store.name,
            whatsapp: store.whatsapp,
          }}
          products={store.products.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            imageUrl: p.imageUrl,
            sellPrice: p.sellPrice,
            stock: p.stock,
            estimatedAt: p.estimatedAt?.toISOString() || null,
            categoryName: p.category?.name || null,
          }))}
        />
      </main>

      <footer className="mx-auto max-w-4xl px-4 py-10 text-center text-xs text-slate-400">
        Powered by{" "}
        <Link href="/" className="text-brand-600 hover:underline">
          JastipFlow
        </Link>
      </footer>
    </div>
  );
}
