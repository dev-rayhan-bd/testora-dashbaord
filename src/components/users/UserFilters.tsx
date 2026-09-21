import { Search } from "lucide-react";

type UserFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  plan: string;
  onPlanChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  categories: string[];
  types: string[];
  plans: string[];
  statuses: string[];
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
    <label className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-2.5 py-1.5 text-xs text-[#587189]">
      <span className="whitespace-nowrap">{label}:</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 bg-transparent text-xs font-medium text-[#3f5f7a] outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function UserFilters(props: UserFiltersProps) {
  return (
    <div className="rounded-lg border border-[#dce7f2] bg-white p-3">
      {/* Mobile: search on top, filters wrap below */}
      {/* md+: single row — filters left (shrink-0), search fills remaining space */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
           {/* Search — full width on mobile, fills remaining space on md+ */}
        <label className="relative block w-full md:flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-[#9ab0c3]" />
          <input
            value={props.search}
            onChange={(event) => props.onSearchChange(event.target.value)}
            placeholder="Search by name or email..."
            className="h-9 w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] pr-3 pl-8 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3]"
          />
        </label>
        
        {/* Filters row — wraps on mobile, stays inline on md+ */}
        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            value={props.category}
            onChange={props.onCategoryChange}
            options={props.categories}
            label="Category"
          />
          <FilterSelect
            value={props.type}
            onChange={props.onTypeChange}
            options={props.types}
            label="Type"
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
        </div>


      </div>
    </div>
  );
}
