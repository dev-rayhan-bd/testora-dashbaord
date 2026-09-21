"use client";

import { ChevronUp, ChevronDown, RefreshCw } from "lucide-react";
import { useState } from "react";

type SeoData = {
  seoTitle: string;
  metaDescription: string;
  ogImageUrl: string;
};

type Props = {
  data: SeoData;
  onChange: (field: keyof SeoData, value: string) => void;
  articleTitle: string;
  slug: string;
};

const inputClass =
  "w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3] focus:border-[#2f86d8]";

export default function SeoSettingsSection({ data, onChange, articleTitle, slug }: Props) {
  const [open, setOpen] = useState(false);

  const seoTitleLen = data.seoTitle.length;
  const metaLen     = data.metaDescription.length;

  const googleUrl    = `testora.edu${slug}`;
  const googleTitle  = data.seoTitle || articleTitle || "Article Title | Testora";
  const googleSnippet = data.metaDescription || "No meta description provided.";

  return (
    <section className="rounded-lg border border-[#dce7f2] bg-white">
      {/* Accordion toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5 text-[#4a93d9]" />
          <span className="text-sm font-medium text-[#3f5f7a]">SEO Settings</span>
          <span className="rounded-full border border-[#dce7f2] bg-[#f3f7fb] px-1.5 py-0.5 text-[10px] font-medium text-[#90a3b6]">
            Optional
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-[#9ab0c3]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#9ab0c3]" />
        )}
      </button>

      {open && (
        <div className="space-y-4 border-t border-[#dce7f2] px-4 pb-4 pt-3">
          {/* SEO Title */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#587189]">SEO Title</label>
            <input
              value={data.seoTitle}
              onChange={(e) => onChange("seoTitle", e.target.value)}
              placeholder="SEO title for search engines..."
              className={inputClass}
            />
            <div className="mt-1 flex items-center justify-between">
              <p className="text-[10px] text-[#90a3b6]">Recommended: 50–65 characters</p>
              <span
                className={`text-[10px] ${seoTitleLen > 65 ? "text-[#db6f6f]" : "text-[#90a3b6]"}`}
              >
                {seoTitleLen}/65
              </span>
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#587189]">Meta Description</label>
            <textarea
              value={data.metaDescription}
              onChange={(e) => onChange("metaDescription", e.target.value)}
              placeholder="Brief description that appears in search results..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
            <div className="mt-1 flex items-center justify-between">
              <p className="text-[10px] text-[#90a3b6]">Recommended: 120–160 characters</p>
              <span
                className={`text-[10px] ${metaLen > 160 ? "text-[#db6f6f]" : "text-[#90a3b6]"}`}
              >
                {metaLen}/160
              </span>
            </div>
          </div>

          {/* Open Graph URL */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#587189]">
              Open Graph Image URL
            </label>
            <input
              value={data.ogImageUrl}
              onChange={(e) => onChange("ogImageUrl", e.target.value)}
              placeholder="https://... (used for social media sharing)"
              className={inputClass}
            />
            <p className="mt-1 text-[10px] text-[#90a3b6]">
              Leave empty to use the article thumbnail
            </p>
          </div>

          {/* Google preview (only when title or meta is filled) */}
          {(data.seoTitle || data.metaDescription) && (
            <div className="rounded-lg border border-[#dce7f2] bg-[#f8fbff] p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#90a3b6]">
                Google Preview
              </p>
              <p className="text-xs text-[#4a93d9]">{googleUrl}</p>
              <p className="mt-0.5 text-sm font-medium text-[#1a73e8]">{googleTitle}</p>
              <p className="mt-0.5 text-xs text-[#5e768e] line-clamp-2">{googleSnippet}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
