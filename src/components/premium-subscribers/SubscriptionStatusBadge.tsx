import { cn } from "@/lib/utils";
import type { SubscriptionStatus } from "@/types";

const styles: Record<SubscriptionStatus, string> = {
  Active: "border-[#d0ecd9] bg-[#e9f8ef] text-[#3ea666]",
  Expired: "border-[#f0dfb9] bg-[#fff3da] text-[#c48a2e]",
  Cancelled: "border-[#f4d7d7] bg-[#fdeeee] text-[#db6f6f]",
};

export default function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]",
        styles[status]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
