"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Loader2, Image as ImageIcon, Pencil, Trash2, Eye, ChevronDown } from "lucide-react";
import { useGetProductsQuery, useDeleteProductMutation, IProduct } from "@/store/apis/productApi";
import { toast } from "sonner";
import { ConfirmDeleteModal } from "../questions/question-bank/ConfirmDeleteModal";
import Link from "next/link";
import { useGetCategoriesQuery } from "@/store/apis/categoryApi";

export default function ProductManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Debounce search
  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: categoriesData } = useGetCategoriesQuery({ limit: 100 });
  const categories = categoriesData?.data || [];

  const { data, isLoading, isFetching } = useGetProductsQuery({
    page,
    limit: 10,
    searchTerm: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const openDeleteModal = (id: string) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete).unwrap();
      toast.success("Product deleted successfully!");
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete product.");
    }
  };

  const getStatusClass = (status: string) => {
    if (status === "active") return "text-[#3ea666] bg-[#e9f5f1] border-[#d5ece5]";
    if (status === "draft") return "text-[#c48a2e] bg-[#fff3da] border-[#f0dfb9]";
    return "text-[#db6f6f] bg-[#fdeeee] border-[#f4d7d7]";
  };

  const getStatusDotClass = (status: string) => {
    if (status === "active") return "bg-[#3ea666]";
    if (status === "draft") return "bg-[#c48a2e]";
    return "bg-[#db6f6f]";
  };

  return (
    <div className="space-y-4">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#3f5f7a]">Products</h1>
          <p className="text-sm text-[#7e95ab]">
            Manage marketplace products, pricing, and inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/marketplace/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2f86d8] px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-[#2a78c6] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </Link>
        </div>
      </div>

      {/* ── Search & Filters ────────────────────────────────────────────────── */}
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center rounded-xl border border-[#dce7f2] bg-white p-3 shadow-xs">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ab0c3]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product title or SKU..."
            className="h-9 w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] pl-9 pr-4 text-xs text-[#3f5f7a] outline-none transition-colors focus:border-[#b4cfe8] focus:bg-white"
          />
        </div>

        <div className="flex w-full items-center gap-2 lg:w-auto flex-wrap">
          <div className="relative flex-1 lg:w-40 lg:flex-none">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 w-full appearance-none rounded-md border border-[#dce7f2] bg-white pl-3 pr-8 text-xs font-medium text-[#587189] outline-none hover:bg-[#f8fbff]"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ab0c3]" />
          </div>

          <div className="relative flex-1 lg:w-36 lg:flex-none">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 w-full appearance-none rounded-md border border-[#dce7f2] bg-white pl-3 pr-8 text-xs font-medium text-[#587189] outline-none hover:bg-[#f8fbff]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="hidden">Hidden</option>
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
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ecf2f8]">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-[#8fa3b7]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-[#2f86d8]" />
                      <p>Loading products...</p>
                    </div>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="text-xs text-[#5e768e] hover:bg-[#f8fbff] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-[#dce7f2] bg-[#f3f7fb] flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-[#b4cfe8]" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#3f5f7a] max-w-[200px] truncate">
                            {product.title}
                          </p>
                          <p className="text-[10px] text-[#9ab0c3] mt-0.5">SKU: {product.sku || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md bg-[#f3f7fb] border border-[#dce7f2] px-2 py-0.5 text-[11px] font-medium text-[#6d839a]">
                        {typeof product.category === 'object' ? product.category.name : "Category"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#3f5f7a]">৳{product.price}</span>
                        {product.compareAtPrice && (
                          <span className="text-[10px] text-[#9ab0c3] line-through">
                            ৳{product.compareAtPrice}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className={`font-semibold ${product.stock <= product.lowStockAlert ? 'text-[#db6f6f]' : 'text-[#3f5f7a]'}`}>
                          {product.stock} in stock
                        </span>
                        {product.variants?.length > 0 && (
                          <span className="text-[10px] text-[#9ab0c3]">{product.variants.length} variants</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getStatusClass(
                          product.status
                        )}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${getStatusDotClass(product.status)}`} />
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/marketplace/${product._id}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-[#587189] hover:bg-[#f3f7fb] hover:text-[#2f86d8] transition-colors"
                          title="View Product"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/marketplace/${product._id}/edit`}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-[#587189] hover:bg-[#f3f7fb] hover:text-[#2f86d8] transition-colors"
                          title="Edit Product"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(product._id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-[#587189] hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Delete Product"
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
                    No products found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!isLoading && products.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 px-1 py-2 sm:flex-row">
          <p className="text-xs text-[#6e859b]">
            Showing <span className="font-semibold text-[#273d52]">{products.length}</span> of{" "}
            <span className="font-semibold text-[#273d52]">{meta.total}</span> products
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
        title="Delete Product"
        description="Are you sure you want to delete this product? It will be soft-deleted and removed from the public store."
      />
    </div>
  );
}
