import { Search } from "lucide-react";

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
  products: string[];
  plans: string[];
  statuses: string[];
  expiringOptions: string[];
};

function FilterSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}) {
  return (
    <label className="inline-flex min-w-32.5 items-center gap-1 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-2.5 py-1.5 text-xs text-[#587189]">
      <span>{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 bg-transparent text-xs font-medium text-[#3f5f7a] outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function FiltersBar(props: FiltersBarProps) {
  return (
    <div className="rounded-lg border border-[#dce7f2] bg-white p-3">
      <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
        <label className="relative block w-full md:max-w-70">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-[#9ab0c3]" />
          <input
            value={props.search}
            onChange={(e) => props.onSearchChange(e.target.value)}
            placeholder="Search by name, email, or order ID..."
            className="h-9 w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] pr-3 pl-8 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3]"
          />
        </label>

        <FilterSelect
          value={props.product}
          onChange={props.onProductChange}
          options={props.products}
          label="Product"
        />
        <FilterSelect
          value={props.plan}
          onChange={props.onPlanChange}
          options={props.plans}
          label="Plan"
        />
        <FilterSelect
          value={props.status}
          onChange={props.onStatusChange}
          options={props.statuses}
          label="Status"
        />
        <FilterSelect
          value={props.expiring}
          onChange={props.onExpiringChange}
          options={props.expiringOptions}
          label="Expiring"
        />
      </div>
    </div>
  );
}
