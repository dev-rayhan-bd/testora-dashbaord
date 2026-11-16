"use client";

import { useRef } from "react";
import { ImageIcon } from "lucide-react";
import MathRenderer from "@/components/common/MathRenderer";
import MathToolbar from "@/components/common/MathToolbar";

type QuestionContentSectionProps = {
  questionText: string;
  onTextChange: (value: string) => void;
};

export default function QuestionContentSection({
  questionText,
  onTextChange,
}: QuestionContentSectionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onTextChange(questionText ? questionText + " " + snippet : snippet);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = questionText.substring(start, end);

    let toInsert = snippet;
    let replaceStart = start;

    if (selected) {
      if (snippet === "$x^{2}$") {
        toInsert = `$${selected}^{2}$`;
      } else if (snippet === "$x_{1}$") {
        toInsert = `$${selected}_{1}$`;
      } else if (snippet === "$\\sqrt{x}$") {
        toInsert = `$\\sqrt{${selected}}$`;
      } else if (snippet === "$\\frac{a}{b}$") {
        toInsert = `$\\frac{${selected}}{b}$`;
      }
    } else if (start > 0) {
      const charBefore = questionText[start - 1];
      if (/[a-zA-Z0-9]/.test(charBefore)) {
        if (snippet === "$x^{2}$") {
          replaceStart = start - 1;
          toInsert = `$${charBefore}^{2}$`;
        } else if (snippet === "$x_{1}$") {
          replaceStart = start - 1;
          toInsert = `$${charBefore}_{1}$`;
        } else if (snippet === "$^{\\circ}$") {
          replaceStart = start - 1;
          toInsert = `$${charBefore}^{\\circ}$`;
        }
      }
    }

    const nextVal =
      questionText.substring(0, replaceStart) + toInsert + questionText.substring(end);
    onTextChange(nextVal);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(replaceStart + toInsert.length, replaceStart + toInsert.length);
    }, 0);
  };

  return (
    <section className="rounded-lg border border-[#dce7f2] bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#3f5f7a]">Question Content</h3>
      </div>

      {/* Math Assistant Toolbar */}
      <MathToolbar onInsert={handleInsertSnippet} className="mb-3" />

      {/* Question text */}
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium text-[#587189]">
          Question Text (LaTeX supported)
        </label>
        <textarea
          ref={textareaRef}
          value={questionText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Enter the question text or equation (e.g. $\frac{7}{12}$ or $x^2 + y^2 = r^2$)..."
          rows={4}
          className="w-full resize-none rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3] focus:border-[#2f86d8] focus:ring-1 focus:ring-[#2f86d8]/20"
        />

        {/* Live Math Preview */}
        {questionText.trim() && (
          <div className="mt-2 rounded-md border border-[#cbe1f5] bg-[#f8fbff] p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb]">
                Mathematical &amp; Text Live Preview
              </span>
              <span className="text-[10px] text-[#7d93a8]">
                Real-time preview
              </span>
            </div>
            <div className="text-sm text-[#2e4c69] leading-relaxed break-words">
              <MathRenderer text={questionText} />
            </div>
          </div>
        )}
      </div>

      {/* Image upload */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-[#587189]">
          Question Image (optional)
        </label>
        <div className="flex min-h-20 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[#c8d9ea] bg-[#f3f8fd] p-4 text-center hover:bg-[#edf4fb]">
          <ImageIcon className="h-5 w-5 text-[#9ab0c3]" />
          <p className="text-xs text-[#7e95ab]">Click to upload or drag &amp; drop</p>
        </div>
      </div>
    </section>
  );
}
