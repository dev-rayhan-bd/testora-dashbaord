"use client";

import { duplicateToolCards } from "@/lib/test-archive-data";
import { cn } from "@/lib/utils";
import { Copy, Layers3 } from "lucide-react";

function iconClass(color: string) {
  if (color === "violet") return "border-[#e4ddf4] bg-[#f1edfb] text-[#8468c4]";
  if (color === "green") return "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]";
  return "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]";
}

interface Props {
  onTriggerCopyYear?: () => void;
}

export default function DuplicateToolsSection({ onTriggerCopyYear }: Props) {
  return (
    <section className="rounded-xl border border-[#dce7f2] bg-white p-4 shadow-xs">
      <h3 className="mb-3 text-sm font-bold text-[#273d52]">Copy &amp; Duplicate Operations</h3>
      <div className="grid gap-3 md:grid-cols-3">
        {duplicateToolCards.map((item, idx) => {
          const isCopyYear = idx === 0;
          return (
            <div
              key={item.title}
              onClick={() => {
                if (isCopyYear && onTriggerCopyYear) {
                  onTriggerCopyYear();
                }
              }}
              className={cn(
                "rounded-lg border border-[#dce7f2] bg-[#f8fbff] p-3 transition-all",
                isCopyYear && onTriggerCopyYear && "cursor-pointer hover:border-[#8cbbe8] hover:bg-[#eef6fd]"
              )}
            >
              <div className={cn("mb-2 inline-flex rounded-md border p-2", iconClass(item.color))}>
                {item.color === "violet" ? (
                  <Layers3 className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#3d5a75]">{item.title}</p>
                {isCopyYear && (
                  <span className="rounded bg-[#dcecfc] px-1.5 py-0.5 text-[10px] font-semibold text-[#1e6fbe]">
                    Click to run
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-[#788fba]">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
