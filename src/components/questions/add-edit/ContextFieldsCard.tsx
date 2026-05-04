import { Info } from "lucide-react";

export default function ContextFieldsCard() {
  return (
    <div className="rounded-lg border border-[#c8ddf2] bg-[#eaf4fd] p-4">
      <div className="mb-2.5 flex items-center gap-1.5">
        <Info className="h-3.5 w-3.5 text-[#4a8fc7]" />
        <h3 className="text-xs font-semibold text-[#3a6e9e]">Context-Based Fields</h3>
      </div>
      <ul className="space-y-1.5">
        <li className="flex items-start gap-1.5 text-[11px] text-[#4a7eb8]">
          <span className="mt-0.5 shrink-0">›</span>
          <span>
            <span className="font-medium">Subject field:</span> for Semimatura &amp; Matura
          </span>
        </li>
        <li className="flex items-start gap-1.5 text-[11px] text-[#4a7eb8]">
          <span className="mt-0.5 shrink-0">›</span>
          <span>
            <span className="font-medium">Faculty, Department &amp; Subject:</span> for Entrance
            Exams
          </span>
        </li>
        <li className="flex items-start gap-1.5 text-[11px] text-[#4a7eb8]">
          <span className="mt-0.5 shrink-0">›</span>
          <span>
            <span className="font-medium">Department-specific pools:</span> same subject names can
            still map to different question difficulty by department
          </span>
        </li>
        <li className="flex items-start gap-1.5 text-[11px] text-[#4a7eb8]">
          <span className="mt-0.5 shrink-0">›</span>
          <span>
            <span className="font-medium">Core &amp; Elective Subject:</span> for Matura
          </span>
        </li>
      </ul>
    </div>
  );
}
