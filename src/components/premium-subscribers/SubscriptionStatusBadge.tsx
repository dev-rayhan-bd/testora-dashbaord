import { cn } from "@/lib/utils";

interface SubscriptionStatusBadgeProps {
  status?: string;
  className?: string;
}

export default function SubscriptionStatusBadge({ status = "Active", className }: SubscriptionStatusBadgeProps) {
  const normalized = status.toLowerCase();

  let badgeStyle = "border-[#d0ecd9] bg-[#e9f8ef] text-[#3ea666]"; // Green (active)
  let label = "Active";

  if (normalized === "expired") {
    badgeStyle = "border-[#f0dfb9] bg-[#fff3da] text-[#c48a2e]"; // Orange
    label = "Expired";
  } else if (normalized === "cancelled" || normalized === "canceled") {
    badgeStyle = "border-[#f4d7d7] bg-[#fdeeee] text-[#db6f6f]"; // Red
    label = "Cancelled";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize",
        badgeStyle,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
