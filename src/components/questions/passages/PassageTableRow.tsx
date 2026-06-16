import { cn } from "@/lib/utils";
import { type PassageItem } from "@/store/apis/question";
import { Copy, Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

function statusClass(isActive: boolean) {
  return isActive
    ? "border-[#d0ecd9] bg-[#e9f8ef] text-[#3ea666]"
    : "border-[#dee8f2] bg-[#f2f6fb] text-[#6d839a]";
}

export default function PassageTableRow({
  row,
  rowIndex,
  onEdit,
}: {
  row: PassageItem;
  rowIndex: number;
  onEdit?: (id: string) => void;
}) {
  return (
    <tr className="border-b border-[#ecf2f8] text-xs text-[#5e768e] last:border-b-0 hover:bg-[#f8fbff]">
      <td className="px-3 py-2.5 font-semibold text-[#2f86d8]">{rowIndex}</td>
      <td className="px-3 py-2.5 text-[#2f86d8]">{row.passageCode}</td>
      <td className="max-w-48 px-3 py-2.5 font-medium text-[#3f5f7a]">
        <span className="block truncate" title={row.title}>
          {row.title}
        </span>
      </td>
      <td className="max-w-56 px-3 py-2.5 text-[#5e768e]">
        <span className="block truncate" title={row.content}>
          {row.content}
        </span>
      </td>
      <td className="px-3 py-2.5 text-center">
        {row.passageImageUrl ? (
          <Image
            src={row.passageImageUrl}
            alt={row.title}
            className="mx-auto h-16 w-20 rounded object-cover"
            width={50}
            height={40}
          />
        ) : (
          <span className="text-[#c0cedc]">—</span>
        )}
      </td>
      <td className="px-3 py-2.5">
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-medium",
            statusClass(row.isActive)
          )}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-3 py-2.5 text-[#8ea1b4]">{new Date(row.createdAt).toLocaleDateString()}</td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <button type="button" title="View" className="text-[#9ab0c3] hover:text-[#4a93d9]">
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Edit"
            onClick={() => onEdit?.(row._id)}
            className="text-[#9ab0c3] hover:text-[#3f5f7a]"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button type="button" title="Duplicate" className="text-[#9ab0c3] hover:text-[#7b6db5]">
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button type="button" title="Delete" className="text-[#9ab0c3] hover:text-[#db6f6f]">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
