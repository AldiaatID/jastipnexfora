import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TemplateEditor from "@/components/TemplateEditor";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const user = (await getCurrentUser())!;
  const templates = await prisma.template.findMany({
    where: { storeId: user.store!.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Template WhatsApp</h1>
        <p className="text-sm text-slate-500">
          Gunakan variabel <code className="rounded bg-slate-100 px-1">{"{{nama}}"}</code>,{" "}
          <code className="rounded bg-slate-100 px-1">{"{{kode}}"}</code>,{" "}
          <code className="rounded bg-slate-100 px-1">{"{{produk}}"}</code>,{" "}
          <code className="rounded bg-slate-100 px-1">{"{{total}}"}</code>,{" "}
          <code className="rounded bg-slate-100 px-1">{"{{toko}}"}</code>.
        </p>
      </div>
      <TemplateEditor
        templates={templates.map((t) => ({
          id: t.id,
          key: t.key,
          title: t.title,
          body: t.body,
        }))}
      />
    </div>
  );
}
