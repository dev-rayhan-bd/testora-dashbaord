"use client";

import { cn } from "@/lib/utils";
import type { PassageItem } from "@/store/apis";
import { Check, Copy, Eye, Pencil, Power, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  row: PassageItem;
  rowIndex: number;
  onEdit: (passage: PassageItem) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (passage: PassageItem) => void;
  onPreviewImage: (url: string, title: string) => void;
}

export default function PassageTableRow({
  row,
  rowIndex,
  onEdit,
  onToggleStatus,
  onDelete,
  onPreviewImage,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(row.passageCode);
      setCopied(true);
      toast.success(`Copied: ${row.passageCode}`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  return (
    <tr className="group border-b border-[#e9eff6] text-xs text-[#526a82] transition-colors hover:bg-[#f7fbff]">
      {/* 1. SL */}
      <td className="px-4 py-3 font-semibold text-[#1e6fbe]">{rowIndex}</td>

      {/* 2. Code */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5 rounded bg-[#edf4fb] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1e6fbe]">
          {row.passageCode}
          <button
            type="button"
            onClick={handleCopyCode}
            aria-label="Copy code"
            className="text-[#6d8fae] hover:text-[#1e6fbe]"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
          </button>
        </span>
      </td>

      {/* 3. Title */}
      <td className="max-w-[200px] px-4 py-3">
        <div className="font-semibold text-[#29425a] line-clamp-1" title={row.title}>
          {row.title}
        </div>
      </td>

      {/* 4. Content Preview */}
      <td className="max-w-[280px] px-4 py-3 text-[#49637c]">
        <p className="line-clamp-2 leading-relaxed" title={row.content}>
          {row.content}
        </p>
      </td>

      {/* 5. Image Thumbnail */}
      <td className="px-4 py-3 text-center">
        {row.passageImageUrl ? (
          <button
            type="button"
            onClick={() => onPreviewImage(row.passageImageUrl!, row.title)}
            className="group/img relative inline-block overflow-hidden rounded-md border border-[#dce7f2] shadow-2xs hover:border-[#2563eb]"
            title="Click to view full image"
          >
            <Image
              src={row.passageImageUrl}
              alt={row.title}
              className="h-10 w-14 object-cover transition-transform group-hover/img:scale-105"
              width={56}
              height={40}
              unoptimized
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover/img:opacity-100">
              <Eye className="h-3.5 w-3.5 text-white" />
            </div>
          </button>
        ) : (
          <span className="text-[#a6b8ca]">—</span>
        )}
      </td>

      {/* 6. Status */}
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={() => onToggleStatus(row._id)}
          title="Click to toggle status"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
            row.isActive
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              row.isActive ? "bg-emerald-500" : "bg-slate-400"
            )}
          />
          {row.isActive ? "Active" : "Inactive"}
        </button>
      </td>

      {/* 7. Created Date */}
      <td className="px-4 py-3 font-mono text-[11px] text-[#71889e]">
        {new Date(row.createdAt).toLocaleDateString()}
      </td>

      {/* 8. Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Edit Passage"
            onClick={() => onEdit(row)}
            className="rounded p-1 text-[#6a849d] hover:bg-[#ebf3fb] hover:text-[#1e6fbe] transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title={row.isActive ? "Deactivate" : "Activate"}
            onClick={() => onToggleStatus(row._id)}
            className="rounded p-1 text-[#6a849d] hover:bg-[#ebf3fb] hover:text-[#1e6fbe] transition-colors"
          >
            <Power className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Delete Passage"
            onClick={() => onDelete(row)}
            className="rounded p-1 text-[#b55858] hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
