"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, Eye, FileEdit, Globe, Pencil, Check } from "lucide-react";
import { type Article, type ArticleStatus } from "@/lib/blog-data";
import RichTextToolbar from "./RichTextToolbar";
import ThumbnailUploadSection from "./ThumbnailUploadSection";
import SeoSettingsSection from "./SeoSettingsSection";
import ArticleSidebar from "./ArticleSidebar";

type Props = {
  initialArticle?: Article;
};

type SeoData = {
  seoTitle: string;
  metaDescription: string;
  ogImageUrl: string;
};

type SidebarState = {
  status: ArticleStatus;
  category: string;
  author: string;
  publishDate: string;
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function ArticleEditorPage({ initialArticle }: Props) {
  const [title, setTitle] = useState(initialArticle?.title ?? "");
  const [slug, setSlug] = useState(initialArticle?.slug ?? "");
  const [editingSlug, setEditingSlug] = useState(false);
  const [slugInput, setSlugInput] = useState(initialArticle?.slug ?? "");
  const [content, setContent] = useState(initialArticle?.content ?? "");
  const [thumbnail, setThumbnail] = useState<string | null>(initialArticle?.thumbnailUrl ?? null);
  const [seo, setSeo] = useState<SeoData>({
    seoTitle: initialArticle?.title ?? "",
    metaDescription: initialArticle?.excerpt ?? "",
    ogImageUrl: initialArticle?.thumbnailUrl ?? "",
  });
  const [sidebar, setSidebar] = useState<SidebarState>({
    status: initialArticle?.status ?? "Draft",
    category: initialArticle?.category ?? "",
    author: "Testora Team",
    publishDate: initialArticle?.publishDate ?? "",
  });

  const wordCount = countWords(content);

  const handleTitleChange = useCallback((val: string) => {
    setTitle(val);
    if (!editingSlug) {
      const s = slugify(val);
      setSlug(s);
      setSlugInput(s);
    }
  }, [editingSlug]);

  const commitSlug = () => {
    setSlug(slugify(slugInput));
    setEditingSlug(false);
  };

  const handleSidebarChange = (field: keyof SidebarState, value: string) => {
    setSidebar((prev) => ({ ...prev, [field]: value }));
  };

  const isEditing = !!initialArticle;
  const pageTitle = isEditing ? (title || initialArticle!.title) : "New Article";

  return (
    <div className="flex flex-col gap-0">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            className="flex items-center gap-1 text-sm text-[#587189] hover:text-[#3f5f7a]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Articles
          </Link>
          <span className="text-[#dce7f2]">/</span>
          <h1 className="text-sm font-semibold text-[#3f5f7a] truncate max-w-70">
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-[#dce7f2] px-3 py-1.5 text-xs text-[#587189] hover:bg-[#f3f7fb]"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-[#dce7f2] px-3 py-1.5 text-xs text-[#587189] hover:bg-[#f3f7fb]"
          >
            <FileEdit className="h-3.5 w-3.5" />
            Save Draft
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md bg-[#2f86d8] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2a78c6]"
          >
            <Globe className="h-3.5 w-3.5" />
            Publish
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        {/* Left column */}
        <div className="min-w-0 flex-1 space-y-4">
          {/* Article title + slug */}
          <div className="rounded-lg border border-[#dce7f2] bg-white p-4">
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Article Title"
              className="w-full text-2xl font-semibold text-[#3f5f7a] placeholder:text-[#c5d4e2] outline-none bg-transparent"
            />
            <div className="mt-2 flex items-center gap-2 text-xs text-[#90a3b6]">
              <span>Slug:</span>
              {editingSlug ? (
                <div className="flex items-center gap-1.5">
                  <input
                    value={slugInput}
                    onChange={(e) => setSlugInput(e.target.value)}
                    autoFocus
                    className="rounded border border-[#b4cfe8] px-2 py-0.5 text-xs text-[#3f5f7a] outline-none bg-[#f8fbff]"
                  />
                  <button
                    type="button"
                    onClick={commitSlug}
                    className="text-[#2f86d8] hover:text-[#2a78c6]"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#587189]">{slug || "auto-generated-from-title"}</span>
                  <button
                    type="button"
                    onClick={() => { setEditingSlug(true); setSlugInput(slug); }}
                    className="text-[#90a3b6] hover:text-[#587189]"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content editor area */}
          <div className="rounded-lg border border-[#dce7f2] bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#90a3b6]">
                Article Content
              </p>
              <span className="text-[10px] text-[#90a3b6]">
                {wordCount} words · {Math.max(1, Math.ceil(wordCount / 200))} min read
              </span>
            </div>
            <RichTextToolbar />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here..."
              rows={16}
              className="w-full resize-none px-4 py-3 text-sm text-[#3f5f7a] placeholder:text-[#c5d4e2] outline-none bg-white leading-relaxed"
            />
          </div>

          {/* Thumbnail */}
          <ThumbnailUploadSection value={thumbnail} onChange={setThumbnail} />

          {/* SEO Settings */}
          <SeoSettingsSection
            data={seo}
            onChange={(field, val) => setSeo((prev) => ({ ...prev, [field]: val }))}
            articleTitle={title}
            slug={slug}
          />
        </div>

        {/* Right sidebar */}
        <div className="w-72 shrink-0">
          <ArticleSidebar
            data={sidebar}
            onChange={handleSidebarChange}
            wordCount={wordCount}
            onPublish={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
