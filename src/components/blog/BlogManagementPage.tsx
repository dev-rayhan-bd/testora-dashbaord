"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Archive,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Search,
  Tag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import ArticleTableRow from "./ArticleTableRow";
import { useDeleteBlogMutation, useGetBlogsQuery } from "@/store/apis/blogApi";
import { toast } from "sonner";
import { ConfirmDeleteModal } from "../questions/question-bank/ConfirmDeleteModal";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  // Debounce search
  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, isFetching } = useGetBlogsQuery({
    page,
    limit: 10,
    searchTerm: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  });

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const articles = data?.data?.data || [];
  const meta = data?.data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    try {
      await deleteBlog(blogToDelete).unwrap();
      toast.success("Blog deleted successfully!");
      setDeleteModalOpen(false);
      setBlogToDelete(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete blog.");
    }
  };

  const openDeleteModal = (id: string) => {
    setBlogToDelete(id);
    setDeleteModalOpen(true);
  };

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
          <Link
            href="/blog/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2f86d8] px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-[#2a78c6]"
          >
            <Plus className="h-4 w-4" />
            New Article
          </Link>
        </div>
      </div>

      {/* ── Search & Filters ────────────────────────────────────────────────── */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center rounded-xl border border-[#dce7f2] bg-white p-3 shadow-xs">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ab0c3]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles by title..."
            className="h-9 w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] pl-9 pr-4 text-xs text-[#3f5f7a] outline-none transition-colors focus:border-[#b4cfe8] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 appearance-none rounded-md border border-[#dce7f2] bg-white pl-3 pr-8 text-xs font-medium text-[#587189] outline-none hover:bg-[#f8fbff]"
            >
              <option value="all">All Categories</option>
              <option value="Entrance Exams">Entrance Exams</option>
              <option value="Matura">Matura</option>
              <option value="Semi Matura">Semi Matura</option>
              <option value="Platform Updates">Platform Updates</option>
              <option value="University Preparations">University Preparations</option>
              <option value="Study Tips">Study Tips</option>
              <option value="Quiz Tips">Quiz Tips</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ab0c3]" />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 appearance-none rounded-md border border-[#dce7f2] bg-white pl-3 pr-8 text-xs font-medium text-[#587189] outline-none hover:bg-[#f8fbff]"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ab0c3]" />
          </div>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-[#dce7f2] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-[#e5eff8] bg-[#f5f9fd] text-[11px] font-semibold uppercase tracking-wider text-[#637d96]">
              <tr>
                <th className="px-3 py-3">Thumbnail</th>
                <th className="px-3 py-3">Title</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Published</th>
                <th className="px-3 py-3">Views</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ecf2f8]">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={7} className="px-3 py-16 text-center text-sm text-[#8fa3b7]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-[#2f86d8]" />
                      <p>Loading blogs...</p>
                    </div>
                  </td>
                </tr>
              ) : articles.length > 0 ? (
                articles.map((article) => (
                  <ArticleTableRow
                    key={article._id}
                    article={article}
                    onDelete={openDeleteModal}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-3 py-12 text-center text-sm text-[#8fa3b7]">
                    No articles found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!isLoading && articles.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 px-1 py-2 sm:flex-row">
          <p className="text-xs text-[#6e859b]">
            Showing <span className="font-semibold text-[#273d52]">{articles.length}</span> of{" "}
            <span className="font-semibold text-[#273d52]">{meta.total}</span> blogs
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#dce7f2] bg-white px-2.5 text-xs font-semibold text-[#48637e] shadow-xs hover:bg-[#f8fbff] disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <div className="flex h-8 items-center justify-center rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs font-bold text-[#2f86d8] shadow-xs">
              Page {page} of {meta.totalPages}
            </div>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#dce7f2] bg-white px-2.5 text-xs font-semibold text-[#48637e] shadow-xs hover:bg-[#f8fbff] disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Blog"
        description="Are you sure you want to permanently delete this blog? This action cannot be undone."
      />
    </div>
  );
}
