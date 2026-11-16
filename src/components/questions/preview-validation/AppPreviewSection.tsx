import { previewQuestion } from "@/lib/preview-validation-data";
import { cn } from "@/lib/utils";
import { Smartphone } from "lucide-react";
import MathRenderer from "@/components/common/MathRenderer";

export default function AppPreviewSection() {
  const q = previewQuestion;

  return (
    <section className="rounded-lg border border-[#dce7f2] bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Smartphone className="h-4 w-4 text-[#4a93d9]" />
        <div>
          <h3 className="text-sm font-semibold text-[#3f5f7a]">App Preview</h3>
          <p className="text-xs text-[#90a3b6]">See how this question appears on the student app</p>
        </div>
      </div>

      <div className="flex justify-center py-2">
        <div className="w-64 overflow-hidden rounded-3xl border-2 border-[#1e1e2e] bg-[#1a1a2e]">
          {/* Status bar */}
          <div className="flex items-center justify-between bg-[#1a1a2e] px-4 py-1.5">
            <span className="text-[9px] text-white">09:41</span>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-3 rounded-sm bg-white/60" />
              <div className="h-1.5 w-1.5 rounded-sm bg-white/60" />
              <div className="h-1.5 w-1.5 rounded-full bg-white/80" />
            </div>
          </div>

          <div className="bg-white px-3 pb-3">
            {/* App header */}
            <div className="flex items-center justify-between border-b border-[#e8eef4] py-2">
              <span className="text-[9px] font-semibold text-[#3f5f7a]">{q.category}</span>
              <span className="rounded-full bg-[#fff3da] px-1.5 py-0.5 text-[7px] font-medium text-[#c48a2e]">
                PREMIUM
              </span>
            </div>

            {/* Subject + progress */}
            <div className="mt-1.5 flex items-center justify-between">
              <p className="text-[8px] font-semibold text-[#3f5f7a]">{q.subject}</p>
              <p className="text-[7px] text-[#90a3b6]">
                {q.order} / {q.total}
              </p>
            </div>

            {/* Passage banner */}
            <div className="mt-1.5 flex items-center justify-between rounded bg-[#edf4fb] px-2 py-1">
              <span className="text-[7.5px] font-medium text-[#2f86d8]">{q.passage}</span>
              <span className="rounded bg-[#2f86d8] px-1.5 py-0.5 text-[7px] font-medium text-white">
                Open Text
              </span>
            </div>

            {/* Image placeholder */}
            <div className="mt-2 flex h-14 items-center justify-center rounded bg-[#f3f7fb]">
              <div className="text-center">
                <div className="mx-auto mb-1 h-5 w-8 rounded bg-[#dce7f2]" />
                <div className="h-1 w-10 rounded bg-[#dce7f2]" />
              </div>
            </div>

            {/* Question text */}
            <div className="mt-2 text-[7.5px] leading-relaxed text-[#4a6070]">
              <MathRenderer text={q.text} inline />
            </div>

            {/* Answer options */}
            <div className="mt-2 space-y-1">
              {q.options.map((opt, i) => (
                <div
                  key={opt.letter}
                  className={cn(
                    "flex items-center gap-1.5 rounded px-1.5 py-1 text-[7px]",
                    i === q.correctIndex
                      ? "bg-[#d6eaf6] text-[#2f86d8]"
                      : "bg-[#f8fbff] text-[#4a6070]"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border text-[6px] font-bold",
                      i === q.correctIndex
                        ? "border-[#2f86d8] bg-[#2f86d8] text-white"
                        : "border-[#c0d0dc] text-[#90a3b6]"
                    )}
                  >
                    {opt.letter}
                  </span>
                  <MathRenderer text={opt.text} inline />
                </div>
              ))}
            </div>

            {/* Next button */}
            <button className="mt-2 w-full rounded bg-[#2f86d8] py-1.5 text-[8px] font-medium text-white">
              Next Question →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
