export function formatRupiah(value: number): string {
  if (Number.isNaN(value) || value === null || value === undefined) return "Rp0";
  return "Rp" + Math.round(value).toLocaleString("id-ID");
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateOrderCode(): string {
  return (
    "ORD-" +
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    Date.now().toString(36).slice(-3).toUpperCase()
  );
}

export function applyTemplate(
  body: string,
  vars: Record<string, string | number | undefined | null>
): string {
  return body.replace(/{{\s*([\w]+)\s*}}/g, (_, key) => {
    const v = vars[key];
    if (v === undefined || v === null) return "";
    return String(v);
  });
}

export function waLink(phone: string, message: string): string {
  const clean = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
