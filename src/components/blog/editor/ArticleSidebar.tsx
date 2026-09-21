import { BLOG_CATEGORIES, type ArticleStatus } from "@/lib/blog-data";
import { cn } from "@/lib/utils";
import { Clock, Eye, FileEdit, Globe, X } from "lucide-react";
import Link from "next/link";

type SidebarState = {
  status: ArticleStatus;
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

const STATUS_OPTIONS: { value: ArticleStatus; label: string; visibility: string; dotColor: string }[] = [
  { value: "Draft",     label: "Draft",     visibility: "Private", dotColor: "bg-[#c48a2e]" },
  { value: "Published", label: "Published", visibility: "Visible", dotColor: "bg-[#3ea666]" },
  { value: "Hidden",    label: "Hidden",    visibility: "",        dotColor: "bg-[#d97a2a]" },
  { value: "Archived",  label: "Archived",  visibility: "",        dotColor: "bg-[#90a3b6]" },
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
          {BLOG_CATEGORIES.map((c) => (
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

      {/* Publish Date */}
      <div className="rounded-lg border border-[#dce7f2] bg-white p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#90a3b6]">
          Publish Date
        </p>
        <input
          type="date"
          value={data.publishDate}
          onChange={(e) => onChange("publishDate", e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Reading time */}
      <div className="rounded-lg border border-[#dce7f2] bg-white p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#90a3b6]">
          Reading Time
        </p>
        <div className="flex items-center gap-1.5 text-xs text-[#3f5f7a]">
          <Clock className="h-3.5 w-3.5 text-[#4a93d9]" />
          <span className="font-medium">{mins} min read</span>
          <span className="text-[#90a3b6]">· {wordCount} w({wordCount})</span>
        </div>
        <p className="mt-1 text-[10px] text-[#90a3b6]">Auto-calculated from content</p>
      </div>

      {/* Action buttons */}
      <div className="rounded-lg border border-[#dce7f2] bg-white p-4 space-y-2">
        <button
          type="button"
          onClick={onPublish}
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-[#2f86d8] py-2 text-sm font-semibold text-white hover:bg-[#2a78c6]"
        >
          <Globe className="h-3.5 w-3.5" />
          Publish Article
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[#dce7f2] py-2 text-sm text-[#587189] hover:bg-[#f3f7fb]"
        >
          <FileEdit className="h-3.5 w-3.5" />
          Save as Draft
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[#dce7f2] py-2 text-sm text-[#587189] hover:bg-[#f3f7fb]"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </button>
        <Link
          href="/blog"
          className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[#dce7f2] py-2 text-sm text-[#587189] hover:bg-[#f3f7fb]"
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </Link>
      </div>
    </div>
  );
}
