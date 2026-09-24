import { type OrderStatus, type PaymentStatus } from "@/lib/orders-data";
import { cn } from "@/lib/utils";

export function paymentStatusClass(status: string) {
  const s = status?.toLowerCase();
  if (s === "paid") return "border-[#b9e8c8] bg-[#e7f8ee] text-[#2f9960]";
  if (s === "pending") return "border-[#f3d9a9] bg-[#fff3da] text-[#c48a2e]";
  if (s === "refunded") return "border-[#cdd8ff] bg-[#edf0ff] text-[#5b72c9]";
  return "border-[#f2c5c5] bg-[#fdeeee] text-[#cf5d5d]";
}

export function orderStatusClass(status: string) {
  const s = status?.toLowerCase();
  if (s === "pending" || s === "new") return "border-[#e2d1fb] bg-[#f3ecff] text-[#8b63c7]";
  if (s === "confirmed" || s === "processing") return "border-[#c9dcf7] bg-[#edf4ff] text-[#5186d9]";
  if (s === "shipped") return "border-[#d6d9fb] bg-[#eff1ff] text-[#6b71d1]";
  if (s === "delivered") return "border-[#bfe6c9] bg-[#e8f7ed] text-[#3c9b63]";
  if (s === "cancelled") return "border-[#f2c5c5] bg-[#fdeeee] text-[#cf5d5d]";
  if (s === "returned" || s === "refunded") return "border-[#f6d9c0] bg-[#fff1e3] text-[#c18543]";
  return "border-[#dce7f2] bg-[#f4f8fc] text-[#6f8499]";
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] leading-none font-medium capitalize",
        paymentStatusClass(status)
      )}
    >
      {status?.replace(/_/g, " ")}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] leading-none font-medium capitalize",
        orderStatusClass(status)
      )}
    >
      {status?.replace(/_/g, " ")}
    </span>
  );
}
