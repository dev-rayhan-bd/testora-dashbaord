"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, Ban, Clock, Crown } from "lucide-react";

export type PremiumStats = {
  active: number;
  expiredThisMonth: number;
  cancelled: number;
  expiringSoon: number;
};

type CardKey = keyof PremiumStats;

const statConfig: {
  key: CardKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconWrap: string;
  badgeBg: string;
  badgeText: string;
  badgeLabel: string;
}[] = [
  {
    key: "active",
    label: "Active Subscriptions",
    icon: Crown,
    iconWrap: "border-[#cbe0f4] bg-[#eaf4fd] text-[#247fd4]",
    badgeBg: "bg-[#eaf4fd]",
    badgeText: "text-[#247fd4]",
    badgeLabel: "Live",
  },
  {
    key: "expiredThisMonth",
    label: "Expired This Month",
    icon: Clock,
    iconWrap: "border-[#f2dec4] bg-[#fdf5eb] text-[#d9822b]",
    badgeBg: "bg-[#fdf5eb]",
    badgeText: "text-[#d9822b]",
    badgeLabel: "This Month",
  },
  {
    key: "cancelled",
    label: "Cancelled Plans",
    icon: Ban,
    iconWrap: "border-[#f4d7d7] bg-[#fdeeee] text-[#e05252]",
    badgeBg: "bg-[#fdeeee]",
    badgeText: "text-[#e05252]",
    badgeLabel: "Revoked",
  },
  {
    key: "expiringSoon",
    label: "Expiring Soon (30d)",
    icon: AlertTriangle,
    iconWrap: "border-[#fedac2] bg-[#fff3ec] text-[#e66c2c]",
    badgeBg: "bg-[#fff3ec]",
    badgeText: "text-[#e66c2c]",
    badgeLabel: "30 Days",
  },
];

interface StatsCardsProps {
  stats: PremiumStats;
  isLoading?: boolean;
  selectedFilter?: string;
  onCardClick?: (key: CardKey) => void;
}

export default function StatsCards({
  stats,
  isLoading = false,
  selectedFilter,
  onCardClick,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {statConfig.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key] ?? 0;
        const isSelected =
          (item.key === "active" && selectedFilter?.toLowerCase() === "active") ||
          (item.key === "expiredThisMonth" && selectedFilter?.toLowerCase() === "expired") ||
          (item.key === "cancelled" && selectedFilter?.toLowerCase() === "cancelled") ||
          (item.key === "expiringSoon" && selectedFilter?.toLowerCase().includes("30d"));

        return (
          <div
            key={item.key}
            onClick={() => onCardClick?.(item.key)}
            className={cn(
              "group relative flex cursor-pointer flex-col justify-between rounded-xl border bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
              isSelected
                ? "border-[#6da5e0] ring-2 ring-[#6da5e0]/20"
                : "border-[#dce7f2] hover:border-[#b8d4ee]"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105",
                    item.iconWrap
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  {isLoading ? (
                    <div className="h-7 w-14 animate-pulse rounded bg-slate-200" />
                  ) : (
                    <p className="text-2xl font-bold tracking-tight text-[#2f4256]">
                      {value.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs font-medium text-[#7e95ab]">{item.label}</p>
                </div>
              </div>

              <span
                className={cn(
                  "inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                  item.badgeBg,
                  item.badgeText
                )}
              >
                {item.badgeLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
