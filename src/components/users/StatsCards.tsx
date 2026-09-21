"use client";

import { cn } from "@/lib/utils";
import { Ban, PauseCircle, TrendingUp, UserCheck, Users } from "lucide-react";

export type UserStats = {
  total: number;
  active: number;
  suspended: number;
  inactive: number;
};

type StatsCardsProps = {
  stats: UserStats;
  currentStatus?: string;
  onStatusClick?: (status: string) => void;
};

export default function StatsCards({
  stats,
  currentStatus = "All",
  onStatusClick,
}: StatsCardsProps) {
  const activeRate =
    stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 100;

  const statItems = [
    {
      key: "total" as const,
      statusValue: "All",
      label: "Total Users",
      value: stats.total,
      sub: "Platform students registered",
      badge: null,
      icon: Users,
      color: "blue",
    },
    {
      key: "active" as const,
      statusValue: "active",
      label: "Active Accounts",
      value: stats.active,
      sub: `${activeRate}% active rate`,
      badge: `${activeRate}%`,
      icon: UserCheck,
      color: "emerald",
    },
    {
      key: "suspended" as const,
      statusValue: "blocked",
      label: "Blocked Accounts",
      value: stats.suspended,
      sub: "Restricted platform access",
      badge: stats.suspended > 0 ? `${stats.suspended}` : null,
      icon: Ban,
      color: "rose",
    },
    {
      key: "inactive" as const,
      statusValue: "disabled",
      label: "Disabled Accounts",
      value: stats.inactive,
      sub: "Temporary hold / inactive",
      badge: null,
      icon: PauseCircle,
      color: "amber",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        const isFilterActive =
          currentStatus !== "All" &&
          currentStatus.toLowerCase() === item.statusValue.toLowerCase();

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onStatusClick?.(item.statusValue)}
            className={cn(
              "group relative overflow-hidden rounded-xl border bg-white p-4 text-left shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs cursor-pointer",
              isFilterActive
                ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/10"
                : "border-slate-200/90"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl border shadow-2xs transition-transform group-hover:scale-105",
                    item.color === "blue" && "border-blue-200 bg-blue-50 text-[#2f86d8]",
                    item.color === "emerald" && "border-emerald-200 bg-emerald-50 text-emerald-600",
                    item.color === "rose" && "border-rose-200 bg-rose-50 text-rose-600",
                    item.color === "amber" && "border-amber-200 bg-amber-50 text-amber-600"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">{item.label}</p>
                  <p className="text-2xl font-bold tracking-tight text-slate-800">
                    {item.value.toLocaleString()}
                  </p>
                </div>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10px] font-bold",
                    item.color === "emerald" &&
                      "border-emerald-200 bg-emerald-50 text-emerald-700",
                    item.color === "rose" && "border-rose-200 bg-rose-50 text-rose-700"
                  )}
                >
                  {item.color === "emerald" && <TrendingUp className="h-2.5 w-2.5" />}
                  {item.badge}
                </span>
              )}
            </div>

            <p className="mt-2 text-[11px] text-slate-400">{item.sub}</p>
          </button>
        );
      })}
    </div>
  );
}
