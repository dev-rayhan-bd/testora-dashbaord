import { type PassageItem } from "@/store/apis/question";
import PassageTableRow from "./PassageTableRow";

type Props = {
  rows: PassageItem[];
  isLoading?: boolean;
  onEdit?: (id: string) => void;
};

export default function PassageTable({ rows, isLoading, onEdit }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#dce7f2] bg-white">
      <table className="w-full min-w-175 text-left">
        <thead className="bg-[#f3f7fb] text-[11px] font-medium tracking-wide text-[#6f859b] uppercase">
          <tr>
            <th className="px-3 py-2.5">SL</th>
            <th className="px-3 py-2.5">Code</th>
            <th className="px-3 py-2.5">Title</th>
            <th className="px-3 py-2.5">Content Preview</th>
            <th className="px-3 py-2.5 text-center">Image</th>
            <th className="px-3 py-2.5">Status</th>
            <th className="px-3 py-2.5">Created</th>
            <th className="px-3 py-2.5">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="animate-pulse border-b border-[#ecf2f8]">
                {Array.from({ length: 8 }).map((__, j) => (
                  <td key={j} className="px-3 py-3">
                    <div className="h-3 rounded bg-[#e8f0f8]" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-3 py-8 text-center text-xs text-[#90a3b6]">
                No passages found.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <PassageTableRow key={row._id} rowIndex={index + 1} row={row} onEdit={onEdit} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
