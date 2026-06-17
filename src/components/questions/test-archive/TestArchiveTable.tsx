import type { TestArchiveRow } from "@/lib/test-archive-data";
import ArchiveRow from "./ArchiveRow";

type Props = {
  rows: TestArchiveRow[];
  startIndex: number;
  isLoading?: boolean;
};

export default function TestArchiveTable({ rows, startIndex, isLoading }: Props) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#dce7f2] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-275 text-left">
          <thead className="bg-[#f3f7fb] text-[11px] font-medium tracking-wide text-[#6f859b] uppercase">
            <tr>
              <th className="px-4 py-2.5">ID</th>
              <th className="px-4 py-2.5">Title</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5">Year</th>
              <th className="px-4 py-2.5">Subject Category</th>
              <th className="px-4 py-2.5">Type</th>
              <th className="px-4 py-2.5">Access</th>
              <th className="px-4 py-2.5">Questions</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-[#ecf2f8]">
                    {Array.from({ length: 10 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 rounded bg-[#e8f0f8]" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row, index) => (
                  <ArchiveRow key={row.id} row={row} serialNumber={startIndex + index + 1} />
                ))}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={10} className="px-5 py-10 text-center text-sm text-[#90a3b6]">
                  No tests match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
