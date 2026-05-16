import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  costPrice: z.coerce.number().min(0),
  sellPrice: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  isActive: z.coerce.boolean().optional(),
  estimatedAt: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  newCategory: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user?.store) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || "Input tidak valid" },
      { status: 400 }
    );
  }

  let categoryId = parsed.data.categoryId || null;
  if (!categoryId && parsed.data.newCategory) {
    const cat = await prisma.category.upsert({
      where: { storeId_name: { storeId: user.store.id, name: parsed.data.newCategory } },
      create: { storeId: user.store.id, name: parsed.data.newCategory },
      update: {},
    });
    categoryId = cat.id;
  }

  const product = await prisma.product.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      imageUrl: parsed.data.imageUrl || null,
      costPrice: parsed.data.costPrice,
      sellPrice: parsed.data.sellPrice,
      stock: parsed.data.stock,
      isActive: parsed.data.isActive ?? true,
      estimatedAt: parsed.data.estimatedAt ? new Date(parsed.data.estimatedAt) : null,
      categoryId,
      storeId: user.store.id,
    },
  });

  return NextResponse.json({ product });
}
