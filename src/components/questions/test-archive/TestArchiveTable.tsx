"use client";

import type { TestArchiveItem } from "@/store/apis";
import ArchiveRow from "./ArchiveRow";

type Props = {
  rows: TestArchiveItem[];
  startIndex: number;
  isLoading?: boolean;
  onView: (row: TestArchiveItem) => void;
  onEdit: (row: TestArchiveItem) => void;
  onDuplicate: (row: TestArchiveItem) => void;
  onDelete: (row: TestArchiveItem) => void;
};

export default function TestArchiveTable({
  rows,
  startIndex,
  isLoading,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#dce7f2] bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left">
          <thead className="border-b border-[#e5eff8] bg-[#f5f9fd] text-[11px] font-semibold tracking-wider text-[#637d96] uppercase">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Test Title &amp; Code</th>
              <th className="px-4 py-3">Exam Type</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Subject / Faculty</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Access</th>
              <th className="px-4 py-3">Questions</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ecf2f8]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 10 }).map((__, j) => (
                    <td key={j} className="px-4 py-3.5">
                      <div className="h-3.5 rounded bg-[#e8f0f8]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length > 0 ? (
              rows.map((row, index) => (
                <ArchiveRow
                  key={row._id}
                  row={row}
                  serialNumber={startIndex + index + 1}
                  onView={onView}
                  onEdit={onEdit}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-5 py-12 text-center text-sm text-[#8fa3b7]">
                  No tests found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
