"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Loader2, Image as ImageIcon, Pencil, Trash2, ChevronDown } from "lucide-react";
import { useGetCategoriesQuery, useDeleteCategoryMutation, ICategory } from "@/store/apis/categoryApi";
import { toast } from "sonner";
import { ConfirmDeleteModal } from "../questions/question-bank/ConfirmDeleteModal";
import CategoryModal from "./CategoryModal";

export default function CategoryManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Debounce search
  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, isFetching } = useGetCategoriesQuery({
    page,
    limit: 20,
    searchTerm: debouncedSearch || undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
  });

  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const categories = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 20, totalPages: 1 };

  const handleEdit = (category: ICategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setCategoryToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete).unwrap();
      toast.success("Category deleted successfully!");
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete category.");
    }
  };

  return (
    <div className="space-y-3">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#3f5f7a]">Category Management</h1>
          <p className="text-sm text-[#7e95ab]">
            Manage product categories across the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2f86d8] px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-[#2a78c6] transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Category
          </button>
        </div>
      </div>

      {/* ── Search & Filters ────────────────────────────────────────────────── */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center rounded-xl border border-[#dce7f2] bg-white p-3 shadow-xs">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ab0c3]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories by name..."
            className="h-9 w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] pl-9 pr-4 text-xs text-[#3f5f7a] outline-none transition-colors focus:border-[#b4cfe8] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
                <th className="px-4 py-3">Thumbnail</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ecf2f8]">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-[#8fa3b7]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-[#2f86d8]" />
                      <p>Loading categories...</p>
                    </div>
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category._id} className="text-xs text-[#5e768e] hover:bg-[#f8fbff] transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="h-10 w-14 overflow-hidden rounded-md border border-[#dce7f2] bg-[#f3f7fb] flex items-center justify-center shrink-0">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-[#b4cfe8]" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-[#3f5f7a] max-w-[200px] truncate">
                      {category.name}
                    </td>
                    <td className="px-4 py-2.5 max-w-[150px] truncate">
                      {category.slug}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          category.isActive ? "text-[#3ea666]" : "text-[#90a3b6]"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            category.isActive ? "bg-[#3ea666]" : "bg-[#90a3b6]"
                          }`}
                        />
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-medium">
                      {category.productCount ?? 0}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(category)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-[#587189] hover:bg-[#f3f7fb] hover:text-[#2f86d8] transition-colors"
                          title="Edit Category"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(category._id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-[#587189] hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#8fa3b7]">
                    No categories found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!isLoading && categories.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 px-1 py-2 sm:flex-row">
          <p className="text-xs text-[#6e859b]">
            Showing <span className="font-semibold text-[#273d52]">{categories.length}</span> of{" "}
            <span className="font-semibold text-[#273d52]">{meta.total}</span> categories
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex h-8 items-center justify-center rounded-lg border border-[#dce7f2] bg-white px-2.5 text-xs font-semibold text-[#48637e] shadow-xs hover:bg-[#f8fbff] disabled:opacity-40"
            >
              Previous
            </button>
            <div className="flex h-8 items-center justify-center rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs font-bold text-[#2f86d8] shadow-xs">
              Page {page} of {meta.totalPages}
            </div>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              className="inline-flex h-8 items-center justify-center rounded-lg border border-[#dce7f2] bg-white px-2.5 text-xs font-semibold text-[#48637e] shadow-xs hover:bg-[#f8fbff] disabled:opacity-40"
            >
              Next
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
        title="Delete Category"
        description="Are you sure you want to delete this category? If it is linked to active products, deletion may fail."
      />

      {isModalOpen && (
        <CategoryModal
          open={isModalOpen}
          category={selectedCategory}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
