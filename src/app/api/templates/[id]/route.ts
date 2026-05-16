import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user?.store) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tpl = await prisma.template.findUnique({ where: { id: params.id } });
  if (!tpl || tpl.storeId !== user.store.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const updated = await prisma.template.update({
    where: { id: tpl.id },
    data: parsed.data,
  });
  return NextResponse.json({ template: updated });
}
