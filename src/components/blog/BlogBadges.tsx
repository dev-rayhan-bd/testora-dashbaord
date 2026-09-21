import { type ArticleCategory, type ArticleStatus } from "@/lib/blog-data";
import { cn } from "@/lib/utils";

export function statusBadgeClass(status: ArticleStatus) {
  if (status === "Published") return "text-[#3ea666]";
  if (status === "Draft")     return "text-[#c48a2e]";
  if (status === "Hidden")    return "text-[#d97a2a]";
  return "text-[#6d839a]";
}

export function statusDotClass(status: ArticleStatus) {
  if (status === "Published") return "bg-[#3ea666]";
  if (status === "Draft")     return "bg-[#c48a2e]";
  if (status === "Hidden")    return "bg-[#d97a2a]";
  return "bg-[#90a3b6]";
}

export function categoryBadgeClass(cat: ArticleCategory) {
  if (cat === "Entrance Exams")        return "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]";
  if (cat === "Matura")                return "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]";
  if (cat === "Study Tips")            return "border-[#e4ddf4] bg-[#f1edfb] text-[#8468c4]";
  if (cat === "Platform Updates")      return "border-[#f0dfb9] bg-[#fff3da] text-[#c48a2e]";
  if (cat === "Semimatura")            return "border-[#dce4f6] bg-[#edf0fb] text-[#748ccc]";
  if (cat === "University Preparation") return "border-[#c8e6d5] bg-[#f0fbf5] text-[#2d7a52]";
  return "border-[#dce7f2] bg-[#f3f7fb] text-[#6d839a]";
}

export function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", statusBadgeClass(status))}>
      <span className={cn("h-1.5 w-1.5 rounded-full", statusDotClass(status))} />
      {status}
    </span>
  );
}

export function CategoryBadge({ category }: { category: ArticleCategory }) {
  return (
    <span
      className={cn(
        "rounded-md border px-2 py-0.5 text-[11px] font-medium",
        categoryBadgeClass(category)
      )}
    >
      {category}
    </span>
  );
}
