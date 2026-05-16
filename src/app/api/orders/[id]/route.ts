import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DONE", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["UNPAID", "DP", "PAID"]).optional(),
});

async function ensureOwner(id: string, storeId: string) {
  const o = await prisma.order.findUnique({ where: { id } });
  if (!o || o.storeId !== storeId) return null;
  return o;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user?.store) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const order = await ensureOwner(params.id, user.store.id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: parsed.data,
  });
  return NextResponse.json({ order: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user?.store) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const order = await ensureOwner(params.id, user.store.id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.order.delete({ where: { id: order.id } });
  return NextResponse.json({ ok: true });
}
