import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.store) return new Response("Unauthorized", { status: 401 });

  const orders = await prisma.order.findMany({
    where: { storeId: user.store.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const headers = [
    "Kode",
    "Tanggal",
    "Customer",
    "WhatsApp",
    "Alamat",
    "Status",
    "Pembayaran",
    "Metode",
    "Item",
    "Total",
    "Modal",
    "Profit",
  ];
  const rows = orders.map((o) => [
    o.code,
    o.createdAt.toISOString(),
    o.customerName,
    o.customerPhone,
    o.customerAddress || "",
    o.status,
    o.paymentStatus,
    o.paymentMethod || "",
    o.items.map((i) => `${i.quantity}x ${i.productName}`).join(" | "),
    o.totalAmount,
    o.totalCost,
    o.totalAmount - o.totalCost,
  ]);

  const csv = [headers, ...rows].map((r) => r.map(csvEscape).join(",")).join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${user.store.username}-${Date.now()}.csv"`,
    },
  });
}
