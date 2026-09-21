import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types";

type StatusBadgeProps = {
  status: UserStatus | string;
  className?: string;
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const normStatus = (status || "Active").toLowerCase();

  const isBlocked = normStatus === "blocked" || normStatus === "suspended";
  const isDisabled = normStatus === "disabled" || normStatus === "inactive";
  const isActive = !isBlocked && !isDisabled;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-tight shadow-2xs transition-all",
        isActive && "border-emerald-200 bg-emerald-50 text-emerald-700",
        isBlocked && "border-rose-200 bg-rose-50 text-rose-700",
        isDisabled && "border-amber-200 bg-amber-50 text-amber-700",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isActive && "bg-emerald-500 shadow-emerald-400/50 shadow-sm",
          isBlocked && "bg-rose-500",
          isDisabled && "bg-amber-500"
        )}
      />
      <span>
        {isActive ? "Active" : isBlocked ? "Blocked" : "Disabled"}
      </span>
    </span>
  );
}
