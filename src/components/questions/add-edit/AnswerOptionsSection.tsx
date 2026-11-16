"use client";

import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import MathRenderer from "@/components/common/MathRenderer";

export type AnswerOption = {
  text: string;
};

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

// ─── Single answer row ────────────────────────────────────────────────────────

type AnswerOptionRowProps = {
  letter: (typeof OPTION_LABELS)[number];
  value: string;
  isCorrect: boolean;
  onSelect: () => void;
  onChange: (value: string) => void;
};

export function AnswerOptionRow({
  letter,
  value,
  isCorrect,
  onSelect,
  onChange,
}: AnswerOptionRowProps) {
  return (
    <div
      className={cn(
        "rounded-md border p-3 transition-colors",
        isCorrect
          ? "border-[#b9e3ca] bg-[#f0fbf4]"
          : "border-[#dce7f2] bg-white hover:border-[#c5d9ee]"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Letter badge — click to mark as correct */}
        <button
          type="button"
          onClick={onSelect}
          title={`Mark option ${letter} as correct`}
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
            isCorrect
              ? "bg-[#3ea666] text-white"
              : "border border-[#dce7f2] bg-[#f3f7fb] text-[#5e768e] hover:border-[#3ea666] hover:text-[#3ea666]"
          )}
        >
          {letter}
        </button>

        <div className="flex-1">
          {/* Text input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Option ${letter} text (e.g. $\\frac{7}{12}$)...`}
              className="w-full rounded-md border border-transparent bg-transparent py-0.5 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3] focus:border-[#dce7f2] focus:bg-[#f8fbff] focus:px-2"
            />
            {value && (/[\\$^_{}]/.test(value) || value.includes("/")) && (
              <span
                className="max-w-[140px] truncate rounded bg-white px-2 py-0.5 text-xs text-[#1e3a5f] border border-[#dce7f2] shadow-2xs"
                title="Formula Preview"
              >
                <MathRenderer text={value} inline />
              </span>
            )}
          </div>

          {/* Add image */}
          <button
            type="button"
            className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-[#90a3b6] hover:text-[#2f86d8]"
          >
            <ImageIcon className="h-3 w-3" />
            Add image
          </button>
        </div>

        {/* Correct badge */}
        {isCorrect && (
          <span className="shrink-0 self-start rounded-sm border border-[#b9e3ca] bg-[#e9f8ef] px-1.5 py-0.5 text-[10px] font-semibold text-[#3ea666]">
            CORRECT
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

type AnswerOptionsSectionProps = {
  options: [string, string, string, string];
  correctOption: number;
  onOptionChange: (index: number, value: string) => void;
  onCorrectChange: (index: number) => void;
};

export default function AnswerOptionsSection({
  options,
  correctOption,
  onOptionChange,
  onCorrectChange,
}: AnswerOptionsSectionProps) {
  return (
    <section className="rounded-lg border border-[#dce7f2] bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold text-[#3f5f7a]">Answer Options</h3>

      <div className="space-y-2.5">
        {OPTION_LABELS.map((letter, index) => (
          <AnswerOptionRow
            key={letter}
            letter={letter}
            value={options[index]}
            isCorrect={correctOption === index}
            onSelect={() => onCorrectChange(index)}
            onChange={(val) => onOptionChange(index, val)}
          />
        ))}
      </div>

      <p className="mt-3 text-[11px] text-[#90a3b6]">
        Click a letter to mark it as the correct answer. Only one answer can be correct.
      </p>
    </section>
  );
}
