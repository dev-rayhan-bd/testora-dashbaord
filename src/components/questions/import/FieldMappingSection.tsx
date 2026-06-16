import { fieldMappingRows, type FieldMappingStatus } from "@/lib/import-data";
import { cn } from "@/lib/utils";

function statusClass(s: FieldMappingStatus) {
  if (s === "Mapped") return "border-[#d0ecd9] bg-[#e9f8ef] text-[#3ea666]";
  if (s === "Optional") return "border-[#f0dfb9] bg-[#fff3da] text-[#c48a2e]";
  return "border-[#f4d7d7] bg-[#fdeeee] text-[#db6f6f]";
}

export default function FieldMappingSection() {
  return (
    <section className="rounded-lg border border-[#dce7f2] bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-[#3f5f7a]">Field Mapping Preview</h3>
      </div>
      <p className="mb-3 text-xs text-[#90a3b6]">
        Each system field is auto-mapped to a column in your file. Review and confirm before
        importing.
      </p>

      <div className="overflow-x-auto rounded-md border border-[#dce7f2]">
        <table className="w-full min-w-160 text-left">
          <thead className="bg-[#f3f7fb] text-[11px] font-medium tracking-wide text-[#6f859b] uppercase">
            <tr>
              <th className="px-3 py-2.5">System Field</th>
              <th className="px-3 py-2.5">Description</th>
              <th className="px-3 py-2.5">Excel Column</th>
              <th className="px-3 py-2.5">File Column</th>
              <th className="px-3 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {fieldMappingRows.map((row) => (
              <tr
                key={row.systemField}
                className="border-b border-[#ecf2f8] text-xs last:border-b-0 hover:bg-[#f8fbff]"
              >
                <td className="px-3 py-2 font-mono font-semibold text-[#3f5f7a]">
                  {row.systemField}
                  {row.required && <span className="ml-1 text-[#db6f6f]">*</span>}
                </td>
                <td className="px-3 py-2 text-[#7e95ab]">{row.description}</td>
                <td className="px-3 py-2 text-[#587189]">{row.excelColumn}</td>
                <td className="px-3 py-2 text-[#587189]">{row.fileColumn}</td>
                <td className="px-3 py-2">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                      statusClass(row.status)
                    )}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-[10px] text-[#90a3b6]">
        <span className="text-[#db6f6f]">*</span> Required fields
      </p>
    </section>
  );
}
