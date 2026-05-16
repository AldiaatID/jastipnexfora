import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateOrderCode } from "@/lib/format";

const schema = z.object({
  customerName: z.string().min(1, "Nama wajib"),
  customerPhone: z.string().min(8, "Nomor WhatsApp tidak valid"),
  customerAddress: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["TRANSFER", "COD", "EWALLET"]).default("TRANSFER"),
  items: z
    .array(z.object({ productId: z.string(), quantity: z.coerce.number().int().min(1) }))
    .min(1),
});

export async function POST(
  req: Request,
  { params }: { params: { username: string } }
) {
  const store = await prisma.store.findUnique({ where: { username: params.username } });
  if (!store) return NextResponse.json({ error: "Toko tidak ditemukan" }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || "Input tidak valid" },
      { status: 400 }
    );
  }

  const productIds = parsed.data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, storeId: store.id, isActive: true },
  });
  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "Produk tidak tersedia" }, { status: 400 });
  }

  let totalAmount = 0;
  let totalCost = 0;
  const itemsData = parsed.data.items.map((i) => {
    const p = products.find((pp) => pp.id === i.productId)!;
    const subtotal = p.sellPrice * i.quantity;
    totalAmount += subtotal;
    totalCost += p.costPrice * i.quantity;
    return {
      productId: p.id,
      productName: p.name,
      quantity: i.quantity,
      unitPrice: p.sellPrice,
      unitCost: p.costPrice,
      subtotal,
    };
  });

  const order = await prisma.order.create({
    data: {
      code: generateOrderCode(),
      storeId: store.id,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      customerAddress: parsed.data.customerAddress,
      notes: parsed.data.notes,
      paymentMethod: parsed.data.paymentMethod,
      paymentStatus: "UNPAID",
      status: "PENDING",
      totalAmount,
      totalCost,
      items: { create: itemsData },
    },
  });

  return NextResponse.json({ order: { code: order.code, id: order.id } });
}
