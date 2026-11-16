"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathRendererProps {
  text?: string | null;
  className?: string;
  inline?: boolean;
}

type Segment =
  | { type: "text"; content: string }
  | { type: "inline-math"; content: string }
  | { type: "block-math"; content: string };

/**
 * Splits text into standard text and LaTeX math segments.
 * Supports:
 *  - $$ ... $$ (block math)
 *  - \[ ... \] (block math)
 *  - $ ... $ (inline math)
 *  - \( ... \) (inline math)
 *  - Bare LaTeX commands (e.g., \frac{7}{12}, \sqrt{16}, etc. without dollar signs)
 */
export function parseMathSegments(rawText: string): Segment[] {
  if (!rawText) return [];

  let text = rawText;

  // Check if text has standard LaTeX delimiters
  const hasStandardDelimiters = /(\$\$|\\\[|\$|\\\()/.test(text);

  // If user didn't wrap in delimiters but wrote LaTeX commands (e.g. \frac{7}{12} or \sqrt{x})
  if (!hasStandardDelimiters && /\\[a-zA-Z]+/.test(text)) {
    // Auto-wrap bare LaTeX expressions with $ ... $ so they parse seamlessly
    text = text.replace(
      /(\\[a-zA-Z]+(?:\{[^{}]*\}|\^[0-9a-zA-Z]|\_[0-9a-zA-Z]|\^\{[^{}]*\}|\_\{[^{}]*\})*(?:\s*[\+\-\*\/\=\<\>\pm\times\div]\s*(?:\\[a-zA-Z]+(?:\{[^{}]*\}|\^[0-9a-zA-Z]|\_[0-9a-zA-Z]|\^\{[^{}]*\}|\_\{[^{}]*\})*|[0-9a-zA-Z]+))*)/g,
      (match) => `$${match}$`
    );
  }

  // Regex to split on delimiters
  const delimiterRegex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$(?:\\\$|[^\$\n])+?\$|\\\([\s\S]+?\\\))/g;
  const parts = text.split(delimiterRegex);
  const segments: Segment[] = [];

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith("$$") && part.endsWith("$$")) {
      segments.push({
        type: "block-math",
        content: part.slice(2, -2).trim(),
      });
    } else if (part.startsWith("\\[") && part.endsWith("\\]")) {
      segments.push({
        type: "block-math",
        content: part.slice(2, -2).trim(),
      });
    } else if (part.startsWith("$") && part.endsWith("$")) {
      segments.push({
        type: "inline-math",
        content: part.slice(1, -1).trim(),
      });
    } else if (part.startsWith("\\(") && part.endsWith("\\)")) {
      segments.push({
        type: "inline-math",
        content: part.slice(2, -2).trim(),
      });
    } else {
      segments.push({
        type: "text",
        content: part,
      });
    }
  }

  return segments;
}

export default function MathRenderer({
  text,
  className = "",
  inline = false,
}: MathRendererProps) {
  if (!text) return null;

  const segments = useMemo(() => parseMathSegments(text), [text]);

  return (
    <span className={`inline-math-container ${className}`}>
      {segments.map((seg, idx) => {
        if (seg.type === "text") {
          return <span key={idx}>{seg.content}</span>;
        }

        const isBlock = !inline && seg.type === "block-math";

        try {
          const html = katex.renderToString(seg.content, {
            displayMode: isBlock,
            throwOnError: false,
            strict: false,
          });

          return (
            <span
              key={idx}
              className={
                isBlock
                  ? "block my-2 text-center overflow-x-auto py-1"
                  : "inline-block px-0.5 align-middle"
              }
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <span key={idx} className="font-mono text-xs text-rose-500">
              {seg.content}
            </span>
          );
        }
      })}
    </span>
  );
}
