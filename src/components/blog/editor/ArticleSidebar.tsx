import { BLOG_CATEGORY, BLOG_STATUS } from "../BlogBadges";
import { cn } from "@/lib/utils";
import { Clock, Eye, FileEdit, Globe, X } from "lucide-react";

type SidebarState = {
  status: string;
  category: string;
  author: string;
  publishDate: string;
};

type Props = {
  data: SidebarState;
  onChange: (field: keyof SidebarState, value: string) => void;
  wordCount: number;
  onPublish: () => void;
};

const STATUS_OPTIONS = [
  { value: BLOG_STATUS.DRAFT,     label: "Draft",     visibility: "Private", dotColor: "bg-[#c48a2e]" },
  { value: BLOG_STATUS.PUBLISHED, label: "Published", visibility: "Visible", dotColor: "bg-[#3ea666]" },
];

const inputClass =
  "w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3] focus:border-[#2f86d8]";

const readingMinutes = (words: number) => Math.max(1, Math.ceil(words / 200));

export default function ArticleSidebar({ data, onChange, wordCount, onPublish }: Props) {
  const mins = readingMinutes(wordCount);

  return (
    <div className="space-y-3">
      {/* Status */}
      <div className="rounded-lg border border-[#dce7f2] bg-white p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#90a3b6]">
          Status
        </p>
        <div className="space-y-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                data.status === opt.value
                  ? "border-[#b4cfe8] bg-[#edf4fb]"
                  : "border-transparent bg-white hover:bg-[#f8fbff]"
              )}
            >
              <input
                type="radio"
                name="article-status"
                value={opt.value}
                checked={data.status === opt.value}
                onChange={() => onChange("status", opt.value)}
                className="hidden"
              />
              <span className={cn("h-2 w-2 shrink-0 rounded-full", opt.dotColor)} />
              <span className="flex-1 text-sm font-medium text-[#3f5f7a]">{opt.label}</span>
              {opt.visibility && (
                <span className="text-xs text-[#90a3b6]">{opt.visibility}</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="rounded-lg border border-[#dce7f2] bg-white p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#90a3b6]">
          Category <span className="text-[#db6f6f]">*</span>
        </p>
        <select
          value={data.category}
          onChange={(e) => onChange("category", e.target.value)}
          className={inputClass}
        >
          <option value="">Select category</option>
          {Object.values(BLOG_CATEGORY).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Author */}
      <div className="rounded-lg border border-[#dce7f2] bg-white p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#90a3b6]">
          Author
        </p>
        <input
          value={data.author}
          onChange={(e) => onChange("author", e.target.value)}
          placeholder="Testora Team"
          className={inputClass}
        />
      </div>

      {/* Details */}
      <div className="rounded-lg border border-[#dce7f2] bg-[#f8fbff] p-4 text-xs text-[#587189]">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Read Time</span>
          <span className="font-medium text-[#3f5f7a]">{mins} min read</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5"><FileEdit className="h-3.5 w-3.5" /> Word Count</span>
          <span className="font-medium text-[#3f5f7a]">{wordCount} words</span>
        </div>
      </div>
    </div>
  );
}
