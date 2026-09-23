import { Edit2, Layers, Trash2 } from "lucide-react";
import type { FacultyItem } from "@/store/apis";

interface Props {
  faculties: FacultyItem[];
  isLoading: boolean;
  onEdit: (faculty: FacultyItem) => void;
  onDelete: (faculty: FacultyItem) => void;
}

export default function FacultiesTable({
  faculties,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#dce7f2] bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead className="border-b border-[#e5eff8] bg-[#f5f9fd] text-[11px] font-semibold tracking-wider text-[#637d96] uppercase">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Faculty Name</th>
              <th className="px-4 py-3">Created Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#ecf2f8]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3.5"><div className="h-3.5 w-6 rounded bg-[#e8f0f8]" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-48 rounded bg-[#e8f0f8]" /></td>
                  <td className="px-4 py-3.5"><div className="h-3.5 w-24 rounded bg-[#e8f0f8]" /></td>
                  <td className="px-4 py-3.5 text-right"><div className="ml-auto h-6 w-16 rounded bg-[#e8f0f8]" /></td>
                </tr>
              ))
            ) : faculties.length > 0 ? (
              faculties.map((f, i) => (
                <tr
                  key={f._id}
                  className="group border-b border-[#e9eff6] text-xs text-[#526a82] transition-colors hover:bg-[#f6faff]"
                >
                  <td className="px-4 py-3 font-semibold text-[#1e6fbe]">
                    {i + 1}
                  </td>
                  <td className="max-w-[280px] px-4 py-3">
                    <div className="font-semibold text-[#29425a]">{f.name}</div>
                    {(f.nameInEnglish || f.nameInAlbanian) && (
                      <div className="mt-0.5 text-[10px] text-[#7893af]">
                        {f.nameInEnglish && <span className="mr-2">EN: {f.nameInEnglish}</span>}
                        {f.nameInAlbanian && <span>AL: {f.nameInAlbanian}</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#6f859a]">
                    {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => onEdit(f)}
                        title="Edit Faculty"
                        className="rounded-md p-1.5 text-[#587189] hover:bg-[#edf4fb] hover:text-[#2563eb]"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(f)}
                        title="Delete Faculty"
                        className="rounded-md p-1.5 text-[#587189] hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center">
                  <div className="mx-auto flex flex-col items-center justify-center text-[#8fa3b7]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4f9]">
                      <Layers className="h-5 w-5 text-[#a8bacc]" />
                    </div>
                    <p className="mt-3 font-medium text-[#5c7792]">No faculties found</p>
                    <p className="mt-1 max-w-[250px] text-xs">
                      Adjust your search or add a new faculty to get started.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
