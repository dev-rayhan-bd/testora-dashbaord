"use client";

import type { PassageItem } from "@/store/apis";
import PassageTableRow from "./PassageTableRow";

type Props = {
  rows: PassageItem[];
  startIndex: number;
  isLoading?: boolean;
  onEdit: (passage: PassageItem) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (passage: PassageItem) => void;
  onPreviewImage: (url: string, title: string) => void;
};

export default function PassageTable({
  rows,
  startIndex,
  isLoading,
  onEdit,
  onToggleStatus,
  onDelete,
  onPreviewImage,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#dce7f2] bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-[#e5eff8] bg-[#f5f9fd] text-[11px] font-semibold tracking-wider text-[#637d96] uppercase">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Content Preview</th>
              <th className="px-4 py-3 text-center">Image</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ecf2f8]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="px-4 py-3.5">
                      <div className="h-3.5 rounded bg-[#e8f0f8]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-sm text-[#8fa3b7]">
                  No passages found matching your search.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <PassageTableRow
                  key={row._id}
                  rowIndex={startIndex + index + 1}
                  row={row}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                  onPreviewImage={onPreviewImage}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
