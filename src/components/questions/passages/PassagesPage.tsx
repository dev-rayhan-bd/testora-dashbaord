"use client";

import { passageEntityFields } from "@/lib/passages-data";
import { cn } from "@/lib/utils";
import {
  useDeletePassageMutation,
  useGetPassagesQuery,
  useTogglePassageStatusMutation,
  type PassageItem,
} from "@/store/apis";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  RotateCw,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddEditPassageModal } from "./AddEditPassageModal";
import PassageTable from "./PassageTable";

const correctItems = [
  { label: "Passage 1", sub: "(shared content block)", highlight: true },
  { label: "Question 1 (linked to passage 1)", highlight: false },
  { label: "Question 2 (linked to Passage 1)", highlight: false },
  { label: "Question 3 (linked to Passage 1)", highlight: false },
  { label: "Q4 through Q10 ...", highlight: false, muted: true },
  { label: "Next question after passage = Q11 ✓", highlight: true, green: true },
];

const wrongItems = [
  { label: "Q1 — Passage treated as Question 1 ✗", cross: true },
  { label: "Q2 — First real question (Passage Q1) ✗", cross: true },
  { label: "Q3 — Numbering is shifted by 1 ✗", cross: true },
];

export default function PassagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isFetching, refetch } = useGetPassagesQuery({
    page,
    limit,
    searchTerm: debouncedSearch || undefined,
  });

  const [toggleStatus] = useTogglePassageStatusMutation();
  const [deletePassage, { isLoading: isDeleting }] = useDeletePassageMutation();

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPassage, setSelectedPassage] = useState<PassageItem | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [deletingPassage, setDeletingPassage] = useState<PassageItem | null>(null);

  const passages = data?.data ?? [];
  const meta = data?.meta ?? {
    total: passages.length,
    page: 1,
    limit: 10,
    totalPages: Math.ceil(passages.length / 10) || 1,
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success("Passage status updated");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message || "Failed to update passage status";
      toast.error(msg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPassage) return;
    try {
      await deletePassage(deletingPassage._id).unwrap();
      toast.success("Passage deleted successfully");
      setDeletingPassage(null);
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message || "Failed to delete passage";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#273d52]">Passage System</h2>
          <p className="text-xs text-[#6e859b]">
            Manage shared reading passages and comprehension materials linked to questions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh list"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-[#dce7f2] bg-white px-2.5 text-[#587189] shadow-xs hover:bg-[#f8fbff] disabled:opacity-50"
          >
            <RotateCw className={cn("h-4 w-4", isFetching && "animate-spin text-[#1e6fbe]")} />
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedPassage(null);
              setModalOpen(true);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#1d4ed8]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Passage
          </button>
        </div>
      </section>

      {/* Critical Rule Banner */}
      <section className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3.5 shadow-2xs">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <div>
          <p className="text-xs font-bold text-amber-900">
            Critical Rule: A passage is NOT a question
          </p>
          <p className="mt-0.5 text-xs text-amber-700 leading-relaxed">
            A passage does not consume a question number. It is a shared content container (text/image)
            displayed above its linked questions. Question numbering continues consecutively in student view.
          </p>
        </div>
      </section>

      {/* Architecture Cards: Correct vs Wrong */}
      <section className="grid gap-3.5 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-xs">
          <div className="mb-2.5 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-900">Correct Implementation</span>
          </div>
          <div className="space-y-1.5 rounded-lg border border-emerald-100 bg-[#f0fbf5] p-3">
            {correctItems.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "text-xs",
                  item.green
                    ? "font-semibold text-emerald-700"
                    : item.highlight
                    ? "flex items-center gap-1.5 font-semibold text-[#1e6fbe]"
                    : item.muted
                    ? "pl-4 text-[#8ea3b8]"
                    : "pl-4 text-[#506880]"
                )}
              >
                {item.highlight && !item.green && (
                  <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[#dcecfc] text-[9px] font-bold text-[#1e6fbe]">
                    P
                  </span>
                )}
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-rose-200 bg-white p-4 shadow-xs">
          <div className="mb-2.5 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-rose-600" />
            <span className="text-xs font-bold text-rose-900">Wrong Implementation</span>
          </div>
          <div className="space-y-1.5 rounded-lg border border-rose-100 bg-[#fff5f5] p-3">
            {wrongItems.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-rose-600">
                <span className="inline-flex h-4 w-5 shrink-0 items-center justify-center rounded bg-rose-100 text-[9px] font-bold text-rose-700">
                  Q{i + 1}
                </span>
                <span className="line-through opacity-80">{item.label.replace(" — ", " ")}</span>
                <XCircle className="h-3 w-3 shrink-0 text-rose-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Input */}
      <section className="rounded-xl border border-[#dce7f2] bg-white p-3 shadow-xs">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9ab0c3]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search passages by code, title, or content keywords..."
            className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] pr-3 pl-9 text-xs text-[#2c445c] outline-none transition-colors focus:border-[#7ab1e8] focus:bg-white"
          />
        </div>
      </section>

      {/* Table */}
      <PassageTable
        rows={passages}
        startIndex={(page - 1) * limit}
        isLoading={isLoading}
        onEdit={(p) => {
          setSelectedPassage(p);
          setModalOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
        onDelete={(p) => setDeletingPassage(p)}
        onPreviewImage={(url, title) => setPreviewImage({ url, title })}
      />

      {/* Pagination Controls */}
      <div className="flex flex-col items-center justify-between gap-3 px-1 py-2 sm:flex-row">
        <p className="text-xs text-[#6e859b]">
          Showing <span className="font-semibold text-[#273d52]">{passages.length}</span> of{" "}
          <span className="font-semibold text-[#273d52]">{meta.total}</span> passages
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#dce7f2] bg-white px-2.5 text-xs font-semibold text-[#48637e] shadow-xs hover:bg-[#f8fbff] disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </button>
          <span className="px-2 text-xs font-medium text-[#6e859b]">
            Page {meta.page} of {meta.totalPages || 1}
          </span>
          <button
            type="button"
            disabled={page >= (meta.totalPages || 1) || isLoading}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#dce7f2] bg-white px-2.5 text-xs font-semibold text-[#48637e] shadow-xs hover:bg-[#f8fbff] disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Entity Specs */}
      <section className="rounded-xl border border-[#dce7f2] bg-white p-4 shadow-xs">
        <h3 className="mb-3 text-xs font-bold tracking-wider text-[#58738e] uppercase">
          Passage Data Schema
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {passageEntityFields.map((field) => (
            <div
              key={field.label}
              className="rounded-lg border border-[#dce7f2] bg-[#f8fbff] p-2.5"
            >
              <p className="text-xs font-bold text-[#2d445c]">{field.label}</p>
              {field.desc && <p className="mt-0.5 text-[10px] text-[#8aa0b4]">{field.desc}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
      <AddEditPassageModal
        open={modalOpen}
        passage={selectedPassage}
        onClose={() => {
          setModalOpen(false);
          setSelectedPassage(null);
        }}
      />

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e293b]/70 p-4 backdrop-blur-xs"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-white p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e9eff6] px-3 pb-2 mb-2">
              <span className="text-xs font-semibold text-[#273d52] truncate">
                {previewImage.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="rounded p-1 text-[#8aa0b4] hover:bg-[#f1f6fb]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-auto max-h-[75vh]">
              <Image
                src={previewImage.url}
                alt={previewImage.title}
                width={800}
                height={600}
                className="mx-auto h-auto max-w-full rounded object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPassage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e293b]/45 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Delete Passage</h3>
                <p className="text-xs text-rose-600">
                  Are you sure? Any questions linked to this passage will remain, but the passage container will be removed.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#e8edf2] bg-[#f8fbff] p-3 text-xs text-[#4f6d87]">
              <p className="font-semibold text-[#2d4256]">{deletingPassage.title}</p>
              <p className="mt-1 font-mono text-[#869ab0]">Code: {deletingPassage.passageCode}</p>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#e6edf5] pt-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingPassage(null)}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-[#6f8194] hover:bg-[#f5f9fd]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
