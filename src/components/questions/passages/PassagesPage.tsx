"use client";

import { passageEntityFields } from "@/lib/passages-data";
import { getErrorMessage, useCreatePassageMutation, useGetPassagesQuery } from "@/store/apis";
import {
  AlertTriangle,
  CheckCircle2,
  ImagePlus,
  Plus,
  Search,
  Smartphone,
  Trash2,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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

type AddPassageForm = {
  passageCode: string;
  title: string;
  content: string;
  passageImage: File | null;
};

function AddPassageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [createPassage, { isLoading }] = useCreatePassageMutation();
  const [form, setForm] = useState<AddPassageForm>({
    passageCode: "",
    title: "",
    content: "",
    passageImage: null,
  });
  const previewUrl = useMemo(() => {
    if (!form.passageImage) return null;
    return URL.createObjectURL(form.passageImage);
  }, [form.passageImage]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/30 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-[#dce7f2] bg-white">
        <div className="flex items-start justify-between border-b border-[#e6edf5] px-5 py-4">
          <div>
            <h3 className="text-xl font-semibold text-[#2f3f52]">Add Passage</h3>
            <p className="text-xs text-[#8ea1b4]">
              Create a passage block and upload an optional image
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#8ea1b5] hover:bg-[#f4f8fc]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#4f6d87]">Passage Code</span>
            <input
              value={form.passageCode}
              onChange={(e) => setForm((prev) => ({ ...prev, passageCode: e.target.value }))}
              className="h-10 w-full rounded-md border border-[#dce7f2] px-3 text-sm outline-none"
              placeholder="e.g. P-001"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#4f6d87]">Title</span>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="h-10 w-full rounded-md border border-[#dce7f2] px-3 text-sm outline-none"
              placeholder="e.g. Reading Passage"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#4f6d87]">Content</span>
            <textarea
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              className="min-h-28 w-full rounded-md border border-[#dce7f2] px-3 py-2 text-sm outline-none"
              placeholder="Paste passage content here"
            />
          </label>

          <div>
            <span className="mb-1 block text-sm font-medium text-[#4f6d87]">Passage Image</span>
            <label className="group flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#c9dbee] bg-[#f8fbff] p-4 transition hover:border-[#2f86d8] hover:bg-[#f3f8ff]">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, passageImage: e.target.files?.[0] ?? null }))
                }
                className="sr-only"
              />

              {previewUrl ? (
                <div className="w-full space-y-3">
                  <div className="relative overflow-hidden rounded-lg border border-[#dce7f2] bg-white shadow-sm">
                    <Image
                      src={previewUrl}
                      alt="Passage preview"
                      className="h-44 w-full object-cover"
                      width={800}
                      height={440}
                      unoptimized
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent px-3 py-2 text-xs text-white">
                      Preview
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#3f5f7a]">
                        {form.passageImage?.name}
                      </p>
                      <p className="text-[11px] text-[#8ea1b4]">
                        {form.passageImage ? `${Math.round(form.passageImage.size / 1024)} KB` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, passageImage: null }))}
                      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-[#dce7f2] bg-white px-3 text-xs font-medium text-[#c05050] hover:bg-[#fff5f5]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d7e6f4] bg-white text-[#2f86d8]">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#3f5f7a]">
                      Click to upload passage image
                    </p>
                    <p className="mt-0.5 text-xs text-[#8ea1b4]">
                      PNG, JPG or WebP, up to your browser limit
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full border border-[#dce7f2] bg-white px-2.5 py-1 text-[11px] text-[#587189]">
                    <Upload className="h-3.5 w-3.5" />
                    Browse files
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#e6edf5] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-[#6f8194] hover:bg-[#f5f9fd]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={async () => {
              try {
                await createPassage(form).unwrap();
                toast.success("Passage created successfully.");
                onClose();
                setForm({ passageCode: "", title: "", content: "", passageImage: null });
              } catch (error) {
                const message =
                  (error as { data?: { message?: string }; error?: string } | undefined)?.data
                    ?.message ??
                  (error as { data?: { message?: string }; error?: string } | undefined)?.error ??
                  "Unable to create passage.";
                toast.error(message);
              }
            }}
            className="rounded-md bg-[#2f86d8] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Save Passage"}
          </button>
        </div>
      </div>
    </div>
  );
}

