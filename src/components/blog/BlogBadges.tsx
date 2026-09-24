import { cn } from "@/lib/utils";

export const BLOG_CATEGORY = {
  ENTRANCE_EXAM: "Entrance Exams",
  MATURA: "Matura",
  SEMI_MATURA: "Semi Matura",
  PLATFORM_UPDATES: "Platform Updates",
  UNIVERSITY_PREPARATIONS: "University Preparations",
  STUDY_TIPS: "Study Tips",
  QUIZ_TIPS: "Quiz Tips",
};

export const BLOG_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

export function statusBadgeClass(status: string) {
  if (status === BLOG_STATUS.PUBLISHED) return "text-[#3ea666]";
  if (status === BLOG_STATUS.DRAFT) return "text-[#c48a2e]";
  return "text-[#6d839a]";
}

export function statusDotClass(status: string) {
  if (status === BLOG_STATUS.PUBLISHED) return "bg-[#3ea666]";
  if (status === BLOG_STATUS.DRAFT) return "bg-[#c48a2e]";
  return "bg-[#90a3b6]";
}

export function categoryBadgeClass(cat: string) {
  if (cat === BLOG_CATEGORY.ENTRANCE_EXAM) return "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]";
  if (cat === BLOG_CATEGORY.MATURA) return "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]";
  if (cat === BLOG_CATEGORY.STUDY_TIPS) return "border-[#e4ddf4] bg-[#f1edfb] text-[#8468c4]";
  if (cat === BLOG_CATEGORY.PLATFORM_UPDATES) return "border-[#f0dfb9] bg-[#fff3da] text-[#c48a2e]";
  if (cat === BLOG_CATEGORY.SEMI_MATURA) return "border-[#dce4f6] bg-[#edf0fb] text-[#748ccc]";
  if (cat === BLOG_CATEGORY.UNIVERSITY_PREPARATIONS) return "border-[#c8e6d5] bg-[#f0fbf5] text-[#2d7a52]";
  if (cat === BLOG_CATEGORY.QUIZ_TIPS) return "border-[#dce7f2] bg-[#f3f7fb] text-[#6d839a]";
  return "border-[#dce7f2] bg-[#f3f7fb] text-[#6d839a]";
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium capitalize", statusBadgeClass(status))}>
      <span className={cn("h-1.5 w-1.5 rounded-full", statusDotClass(status))} />
      {status}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
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
