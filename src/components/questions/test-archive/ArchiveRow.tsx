import type { TestArchiveRow } from "@/lib/test-archive-data";
import { cn } from "@/lib/utils";
import { Copy, Eye, Pencil, Trash2 } from "lucide-react";

function statusClass(status: TestArchiveRow["status"]) {
  if (status === "Published") return "border-[#d0ecd9] bg-[#e9f8ef] text-[#3ea666]";
  if (status === "Draft") return "border-[#f0dfb9] bg-[#fff3da] text-[#c48a2e]";
  return "border-[#dee8f2] bg-[#f2f6fb] text-[#6d839a]";
}

function accessClass(access: TestArchiveRow["access"]) {
  return access === "Premium"
    ? "border-[#e4ddf4] bg-[#f1edfb] text-[#8468c4]"
    : "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]";
}

function typeClass(type: TestArchiveRow["type"]) {
  return type === "Additional"
    ? "border-[#e4ddf4] bg-[#f1edfb] text-[#8468c4]"
    : "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]";
}

export default function ArchiveRow({ row, serialNumber }: { row: TestArchiveRow; serialNumber: number }) {
  return (
    <tr className="border-b border-[#ecf2f8] text-xs text-[#5e768e] last:border-b-0 hover:bg-[#f8fbff]">
      <td className="px-4 py-2.5 font-semibold text-[#2f86d8]">{serialNumber}</td>
      <td className="px-4 py-2.5 font-medium text-[#4f6d87]">{row.title}</td>
      <td className="px-4 py-2.5">{row.category}</td>
      <td className="px-4 py-2.5">{row.year}</td>
      <td className="px-4 py-2.5">{row.subjectCategory}</td>
      <td className="px-4 py-2.5">
        <span className={cn("rounded-sm border px-2 py-0.5 text-[11px]", typeClass(row.type))}>
          {row.type}
        </span>
      </td>
      <td className="px-4 py-2.5">
        <span className={cn("rounded-sm border px-2 py-0.5 text-[11px]", accessClass(row.access))}>
          {row.access}
        </span>
      </td>
      <td className="px-4 py-2.5">{row.questions}</td>
      <td className="px-4 py-2.5">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]",
            statusClass(row.status)
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {row.status}
        </span>
      </td>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-0.5 text-[#7f95aa]">
          <button
            type="button"
            aria-label="View test"
            className="rounded p-1 hover:bg-[#f3f7fb] hover:text-[#2f86d8]"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Edit test"
            className="rounded p-1 hover:bg-[#f3f7fb] hover:text-[#2f86d8]"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Duplicate test"
            className="rounded p-1 hover:bg-[#f3f7fb] hover:text-[#2f86d8]"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Delete test"
            className="rounded p-1 hover:bg-[#fdeeee] hover:text-[#db6f6f]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
