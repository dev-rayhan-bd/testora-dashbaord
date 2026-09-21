"use client";

import { blogStats, articles as initialArticles, type ArticleStatus } from "@/lib/blog-data";
import { cn } from "@/lib/utils";
import {
  Archive,
  BookOpen,
  ChevronDown,
  Eye,
  FileText,
  Plus,
  Search,
  Tag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import ArticleTableRow from "./ArticleTableRow";
import ManageCategoriesModal from "./ManageCategoriesModal";

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  value,
  label,
  iconColor,
  iconBg,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#dce7f2] bg-white p-3.5">
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", iconBg)}>
        <Icon className={cn("h-4.5 w-4.5", iconColor)} />
      </div>
      <div>
        <p className="text-xl font-bold text-[#3f5f7a]">{value}</p>
        <p className="text-xs text-[#90a3b6]">{label}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogManagementPage() {
  const [articleList, setArticleList] = useState(initialArticles);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  const handleStatusChange = (id: string, status: ArticleStatus) => {
    setArticleList((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const handleDelete = (id: string) => {
    setArticleList((prev) => prev.filter((a) => a.id !== id));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return articleList.filter((a) => {
      const matchSearch =
        !q || a.title.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [articleList, search, statusFilter]);

  const publishedCount = articleList.filter((a) => a.status === "Published").length;
  const draftCount = articleList.filter((a) => a.status === "Draft").length;
  const archivedCount = articleList.filter((a) => a.status === "Archived").length;
  const hiddenCount = articleList.filter((a) => a.status === "Hidden").length;

  return (
    <div className="space-y-3">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#3f5f7a]">Blog Management</h1>
          <p className="text-sm text-[#7e95ab]">
            Create, organize, and publish educational articles for students
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCategoriesModal(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#dce7f2] bg-white px-3 text-xs font-medium text-[#587189] hover:bg-[#f3f7fb]"
          >
            <Tag className="h-3.5 w-3.5" />
            Manage Categories
          </button>
          <Link
            href="/blog/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2f86d8] px-3 text-xs font-medium text-white hover:bg-[#2a78c6]"
          >
            <Plus className="h-3.5 w-3.5" />
            Create New Article
          </Link>
        </div>
      </div>

      {/* ── Stats cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={FileText}
          value={articleList.length}
          label="Total Articles"
          iconColor="text-[#3f5f7a]"
          iconBg="bg-[#edf0fb]"
        />
        <StatCard
          icon={Eye}
          value={publishedCount}
          label="Published"
          iconColor="text-[#3ea666]"
          iconBg="bg-[#e9f8ef]"
        />
        <StatCard
          icon={BookOpen}
          value={draftCount}
          label="Drafts"
          iconColor="text-[#c48a2e]"
          iconBg="bg-[#fff3da]"
        />
        <StatCard
          icon={Archive}
          value={archivedCount}
          label="Archived"
          iconColor="text-[#6d839a]"
          iconBg="bg-[#f2f6fb]"
        />
      </div>

      {/* ── Total views bar ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#c8ddf2] bg-[#eaf4fd] px-4 py-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#2f86d8]" />
          <div>
            <p className="text-sm font-bold text-[#2f86d8]">
              {blogStats.totalViews.toLocaleString()} Total Views
            </p>
            <p className="text-xs text-[#5a8fc4]">Across all published articles</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {blogStats.categoryViews.map((cv) => (
            <div key={cv.label} className="text-center">
              <p className="text-sm font-bold text-[#3f5f7a]">{cv.views.toLocaleString()}</p>
              <p className="text-[10px] text-[#7e95ab]">{cv.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search + filter ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#dce7f2] bg-white p-3">
        <label className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-[#9ab0c3]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title..."
            className="h-9 w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] pr-3 pl-8 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3]"
          />
        </label>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 appearance-none rounded-md border border-[#dce7f2] bg-[#f8fbff] py-0 pr-8 pl-3 text-sm text-[#587189] outline-none"
          >
            {["All", "Published", "Draft", "Hidden", "Archived"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ab0c3]" />
        </div>

        <div className="relative">
          <select className="h-9 appearance-none rounded-md border border-[#dce7f2] bg-[#f8fbff] py-0 pr-8 pl-3 text-sm text-[#587189] outline-none">
            <option value="">All Categories</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ab0c3]" />
        </div>

        <span className="ml-auto text-xs text-[#90a3b6]">
          {filtered.length} / {articleList.length} articles
        </span>
      </div>

      {/* ── Articles table ───────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-lg border border-[#dce7f2] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-205 text-left">
            <thead className="bg-[#f3f7fb] text-[11px] font-medium tracking-wide text-[#6f859b] uppercase">
              <tr>
                <th className="px-3 py-2.5">Thumb</th>
                <th className="px-3 py-2.5">
                  <span className="flex items-center gap-1">
                    Title
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-3 py-2.5">Category</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">
                  <span className="flex items-center gap-1">
                    Publish Date
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-3 py-2.5">
                  <span className="flex items-center gap-1">
                    Views
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-3 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((article) => (
                <ArticleTableRow
                  key={article.id}
                  article={article}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#90a3b6]">
                    No articles match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#ecf2f8] px-4 py-2.5 text-xs text-[#90a3b6]">
          <span>
            Showing {filtered.length} of {articleList.length} articles
          </span>
          <span className="flex flex-wrap gap-3">
            <span className="text-[#3ea666]">{publishedCount} Published</span>
            <span className="text-[#c48a2e]">{draftCount} Draft</span>
            <span className="text-[#d97a2a]">{hiddenCount} Hidden</span>
            <span className="text-[#6d839a]">{archivedCount} Archived</span>
          </span>
        </div>
      </div>

      <ManageCategoriesModal
        open={showCategoriesModal}
        articles={articleList}
        onClose={() => setShowCategoriesModal(false)}
      />
    </div>
  );
}
