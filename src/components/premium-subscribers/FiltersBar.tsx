"use client";

import { RefreshCw, RotateCcw, Search, X } from "lucide-react";

type FilterOption = string | { label: string; value: string };

type FiltersBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  product: string;
  onProductChange: (value: string) => void;
  plan: string;
  onPlanChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  expiring: string;
  onExpiringChange: (value: string) => void;
  products: FilterOption[];
  plans: FilterOption[];
  statuses: FilterOption[];
  expiringOptions: FilterOption[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onResetFilters?: () => void;
};

function FilterSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  label: string;
}) {
  return (
    <label className="inline-flex items-center gap-1.5 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 py-1.5 text-xs text-[#587189] transition-colors focus-within:border-[#7fb3e8] hover:border-[#cbdff2]">
      <span className="font-medium text-[#7e95ab]">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer bg-transparent text-xs font-semibold text-[#3f5f7a] outline-none"
      >
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const text = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={val} value={val}>
              {text}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export default function FiltersBar({
  search,
  onSearchChange,
  product,
  onProductChange,
  plan,
  onPlanChange,
  status,
  onStatusChange,
  expiring,
  onExpiringChange,
  products,
  plans,
  statuses,
  expiringOptions,
  onRefresh,
  isRefreshing = false,
  onResetFilters,
}: FiltersBarProps) {
  const hasActiveFilters =
    search.trim().length > 0 ||
    product !== "All" ||
    plan !== "All" ||
    status !== "All" ||
    expiring !== "All";

  return (
    <div className="rounded-xl border border-[#dce7f2] bg-white p-3.5 shadow-xs">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {/* Search box */}
          <div className="relative min-w-56 flex-1 sm:max-w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9ab0c3]" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search name, email, order ID..."
              className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] pr-8 pl-9 text-xs text-[#3f5f7a] outline-none transition-colors placeholder:text-[#9ab0c3] focus:border-[#7fb3e8] focus:bg-white"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 text-[#9ab0c3] hover:text-[#3f5f7a]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <FilterSelect
            value={product}
            onChange={onProductChange}
            options={products}
            label="Product"
          />
          <FilterSelect
            value={plan}
            onChange={onPlanChange}
            options={plans}
            label="Plan"
          />
          <FilterSelect
            value={status}
            onChange={onStatusChange}
            options={statuses}
            label="Status"
          />
          <FilterSelect
            value={expiring}
            onChange={onExpiringChange}
            options={expiringOptions}
            label="Expiring"
          />

          {/* Reset Filters */}
          {hasActiveFilters && onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-dashed border-[#cbdff2] bg-white px-2.5 text-xs font-medium text-[#5f7b96] transition-colors hover:bg-[#f3f8fd] hover:text-[#2f78c4]"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>

        {/* Right action: Refresh */}
        {onRefresh && (
          <div className="flex shrink-0 items-center justify-end">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs font-medium text-[#4f6d87] transition-all hover:bg-[#edf5fc] hover:text-[#2872be] active:scale-95 disabled:pointer-events-none disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#2872be]" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
