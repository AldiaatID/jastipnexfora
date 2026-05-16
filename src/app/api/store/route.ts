import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/)
    .optional(),
  description: z.string().optional().nullable(),
  logoUrl: z.string().url().optional().or(z.literal("")).nullable(),
  whatsapp: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
  bankInfo: z.string().optional().nullable(),
});

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user?.store) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Input tidak valid" }, { status: 400 });
  }

  if (parsed.data.username && parsed.data.username !== user.store.username) {
    const exists = await prisma.store.findUnique({
      where: { username: parsed.data.username },
    });
    if (exists) {
      return NextResponse.json({ error: "Username sudah dipakai" }, { status: 400 });
    }
  }

  const updated = await prisma.store.update({
    where: { id: user.store.id },
    data: {
      name: parsed.data.name,
      username: parsed.data.username,
      description: parsed.data.description ?? undefined,
      logoUrl: parsed.data.logoUrl === "" ? null : parsed.data.logoUrl ?? undefined,
      whatsapp: parsed.data.whatsapp ?? undefined,
      instagram: parsed.data.instagram ?? undefined,
      tiktok: parsed.data.tiktok ?? undefined,
      bankInfo: parsed.data.bankInfo ?? undefined,
    },
  });

  return NextResponse.json({ store: updated });
}
