import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/constants";

const ORDER_COLOR: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PROCESSING: "bg-sky-100 text-sky-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DONE: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-slate-200 text-slate-600",
};

const PAYMENT_COLOR: Record<string, string> = {
  UNPAID: "bg-red-100 text-red-700",
  DP: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
};

export function OrderStatusBadge({ status }: { status: string }) {
  const cls = ORDER_COLOR[status] || "bg-slate-100 text-slate-700";
  const label = (ORDER_STATUS as Record<string, string>)[status] || status;
  return <span className={"badge " + cls}>{label}</span>;
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const cls = PAYMENT_COLOR[status] || "bg-slate-100 text-slate-700";
  const label = (PAYMENT_STATUS as Record<string, string>)[status] || status;
  return <span className={"badge " + cls}>{label}</span>;
}
