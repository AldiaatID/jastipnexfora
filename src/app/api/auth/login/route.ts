import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, signSession } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Email atau password tidak valid" },
      { status: 400 }
    );
  }
  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    include: { store: true },
  });
  if (!user) {
    return NextResponse.json(
      { error: "Email atau password salah" },
      { status: 401 }
    );
  }
  const ok = await bcrypt.compare(parsed.data.password, user.password);
  if (!ok) {
    return NextResponse.json(
      { error: "Email atau password salah" },
      { status: 401 }
    );
  }

  const token = await signSession({
    userId: user.id,
    email: user.email,
    storeId: user.store?.id,
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
