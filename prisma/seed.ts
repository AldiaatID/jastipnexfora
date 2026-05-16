import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_TEMPLATES: { key: string; title: string; body: string }[] = [
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

async function main() {
  const email = "demo@jastipflow.id";
  const password = await bcrypt.hash("demo1234", 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Demo user sudah ada, skip seed.");
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: "Demo Owner",
      password,
      role: "OWNER",
      store: {
        create: {
          name: "Demo Jastip Korea",
          username: "demo",
          description:
            "Toko jastip oleh-oleh dari Korea. Order sekarang, sampai 2-3 minggu.",
          whatsapp: "6281234567890",
          instagram: "demo.jastip",
          tiktok: "demo.jastip",
          bankInfo: "BCA 1234567890 a.n. Demo Owner",
          plan: "FREE",
          templates: { create: DEFAULT_TEMPLATES },
          categories: {
            create: [
              { name: "Skincare" },
              { name: "Snack" },
              { name: "Fashion" },
            ],
          },
        },
      },
    },
    include: { store: { include: { categories: true } } },
  });

  const store = user.store!;
  const cats = store.categories;
  const skincare = cats.find((c) => c.name === "Skincare")!;
  const snack = cats.find((c) => c.name === "Snack")!;
  const fashion = cats.find((c) => c.name === "Fashion")!;

  await prisma.product.createMany({
    data: [
      {
        name: "COSRX Snail Mucin Essence 100ml",
        description: "Essence terlaris dari Korea, melembabkan kulit.",
        imageUrl:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600",
        costPrice: 120000,
        sellPrice: 165000,
        stock: 12,
        isActive: true,
        storeId: store.id,
        categoryId: skincare.id,
      },
      {
        name: "Beauty of Joseon Sunscreen",
        description: "Sunscreen Korea, ringan dan tidak whitecast.",
        imageUrl:
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
        costPrice: 130000,
        sellPrice: 180000,
        stock: 8,
        isActive: true,
        storeId: store.id,
        categoryId: skincare.id,
      },
      {
        name: "Lotte Pepero Almond",
        description: "Snack stick coklat almond favorit.",
        imageUrl:
          "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600",
        costPrice: 18000,
        sellPrice: 28000,
        stock: 40,
        isActive: true,
        storeId: store.id,
        categoryId: snack.id,
      },
      {
        name: "Kaos Oversize Korean Style",
        description: "Bahan katun premium, cocok untuk daily wear.",
        imageUrl:
          "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600",
        costPrice: 75000,
        sellPrice: 125000,
        stock: 15,
        isActive: true,
        storeId: store.id,
        categoryId: fashion.id,
      },
      {
        name: "Innisfree Green Tea Toner",
        description: "Toner segar dari ekstrak teh hijau Jeju.",
        imageUrl:
          "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600",
        costPrice: 95000,
        sellPrice: 140000,
        stock: 0,
        isActive: false,
        storeId: store.id,
        categoryId: skincare.id,
      },
    ],
  });

  const products = await prisma.product.findMany({ where: { storeId: store.id } });

  function code() {
    return "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  // Order 1: PAID + DONE
  const o1 = await prisma.order.create({
    data: {
      code: code(),
      storeId: store.id,
      customerName: "Sari Wulandari",
      customerPhone: "6281211112222",
      customerAddress: "Jl. Melati No. 12, Jakarta",
      notes: "Tolong dibungkus rapi ya",
      paymentMethod: "TRANSFER",
      paymentStatus: "PAID",
      status: "DONE",
      items: {
        create: [
          {
            productId: products[0].id,
            productName: products[0].name,
            quantity: 2,
            unitPrice: products[0].sellPrice,
            unitCost: products[0].costPrice,
            subtotal: products[0].sellPrice * 2,
          },
        ],
      },
    },
  });
  await prisma.order.update({
    where: { id: o1.id },
    data: {
      totalAmount: products[0].sellPrice * 2,
      totalCost: products[0].costPrice * 2,
    },
  });

  // Order 2: UNPAID + PENDING
  await prisma.order.create({
    data: {
      code: code(),
      storeId: store.id,
      customerName: "Andi Pratama",
      customerPhone: "6281233334444",
      customerAddress: "Jl. Anggrek 5, Bandung",
      paymentMethod: "TRANSFER",
      paymentStatus: "UNPAID",
      status: "PENDING",
      totalAmount: products[2].sellPrice * 3 + products[3].sellPrice,
      totalCost: products[2].costPrice * 3 + products[3].costPrice,
      items: {
        create: [
          {
            productId: products[2].id,
            productName: products[2].name,
            quantity: 3,
            unitPrice: products[2].sellPrice,
            unitCost: products[2].costPrice,
            subtotal: products[2].sellPrice * 3,
          },
          {
            productId: products[3].id,
            productName: products[3].name,
            quantity: 1,
            unitPrice: products[3].sellPrice,
            unitCost: products[3].costPrice,
            subtotal: products[3].sellPrice,
          },
        ],
      },
    },
  });

  // Order 3: DP + PROCESSING
  await prisma.order.create({
    data: {
      code: code(),
      storeId: store.id,
      customerName: "Linda Permata",
      customerPhone: "6281255556666",
      customerAddress: "Jl. Mawar 8, Surabaya",
      paymentMethod: "TRANSFER",
      paymentStatus: "DP",
      status: "PROCESSING",
      totalAmount: products[1].sellPrice,
      totalCost: products[1].costPrice,
      items: {
        create: [
          {
            productId: products[1].id,
            productName: products[1].name,
            quantity: 1,
            unitPrice: products[1].sellPrice,
            unitCost: products[1].costPrice,
            subtotal: products[1].sellPrice,
          },
        ],
      },
    },
  });

  console.log("Seed selesai. Login: demo@jastipflow.id / demo1234");
  console.log("Public store: /store/demo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
