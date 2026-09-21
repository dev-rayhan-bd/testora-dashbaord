import { cn } from "@/lib/utils";
import { AlertTriangle, Ban, Clock, Crown, TrendingDown, TrendingUp } from "lucide-react";

export type PremiumStats = {
  active: number;
  expiredThisMonth: number;
  cancelled: number;
  expiringSoon: number;
};

type DeltaBadge = { label: string; positive: boolean } | null;

const statConfig: {
  key: keyof PremiumStats;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconWrap: string;
  delta: DeltaBadge;
}[] = [
  {
    key: "active",
    label: "Active Subscriptions",
    icon: Crown,
    iconWrap: "border-[#d7e6f4] bg-[#eff5fc] text-[#2f86d8]",
    delta: { label: "+12%", positive: true },
  },
  {
    key: "expiredThisMonth",
    label: "Expired This Month",
    icon: Clock,
    iconWrap: "border-[#f0dfb9] bg-[#fff6e3] text-[#c48a2e]",
    delta: { label: "-2", positive: false },
  },
  {
    key: "cancelled",
    label: "Cancelled Plans",
    icon: Ban,
    iconWrap: "border-[#f3dddd] bg-[#feefef] text-[#db6f6f]",
    delta: null,
  },
  {
    key: "expiringSoon",
    label: "Expiring Soon (30d)",
    icon: AlertTriangle,
    iconWrap: "border-[#f3dddd] bg-[#feefef] text-[#db6f6f]",
    delta: { label: "-5", positive: false },
  },
];

export default function StatsCards({ stats }: { stats: PremiumStats }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {statConfig.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key];

        return (
          <div key={item.key} className="rounded-lg border border-[#dce7f2] bg-white p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
                    item.iconWrap
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[22px] leading-6 font-semibold text-[#3f5f7a]">{value}</p>
                  <p className="text-[11px] text-[#90a3b6]">{item.label}</p>
                </div>
              </div>

              {item.delta && (
                <span
                  className={cn(
                    "mt-0.5 inline-flex shrink-0 items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-medium",
                    item.delta.positive
                      ? "border-[#d0ecd9] bg-[#e9f8ef] text-[#3ea666]"
                      : "border-[#f4d7d7] bg-[#fdeeee] text-[#db6f6f]"
                  )}
                >
                  {item.delta.positive ? (
                    <TrendingUp className="h-2.5 w-2.5" />
                  ) : (
                    <TrendingDown className="h-2.5 w-2.5" />
                  )}
                  {item.delta.label}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
