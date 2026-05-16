import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  costPrice: z.coerce.number().min(0).optional(),
  sellPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
  estimatedAt: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  newCategory: z.string().optional().nullable(),
});

async function ensureOwner(id: string, storeId: string) {
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p || p.storeId !== storeId) return null;
  return p;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user?.store) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const product = await ensureOwner(params.id, user.store.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || "Input tidak valid" },
      { status: 400 }
    );
  }

  let categoryId: string | null | undefined = parsed.data.categoryId;
  if (parsed.data.newCategory) {
    const cat = await prisma.category.upsert({
      where: { storeId_name: { storeId: user.store.id, name: parsed.data.newCategory } },
      create: { storeId: user.store.id, name: parsed.data.newCategory },
      update: {},
    });
    categoryId = cat.id;
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description ?? undefined,
      imageUrl: parsed.data.imageUrl === "" ? null : parsed.data.imageUrl ?? undefined,
      costPrice: parsed.data.costPrice,
      sellPrice: parsed.data.sellPrice,
      stock: parsed.data.stock,
      isActive: parsed.data.isActive,
      estimatedAt: parsed.data.estimatedAt ? new Date(parsed.data.estimatedAt) : parsed.data.estimatedAt === "" ? null : undefined,
      categoryId: categoryId,
    },
  });
  return NextResponse.json({ product: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user?.store) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const product = await ensureOwner(params.id, user.store.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.product.delete({ where: { id: product.id } });
  return NextResponse.json({ ok: true });
}
