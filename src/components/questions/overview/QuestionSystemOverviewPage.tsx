"use client";

import { cn } from "@/lib/utils";
import { useGetQuestionOverviewQuery } from "@/store/apis";
import {
  BarChart3,
  BookMarked,
  BookOpen,
  ChevronDown,
  CircleHelp,
  FileCheck2,
  FlaskConical,
  GraduationCap,
  Info,
  Layers3,
} from "lucide-react";

const flowItems = [
  {
    label: "Study Archive",
    sub: "Absorbs above",
    icon: BookOpen,
    iconClass: "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]",
  },
  {
    label: "Official Tests",
    sub: "Real system",
    icon: FileCheck2,
    iconClass: "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]",
  },
  {
    label: "Additional Tests",
    sub: "Categorize",
    icon: Layers3,
    iconClass: "border-[#e4ddf4] bg-[#f1edfb] text-[#8468c4]",
  },
  {
    label: "Practice by Subject",
    sub: "Rotate questions",
    icon: FlaskConical,
    iconClass: "border-[#f0dfb9] bg-[#fff6e3] text-[#c48a2e]",
  },
  {
    label: "Full Simulation",
    sub: "Simulates",
    icon: CircleHelp,
    iconClass: "border-[#c8e7e7] bg-[#e4f5f5] text-[#4ab3b3]",
  },
  {
    label: "Results & Analytics",
    sub: "Data reports",
    icon: BarChart3,
    iconClass: "border-[#f7d0e5] bg-[#fdeef6] text-[#d9619a]",
  },
];

const keyPrinciples = [
  "Questions are created once in the Question Bank.",
  "Test Archive inherits final structure (with questions linked to tests).",
  "Passages are separate content blocks (linked to multiple questions).",
  "Study Archive — test with visible answers (learning mode).",
  "Full Simulation follows real official order, never randomized.",
];

const summaryCards = [
  {
    title: "Study Archive",
    icon: BookOpen,
    iconClass: "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]",
    items: [
      "Reads from Test Archive",
      "Reads questions from Question Bank",
      "Correct answers are always visible",
    ],
  },
  {
    title: "Quiz Section",
    icon: CircleHelp,
    iconClass: "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]",
    items: [
      "Uses centralized Question Database",
      "Supports multiple quiz formats",
      "Answers hidden until authorization",
    ],
  },
  {
    title: "Full Simulation",
    icon: FlaskConical,
    iconClass: "border-[#e4ddf4] bg-[#f1edfb] text-[#8468c4]",
    items: [
      "Uses Official Test structure",
      "Follows real order (non-random)",
      "Respects passages and subjects",
    ],
  },
];

const statConfig = [
  {
    label: "Total Questions",
    key: "totalQuestions",
    icon: CircleHelp,
    iconClass: "border-[#d7e6f4] bg-[#eff5fc] text-[#2f86d8]",
  },
  {
    label: "Published Tests",
    key: "publishedTests",
    icon: FileCheck2,
    iconClass: "border-[#d4ecde] bg-[#eaf7f0] text-[#3ea666]",
  },
  {
    label: "Passages",
    key: "totalPassages",
    icon: BookMarked,
    iconClass: "border-[#e4ddf4] bg-[#f1edfb] text-[#8468c4]",
  },
  {
    label: "Active Students",
    key: "activeStudents",
    icon: GraduationCap,
    iconClass: "border-[#f0dfb9] bg-[#fff6e3] text-[#c48a2e]",
  },
  {
    label: "Quiz Sessions",
    key: "totalQuizSessions",
    icon: BarChart3,
    iconClass: "border-[#f3dddd] bg-[#feefef] text-[#db6f6f]",
  },
];

function StatsCards({ stats }: { stats: Record<string, number> }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {statConfig.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="rounded-lg border border-[#dce7f2] bg-white p-3.5">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
                  item.iconClass
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[22px] leading-6 font-semibold text-[#3f5f7a]">
                  {(stats[item.key] ?? 0).toLocaleString()}
                </p>
                <p className="text-[11px] text-[#90a3b6]">{item.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ArchitectureFlowSection() {
  return (
    <section className="rounded-lg border border-[#dce7f2] bg-white p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-[#3f5f7a]">Centralized Architecture Flow</h3>
      <p className="mt-0.5 text-xs text-[#90a3b6]">
        Questions are created once and reused across all platform features. No data duplication.
      </p>
      <div className="mt-5 flex justify-center">
        <div className="flex items-center gap-2.5 rounded-lg border border-[#2f86d8] bg-[#2f86d8] px-6 py-3">
          <CircleHelp className="h-4 w-4 text-white/80" />
          <div className="text-center">
            <p className="text-sm font-semibold text-white">Question Database</p>
            <p className="text-[11px] text-blue-100">Single Source of Truth</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center py-2 text-[#b0c8e0]">
        <ChevronDown className="h-4 w-4" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {flowItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex flex-col items-center gap-1.5 text-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg border",
                  item.iconClass
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-medium text-[#4f6d87]">{item.label}</p>
              <p className="text-[10px] text-[#90a3b6]">{item.sub}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 rounded-md border border-[#c8ddf2] bg-[#eaf4fd] px-4 py-3">
        <div className="mb-2 flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-[#4a8fc7]" />
          <p className="text-xs font-semibold text-[#3a6e9e]">Key Principles</p>
        </div>
        <ul className="space-y-1">
          {keyPrinciples.map((p) => (
            <li key={p} className="flex items-start gap-1.5 text-xs text-[#4a7eb8]">
              <span className="mt-0.5 shrink-0 text-[#4a8fc7]">›</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SummaryFeatureCards() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="rounded-lg border border-[#dce7f2] bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md border",
                  card.iconClass
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <h4 className="text-sm font-semibold text-[#3f5f7a]">{card.title}</h4>
            </div>
            <ul className="space-y-1.5">
              {card.items.map((item) => (
                <li key={item} className="flex items-start gap-1.5 text-xs text-[#7e95ab]">
                  <span className="mt-0.5 shrink-0 text-[#9ab0c3]">›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default function QuestionSystemOverviewPage() {
  const { data, isLoading, isError } = useGetQuestionOverviewQuery();
  const stats = data?.data ?? {
    totalQuestions: 0,
    publishedTests: 0,
    totalPassages: 0,
    activeStudents: 0,
    totalQuizSessions: 0,
  };

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-[#3f5f7a]">
          Question &amp; Test System Overview
        </h2>
        <p className="text-sm text-[#7e95ab]">
          Centralized architecture — one question source, used everywhere
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-[70.5px] animate-pulse rounded-lg border border-[#dce7f2] bg-white"
            />
          ))}
        </div>
      ) : isError ? null : (
        <StatsCards stats={stats} />
      )}

      <ArchitectureFlowSection />
      <SummaryFeatureCards />
    </div>
  );
}
