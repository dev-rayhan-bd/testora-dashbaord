"use client";

import { cn } from "@/lib/utils";
import { useGetQuestionOverviewQuery, type QuestionOverviewData } from "@/store/apis";
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
  Sparkles,
} from "lucide-react";

const flowItems = [
  {
    label: "Study Archive",
    sub: "Learning mode with answers",
    icon: BookOpen,
    iconClass: "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]",
  },
  {
    label: "Official Tests",
    sub: "Real state exam sessions",
    icon: FileCheck2,
    iconClass: "border-[#d6e5f4] bg-[#eaf2fb] text-[#2e7dd1]",
  },
  {
    label: "Additional Tests",
    sub: "Categorized practice tests",
    icon: Layers3,
    iconClass: "border-[#e4ddf4] bg-[#f1edfb] text-[#7d5ec7]",
  },
  {
    label: "Practice by Subject",
    sub: "Targeted subject rotation",
    icon: FlaskConical,
    iconClass: "border-[#f0dfb9] bg-[#fff6e3] text-[#c48a2e]",
  },
  {
    label: "Full Simulation",
    sub: "Exact timed exam experience",
    icon: CircleHelp,
    iconClass: "border-[#c8e7e7] bg-[#e4f5f5] text-[#3ca8a8]",
  },
  {
    label: "Results & Analytics",
    sub: "Performance insights",
    icon: BarChart3,
    iconClass: "border-[#f7d0e5] bg-[#fdeef6] text-[#d65392]",
  },
];

const keyPrinciples = [
  "Questions are created once in the Question Bank and referenced everywhere.",
  "Test Archive inherits final structure (questions linked to tests in exact order).",
  "Passages are modular content blocks linked across multiple questions.",
  "Study Archive provides learning mode with visible answers and explanations.",
  "Full Simulation preserves official order and timings, never randomized.",
];

const summaryCards = [
  {
    title: "Study Archive",
    icon: BookOpen,
    iconClass: "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]",
    badge: "Learning Mode",
    badgeClass: "bg-[#eaf5ef] text-[#2b8a6f]",
    items: [
      "Reads directly from Test Archive",
      "Pulls full questions from Question Bank",
      "Correct answers and explanations visible",
    ],
  },
  {
    title: "Quiz Section",
    icon: CircleHelp,
    iconClass: "border-[#d6e5f4] bg-[#eaf2fb] text-[#2e7dd1]",
    badge: "Interactive Practice",
    badgeClass: "bg-[#eaf2fc] text-[#2e7dd1]",
    items: [
      "Powered by centralized Question Database",
      "Supports multiple quiz formats and filters",
      "Answers revealed after student completion",
    ],
  },
  {
    title: "Full Simulation",
    icon: FlaskConical,
    iconClass: "border-[#e4ddf4] bg-[#f1edfb] text-[#7d5ec7]",
    badge: "Timed Exam",
    badgeClass: "bg-[#f1edfb] text-[#7d5ec7]",
    items: [
      "Matches real official exam conditions",
      "Follows official question order without randomization",
      "Preserves reading passages and subject sections",
    ],
  },
];

const statConfig: Array<{
  label: string;
  key: keyof QuestionOverviewData;
  icon: React.ComponentType<{ className?: string }>;
  iconWrap: string;
  badge: string;
  badgeClass: string;
}> = [
  {
    label: "Total Questions",
    key: "totalQuestions",
    icon: CircleHelp,
    iconWrap: "border-[#d5e2f7] bg-[#edf4fe] text-[#2563eb]",
    badge: "All Questions",
    badgeClass: "bg-[#edf4fe] text-[#2563eb]",
  },
  {
    label: "Published Tests",
    key: "publishedTests",
    icon: FileCheck2,
    iconWrap: "border-[#c8ebd4] bg-[#edf8f2] text-[#16a34a]",
    badge: "Live Tests",
    badgeClass: "bg-[#edf8f2] text-[#16a34a]",
  },
  {
    label: "Total Passages",
    key: "totalPassages",
    icon: BookMarked,
    iconWrap: "border-[#e2d6f8] bg-[#f5effe] text-[#9333ea]",
    badge: "Passages",
    badgeClass: "bg-[#f5effe] text-[#9333ea]",
  },
  {
    label: "Active Students",
    key: "activeStudents",
    icon: GraduationCap,
    iconWrap: "border-[#fedac2] bg-[#fff3ec] text-[#ea580c]",
    badge: "Learners",
    badgeClass: "bg-[#fff3ec] text-[#ea580c]",
  },
  {
    label: "Quiz Sessions",
    key: "totalQuizSessions",
    icon: BarChart3,
    iconWrap: "border-[#fcccd8] bg-[#fef0f4] text-[#e11d48]",
    badge: "Sessions",
    badgeClass: "bg-[#fef0f4] text-[#e11d48]",
  },
];