function UpdatePassageModal({
  open,
  onClose,
  passageId,
}: {
  open: boolean;
  onClose: () => void;
  passageId: string | null;
}) {
  if (!open || !passageId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/30 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-[#dce7f2] bg-white">
        <div className="flex items-start justify-between border-b border-[#e6edf5] px-5 py-4">
          <div>
            <h3 className="text-xl font-semibold text-[#2f3f52]">Update Passage</h3>
            <p className="text-xs text-[#8ea1b4]">{passageId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#8ea1b5] hover:bg-[#f4f8fc]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4 text-sm text-[#5e768e]">
          Update flow is ready for the future endpoint.
        </div>

        <div className="flex justify-end border-t border-[#e6edf5] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#d4e2ef] px-4 py-2 text-sm text-[#556f88] hover:bg-[#f5f9fd]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PassagesPage() {
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { data, isLoading, isFetching, isError, error } = useGetPassagesQuery({
    page: 1,
    limit: 10,
    searchTerm: search.trim() || undefined,
  });

  useEffect(() => {
    if (!isError) return;
    toast.error(getErrorMessage(error, "Unable to load passages."));
  }, [error, isError]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const passages = data?.data ?? [];
    if (!q) return passages;
    return passages.filter(
      (r) =>
        r._id.toLowerCase().includes(q) ||
        r.passageCode.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div className="space-y-3">
      <section className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#3f5f7a]">Passage System</h2>
          <p className="text-sm text-[#7e95ab]">
            Manage shared text blocks linked to multiple questions
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpenAdd(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2f86d8] px-3 text-xs font-medium text-white hover:bg-[#2a78c6]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Passage
        </button>
      </section>

      <section className="flex items-start gap-2.5 rounded-lg border border-[#f5d97d] bg-[#fffbea] px-4 py-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#c48a2e]" />
        <div>
          <p className="text-xs font-semibold text-[#8a6120]">
            Critical Rule: A passage is NOT a question
          </p>
          <p className="mt-0.5 text-xs text-[#a07430]">
            A passage does not take a question number. It is a shared content block (text/image)
            displayed before its linked questions. Question numbering continues normally - the
            passage itself is not counted.
          </p>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#c8e6d5] bg-white p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#3ea666]" />
            <span className="text-sm font-semibold text-[#2d7a52]">Correct Implementation</span>
          </div>
          <div className="space-y-1.5 rounded-md border border-[#c8e6d5] bg-[#f1fbf5] p-3">
            {correctItems.map((item, i) => (
              <div
                key={i}
                className={
                  item.green
                    ? "text-xs font-medium text-[#2d7a52]"
                    : item.highlight
                      ? "flex items-center gap-1.5 text-xs font-medium text-[#4a93d9]"
                      : item.muted
                        ? "pl-4 text-xs text-[#90a3b6]"
                        : "pl-4 text-xs text-[#5e768e]"
                }
              >
                {item.highlight && !item.green && (
                  <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[#d6eaf6] text-[9px] font-bold text-[#2f86d8]">
                    P
                  </span>
                )}
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#f4d7d7] bg-white p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <XCircle className="h-4 w-4 text-[#db6f6f]" />
            <span className="text-sm font-semibold text-[#b04040]">Wrong Implementation</span>
          </div>
          <div className="space-y-1.5 rounded-md border border-[#f4d7d7] bg-[#fdf3f3] p-3">
            {wrongItems.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-[#c05050]">
                <span className="inline-flex h-4 w-5 shrink-0 items-center justify-center rounded bg-[#fde8e8] text-[9px] font-bold text-[#db6f6f]">
                  Q{i + 1}
                </span>
                <span className="line-through opacity-70">{item.label.replace(" — ", " ")}</span>
                <XCircle className="h-3 w-3 shrink-0 text-[#db6f6f]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[#dce7f2] bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-[#3f5f7a]">Passage Entity Fields</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {passageEntityFields.map((field) => (
            <div
              key={field.label}
              className="rounded-md border border-[#dce7f2] bg-[#f8fbff] p-2.5"
            >
              <p className="text-xs font-semibold text-[#3f5f7a]">{field.label}</p>
              {field.desc && <p className="mt-0.5 text-[10px] text-[#90a3b6]">{field.desc}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[#dce7f2] bg-white p-4">
        <div className="mb-3 flex items-center gap-1.5">
          <Smartphone className="h-4 w-4 text-[#4a93d9]" />
          <h3 className="text-sm font-semibold text-[#3f5f7a]">App Preview - Passage Display</h3>
        </div>
        <div className="text-sm text-[#5e768e]">Preview stays unchanged.</div>
      </section>

      <section className="rounded-lg border border-[#dce7f2] bg-white p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-[#9ab0c3]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search passages..."
            className="h-9 w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] pr-3 pl-8 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3] focus:border-[#2f86d8]"
          />
        </div>
      </section>

      <PassageTable
        rows={filteredRows}
        isLoading={isLoading || isFetching}
        onEdit={(id) => setEditId(id)}
      />

      <AddPassageModal open={openAdd} onClose={() => setOpenAdd(false)} />
      <UpdatePassageModal open={!!editId} passageId={editId} onClose={() => setEditId(null)} />
    </div>
  );
}
