import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, signSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  storeName: z.string().min(1, "Nama toko wajib diisi"),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(30)
    .regex(/^[a-z0-9_-]+$/, "Username hanya boleh huruf kecil, angka, - dan _"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const DEFAULT_TEMPLATES = [
  {
    key: "confirm",
    title: "Konfirmasi Pesanan",
    body: "Halo {{nama}}, pesanan kamu untuk {{produk}} sudah kami terima. Total pembayaran: Rp{{total}}. Silakan lakukan pembayaran agar pesanan bisa diproses. Terima kasih!",
  },
  {
    key: "reminder",
    title: "Reminder Pembayaran",
    body: "Halo {{nama}}, pesanan {{kode}} kamu masih menunggu pembayaran sebesar Rp{{total}}. Mohon segera diselesaikan ya. Terima kasih!",
  },
  {
    key: "arrived",
    title: "Barang Sudah Tiba",
    body: "Halo {{nama}}, kabar baik! Barang pesanan kamu ({{produk}}) sudah tiba di kami. Akan segera kami proses pengirimannya.",
  },
  {
    key: "shipped",
    title: "Pesanan Dikirim",
    body: "Halo {{nama}}, pesanan {{kode}} sudah kami kirim ke alamatmu. Mohon ditunggu dan kabari kami setelah barang sampai ya.",
  },
  {
    key: "thanks",
    title: "Ucapan Terima Kasih",
    body: "Halo {{nama}}, terima kasih banyak sudah belanja di {{toko}}. Jangan lupa order lagi ya!",
  },
];

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || "Input tidak valid" },
      { status: 400 }
    );
  }
  const { email, password, name, storeName, username } = parsed.data;

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
  }
  const existingUsername = await prisma.store.findUnique({ where: { username } });
  if (existingUsername) {
    return NextResponse.json({ error: "Username toko sudah dipakai" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hash,
      role: "OWNER",
      store: {
        create: {
          name: storeName,
          username,
          plan: "FREE",
          templates: { create: DEFAULT_TEMPLATES },
        },
      },
    },
    include: { store: true },
  });

  const token = await signSession({
    userId: user.id,
    email: user.email,
    storeId: user.store?.id,
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
