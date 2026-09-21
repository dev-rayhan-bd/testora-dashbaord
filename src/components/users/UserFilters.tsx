"use client";

import { RefreshCw, RotateCcw, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type PlanFilterOption = {
  label: string;
  value: string;
};

type UserFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  plan: string;
  onPlanChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  plans: (string | PlanFilterOption)[];
  statuses: string[];
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onReset?: () => void;
};

export default function UserFilters({
  search,
  onSearchChange,
  plan,
  onPlanChange,
  status,
  onStatusChange,
  plans,
  statuses,
  isRefreshing = false,
  onRefresh,
  onReset,
}: UserFiltersProps) {
  const hasActiveFilters =
    search.trim().length > 0 || status !== "All" || plan !== "All";

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
      <div className="flex flex-col gap-2.5 md:flex-row md:items-center">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search students by name or email..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-[#f8fbff] pr-8 pl-9 text-xs text-slate-800 placeholder:text-slate-400 transition-colors focus:border-[#2f86d8] focus:bg-white focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Plan Filter */}
          <label className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-[#f8fbff] px-2.5 py-1.5 text-xs text-slate-600">
            <span className="font-medium text-slate-400">Plan:</span>
            <select
              value={plan}
              onChange={(e) => onPlanChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              {plans.map((p) => {
                const val = typeof p === "string" ? p : p.value;
                const lbl = typeof p === "string" ? p : p.label;
                return (
                  <option key={val} value={val}>
                    {lbl}
                  </option>
                );
              })}
            </select>
          </label>

          {/* Status Filter */}
          <label className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-[#f8fbff] px-2.5 py-1.5 text-xs text-slate-600">
            <span className="font-medium text-slate-400">Status:</span>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer capitalize"
            >
              {statuses.map((option) => (
                <option key={option} value={option} className="capitalize">
                  {option === "All" ? "All Statuses" : option}
                </option>
              ))}
            </select>
          </label>

          {/* Reset Filters button */}
          {hasActiveFilters && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-[#2f86d8] transition-all disabled:opacity-60 cursor-pointer active:scale-95"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5 text-[#2f86d8]", isRefreshing && "animate-spin")}
              />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
