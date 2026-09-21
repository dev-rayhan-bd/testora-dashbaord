import { linkedQuestionsRows } from "@/lib/test-archive-data";
import { cn } from "@/lib/utils";

function statusClass(status: "Published" | "Draft") {
  return status === "Published"
    ? "border-[#d0ecd9] bg-[#e9f8ef] text-[#3ea666]"
    : "border-[#f0dfb9] bg-[#fff3da] text-[#c48a2e]";
}

export default function QuestionLinkingSection() {
  return (
    <section className="rounded-lg border border-[#dce7f2] bg-white p-4">
      <h3 className="text-sm font-semibold text-[#3f5f7a]">Question Linking Rules</h3>
      <p className="mb-3 text-xs text-[#90a3b6]">
        Link questions from the Question Bank — no content is duplicated here
      </p>

      <div className="rounded-md border border-[#c8ddf2] bg-[#eaf4fd] p-3">
        <ul className="space-y-1 text-xs text-[#4a7eb8]">
          <li>• Questions are selected from the centralized Question Bank</li>
          <li>• One question can be reused across multiple tests</li>
          <li>• Test Archive stores structure and relationship only</li>
        </ul>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-4">
        <input
          className="rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-xs text-[#4f6d87] outline-none"
          placeholder="Category"
        />
        <input
          className="rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-xs text-[#4f6d87] outline-none"
          placeholder="Subject"
        />
        <input
          className="rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-xs text-[#4f6d87] outline-none"
          placeholder="Test Type"
        />
        <input
          className="rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-xs text-[#4f6d87] outline-none"
          placeholder="Status"
        />
      </div>

      <div className="mt-3 overflow-x-auto rounded-md border border-[#dce7f2]">
        <table className="w-full min-w-200 text-left">
          <thead className="bg-[#f3f7fb] text-[11px] font-medium tracking-wide text-[#6f859b] uppercase">
            <tr>
              <th className="px-3 py-2">Use</th>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Question Test Preview</th>
              <th className="px-3 py-2">Subject</th>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Passage</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {linkedQuestionsRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#ecf2f8] text-xs text-[#5e768e] last:border-b-0"
              >
                <td className="px-3 py-2">
                  <input type="checkbox" className="h-3.5 w-3.5 accent-[#2f86d8]" defaultChecked />
                </td>
                <td className="px-3 py-2 font-semibold text-[#2f86d8]">{row.id}</td>
                <td className="px-3 py-2">{row.text}</td>
                <td className="px-3 py-2">{row.subject}</td>
                <td className="px-3 py-2">{row.order}</td>
                <td
                  className={cn(
                    "px-3 py-2",
                    row.passage !== "—" ? "text-[#8468c4]" : "text-[#90a3b6]"
                  )}
                >
                  {row.passage}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px]",
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

      <p className="mt-2 text-xs text-[#90a3b6]">8 questions linked to this test</p>
    </section>
  );
}
