export const ORDER_STATUS = {
  PENDING: "Pending",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  DONE: "Selesai",
  CANCELLED: "Dibatalkan",
} as const;

export const PAYMENT_STATUS = {
  UNPAID: "Belum bayar",
  DP: "DP",
  PAID: "Lunas",
} as const;

export type OrderStatusKey = keyof typeof ORDER_STATUS;
export type PaymentStatusKey = keyof typeof PAYMENT_STATUS;

export const PAYMENT_METHODS = ["TRANSFER", "COD", "EWALLET"] as const;
export type PaymentMethodKey = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABEL: Record<PaymentMethodKey, string> = {
  TRANSFER: "Transfer Bank",
  COD: "Bayar di Tempat",
  EWALLET: "E-Wallet",
};

export const PLAN_LIMITS = {
  FREE: { products: 10, ordersPerMonth: 20 },
  BASIC: { products: 100, ordersPerMonth: 500 },
  PRO: { products: Infinity, ordersPerMonth: Infinity },
} as const;