function StatsCards({ stats, isLoading }: { stats: QuestionOverviewData; isLoading: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {statConfig.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key] ?? 0;

        return (
          <div
            key={item.label}
            className="group relative flex flex-col justify-between rounded-xl border border-[#dce7f2] bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b8d4ee] hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105",
                    item.iconWrap
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  {isLoading ? (
                    <div className="h-7 w-16 animate-pulse rounded bg-slate-200" />
                  ) : (
                    <p className="text-2xl font-bold tracking-tight text-[#2f4256]">
                      {value.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs font-medium text-[#7e95ab]">{item.label}</p>
                </div>
              </div>

              <span
                className={cn(
                  "inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                  item.badgeClass
                )}
              >
                {item.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ArchitectureFlowSection() {
  return (
    <section className="rounded-xl border border-[#dce7f2] bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#2f4256]">Centralized Architecture Flow</h3>
          <p className="mt-0.5 text-xs text-[#7e95ab]">
            Questions are authored once in the Question Bank and utilized across all test experiences.
          </p>
        </div>
        <span className="hidden items-center gap-1 rounded-full border border-[#d0ecd9] bg-[#eaf7f0] px-2.5 py-0.5 text-[11px] font-semibold text-[#258d4e] sm:inline-flex">
          <Sparkles className="h-3 w-3" />
          Zero Data Duplication
        </span>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-3 rounded-xl border border-[#2f86d8] bg-[#2f86d8] px-7 py-3.5 shadow-sm">
          <CircleHelp className="h-5 w-5 text-white/90" />
          <div className="text-center">
            <p className="text-sm font-bold text-white">Question Database</p>
            <p className="text-[11px] font-medium text-blue-100">Single Source of Truth</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center py-2 text-[#9bb7d4]">
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {flowItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-[#ecf2f8] bg-[#fcfdfe] p-3 text-center transition-colors hover:border-[#d7e5f3] hover:bg-white"
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl border",
                  item.iconClass
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#405c75]">{item.label}</p>
                <p className="mt-0.5 text-[10px] text-[#8ea1b5]">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-[#c8ddf2] bg-[#edf6fd] p-4">
        <div className="mb-2 flex items-center gap-1.5">
          <Info className="h-4 w-4 text-[#3079bf]" />
          <p className="text-xs font-bold text-[#27649d]">Core Architecture Principles</p>
        </div>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {keyPrinciples.map((p) => (
            <li key={p} className="flex items-start gap-1.5 text-xs text-[#3b6f9f]">
              <span className="mt-0.5 shrink-0 text-[#3079bf] font-bold">›</span>
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
          <div
            key={card.title}
            className="flex flex-col justify-between rounded-xl border border-[#dce7f2] bg-white p-4.5 shadow-xs transition-colors hover:border-[#cbdff2]"
          >
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg border",
                      card.iconClass
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#2f4256]">{card.title}</h4>
                </div>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-semibold",
                    card.badgeClass
                  )}
                >
                  {card.badge}
                </span>
              </div>
              <ul className="space-y-2">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-[#6e859b]">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9bb4cb]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function QuestionSystemOverviewPage() {
  const { data, isLoading } = useGetQuestionOverviewQuery();
  const stats = data?.data ?? {
    totalQuestions: 0,
    publishedTests: 0,
    totalPassages: 0,
    activeStudents: 0,
    totalQuizSessions: 0,
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#2f4256]">Question &amp; Test System Overview</h2>
        <p className="text-xs text-[#7e95ab]">
          Centralized architecture — one unified question repository, utilized everywhere
        </p>
      </div>

      <StatsCards stats={stats} isLoading={isLoading} />
      <ArchitectureFlowSection />
      <SummaryFeatureCards />
    </div>
  );
}
