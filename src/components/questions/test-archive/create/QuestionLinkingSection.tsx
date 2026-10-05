import { cn } from "@/lib/utils";
import { useGetQuestionsQuery } from "@/store/apis";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

function statusClass(status: string) {
  return status.toLowerCase() === "published"
    ? "border-[#d0ecd9] bg-[#e9f8ef] text-[#3ea666]"
    : "border-[#f0dfb9] bg-[#fff3da] text-[#c48a2e]";
}

interface Props {
  selectedQuestionIds?: string[];
  onChange?: (ids: string[]) => void;
}

export default function QuestionLinkingSection({
  selectedQuestionIds = [],
  onChange,
}: Props) {
  const [examType, setExamType] = useState("");
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [accumulatedQuestions, setAccumulatedQuestions] = useState<any[]>([]);

  useEffect(() => {
    setPage(1);
    setAccumulatedQuestions([]);
  }, [examType, status, searchTerm]);

  const { data, isLoading, isFetching } = useGetQuestionsQuery({
    limit: 20,
    page,
    examType: examType || undefined,
    status: status || undefined,
    searchTerm: searchTerm || undefined,
  });

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAccumulatedQuestions(data.data);
      } else {
        setAccumulatedQuestions((prev) => {
          const existingIds = new Set(prev.map((q) => q._id));
          const newQuestions = data.data.filter((q: any) => !existingIds.has(q._id));
          return [...prev, ...newQuestions];
        });
      }
    }
  }, [data?.data, page]);

  const hasMore = (data?.meta?.total || 0) > accumulatedQuestions.length;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetching) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((p) => p + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetching, hasMore]
  );

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (!onChange) return;
    if (checked) {
      onChange([...selectedQuestionIds, id]);
    } else {
      onChange(selectedQuestionIds.filter((qid) => qid !== id));
    }
  };

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

      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-xs text-[#4f6d87] outline-none"
        >
          <option value="">All Categories</option>
          <option value="matura">Matura</option>
          <option value="semi_matura">Semimatura</option>
          <option value="provime">Provime</option>
        </select>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-xs text-[#4f6d87] outline-none"
          placeholder="Search question text..."
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-xs text-[#4f6d87] outline-none"
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="mt-3 overflow-x-auto rounded-md border border-[#dce7f2]">
        <table className="w-full min-w-200 text-left">
          <thead className="bg-[#f3f7fb] text-[11px] font-medium tracking-wide text-[#6f859b] uppercase">
            <tr>
              <th className="px-3 py-2">Use</th>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Question Test Preview</th>
              <th className="px-3 py-2 text-center">Mandatory</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Subject / Faculty</th>
              <th className="px-3 py-2">Passage</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && page === 1 ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-xs text-[#90a3b6]">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#2f86d8]" />
                </td>
              </tr>
            ) : accumulatedQuestions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-xs text-[#90a3b6]">
                  No questions found matching your criteria.
                </td>
              </tr>
            ) : (
              accumulatedQuestions.map((row: any, index: number) => {
                const isSelected = selectedQuestionIds.includes(row._id);
                const isLastElement = index === accumulatedQuestions.length - 1;
                return (
                  <tr
                    key={row._id}
                    ref={isLastElement ? loadMoreRef : null}
                    className="border-b border-[#ecf2f8] text-xs text-[#5e768e] last:border-b-0 hover:bg-[#f8fbff]"
                  >
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleCheckboxChange(row._id, e.target.checked)}
                        className="h-3.5 w-3.5 accent-[#2f86d8]"
                      />
                    </td>
                    <td className="px-3 py-2 font-semibold text-[#2f86d8]">{row._id.slice(-6).toUpperCase()}</td>
                    <td className="px-3 py-2 max-w-64" title={row.questionText}>
                      <p className="line-clamp-2 font-medium text-[#2d4256] leading-snug">
                        {row.questionText}
                      </p>
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      {row.isMandatory ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-[#cbe1f5] bg-[#edf5fc] px-2 py-0.5 text-[10px] font-bold text-[#2563eb]">
                          Yes
                        </span>
                      ) : (
                        <span className="text-[#a4b5c6] font-medium text-xs">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 capitalize">{row.examType?.replace("_", " ")}</td>
                    <td className="px-3 py-2">
                      {row.subject?.nameInEnglish || row.subject?.name || row.subjectName || row.faculty?.nameInEnglish || row.faculty?.name || row.facultyName || "—"}
                    </td>
                    <td
                      className={cn(
                        "px-3 py-2",
                        row.passageCode ? "text-[#8468c4]" : "text-[#90a3b6]"
                      )}
                    >
                      {row.passageCode || "—"}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] capitalize",
                          statusClass(row.status)
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
            {isFetching && page > 1 && (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-center text-xs text-[#90a3b6]">
                  <Loader2 className="mx-auto h-4 w-4 animate-spin text-[#2f86d8]" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-[#90a3b6]">
        {selectedQuestionIds.length} questions linked to this test
      </p>
    </section>
  );
}
