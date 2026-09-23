"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutGrid, BookOpen, Archive, BookMarked, Layers, Upload, Eye } from "lucide-react";

const tabs = [
  { href: "/questions", label: "Overview", icon: LayoutGrid },
  { href: "/questions/question-bank", label: "Question Bank", icon: BookOpen },
  { href: "/questions/test-archive", label: "Test Archive", icon: Archive },
  { href: "/questions/passages", label: "Passages", icon: BookMarked },
  { href: "/questions/subjects", label: "Subjects", icon: Layers },
  { href: "/questions/faculties", label: "Faculties", icon: Layers },
  { href: "/questions/departments", label: "Departments", icon: Layers },
  // { href: "/questions/import", label: "Import", icon: Upload },
  // { href: "/questions/preview-validation", label: "Preview & Validation", icon: Eye },
];

export default function QuestionsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-xl font-semibold text-[#3f5f7a]">Question &amp; Test System</h1>
      </div>

      {/* Tab bar */}
      <div className="rounded-lg border border-[#dce7f2] bg-white px-2.5 py-2">
        <div className="flex flex-wrap items-center gap-1">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/questions"
                ? pathname === "/questions"
                : pathname === tab.href || pathname.startsWith(tab.href + "/");

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-[#edf4fb] text-[#2f86d8]"
                    : "text-[#587189] hover:bg-[#f3f7fb] hover:text-[#3f5f7a]"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
}

