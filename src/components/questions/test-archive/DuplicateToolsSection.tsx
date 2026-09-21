import { duplicateToolCards } from "@/lib/test-archive-data";
import { cn } from "@/lib/utils";
import { Copy, Layers3 } from "lucide-react";

function iconClass(color: string) {
  if (color === "violet") return "border-[#e4ddf4] bg-[#f1edfb] text-[#8468c4]";
  if (color === "green") return "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]";
  return "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]";
}

export default function DuplicateToolsSection() {
  return (
    <section className="rounded-lg border border-[#dce7f2] bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-[#3f5f7a]">Copy &amp; Duplicate Tools</h3>
      <div className="grid gap-3 md:grid-cols-3">
        {duplicateToolCards.map((item) => (
          <article key={item.title} className="rounded-md border border-[#dce7f2] bg-[#f8fbff] p-3">
            <div className={cn("mb-2 inline-flex rounded-md border p-2", iconClass(item.color))}>
              {item.color === "violet" ? (
                <Layers3 className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </div>
            <p className="text-xs font-semibold text-[#4f6d87]">{item.title}</p>
            <p className="mt-1 text-[11px] text-[#90a3b6]">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
