import { type OrderStatus, type PaymentStatus } from "@/lib/orders-data";
import { cn } from "@/lib/utils";

export function paymentStatusClass(status: PaymentStatus) {
  if (status === "Paid") return "border-[#b9e8c8] bg-[#e7f8ee] text-[#2f9960]";
  if (status === "COD Pending") return "border-[#f3d9a9] bg-[#fff3da] text-[#c48a2e]";
  if (status === "Refunded") return "border-[#cdd8ff] bg-[#edf0ff] text-[#5b72c9]";
  return "border-[#f2c5c5] bg-[#fdeeee] text-[#cf5d5d]";
}

export function orderStatusClass(status: OrderStatus) {
  if (status === "Processing") return "border-[#c9dcf7] bg-[#edf4ff] text-[#5186d9]";
  if (status === "Shipped") return "border-[#d6d9fb] bg-[#eff1ff] text-[#6b71d1]";
  if (status === "Delivered") return "border-[#bfe6c9] bg-[#e8f7ed] text-[#3c9b63]";
  if (status === "Cancelled") return "border-[#f2c5c5] bg-[#fdeeee] text-[#cf5d5d]";
  if (status === "Returned") return "border-[#f6d9c0] bg-[#fff1e3] text-[#c18543]";
  return "border-[#e2d1fb] bg-[#f3ecff] text-[#8b63c7]";
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] leading-none font-medium",
        paymentStatusClass(status)
      )}
    >
      {status}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] leading-none font-medium",
        orderStatusClass(status)
      )}
    >
      {status}
    </span>
  );
}
