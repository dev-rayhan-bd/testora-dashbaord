"use client";

import {
  useCreatePassageMutation,
  useUpdatePassageMutation,
  type PassageItem,
} from "@/store/apis";
import {
  BookOpen,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  passage?: PassageItem | null;
  onClose: () => void;
}

export function AddEditPassageModal({ open, passage, onClose }: Props) {
  if (!open) return null;

  return (
    <PassageModalDialog
      key={passage?._id ?? "new"}
      passage={passage}
      onClose={onClose}
    />
  );
}

function PassageModalDialog({
  passage,
  onClose,
}: {
  passage?: PassageItem | null;
  onClose: () => void;
}) {
  const isEditing = !!passage;
  const [createPassage, { isLoading: isCreating }] = useCreatePassageMutation();
  const [updatePassage, { isLoading: isUpdating }] = useUpdatePassageMutation();
  const isSubmitting = isCreating || isUpdating;

  const [passageCode, setPassageCode] = useState(
    () => passage?.passageCode || `P-${Date.now().toString().slice(-4)}`
  );
  const [title, setTitle] = useState(() => passage?.title || "");
  const [content, setContent] = useState(() => passage?.content || "");
  const [passageImage, setPassageImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(
    () => passage?.passageImageUrl || null
  );
  const [isDragging, setIsDragging] = useState(false);

  const previewUrl = useMemo(() => {
    if (passageImage) return URL.createObjectURL(passageImage);
    return existingImageUrl;
  }, [passageImage, existingImageUrl]);

  useEffect(() => {
    return () => {
      if (passageImage && previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [passageImage, previewUrl]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setPassageImage(file);
      } else {
        toast.error("Please drop an image file (PNG, JPG, WebP)");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passageCode.trim()) {
      toast.error("Passage Code is required");
      return;
    }
    if (!title.trim()) {
      toast.error("Passage Title is required");
      return;
    }
    if (!content.trim()) {
      toast.error("Passage Content is required");
      return;
    }

    try {
      if (isEditing && passage) {
        await updatePassage({
          passageId: passage._id,
          passageCode: passageCode.trim().toUpperCase(),
          title: title.trim(),
          content: content.trim(),
          passage_image: passageImage || undefined,
        }).unwrap();
        toast.success("Passage updated successfully");
      } else {
        await createPassage({
          passageCode: passageCode.trim().toUpperCase(),
          title: title.trim(),
          content: content.trim(),
          passage_image: passageImage || undefined,
        }).unwrap();
        toast.success("Passage created successfully");
      }
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to save passage. Please check the fields.";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e293b]/45 p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#dce7f2] bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e7eef6] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef5fc] text-[#2563eb]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#273d52]">
                {isEditing ? "Edit Passage" : "Create Shared Passage"}
              </h3>
              <p className="text-xs text-[#71889e]">
                Passages are reusable text/image content blocks linked to multiple questions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-[#889fb4] transition-colors hover:bg-[#f1f6fb] hover:text-[#2d445b] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#48637e]">
                Passage Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={passageCode}
                onChange={(e) => setPassageCode(e.target.value)}
                placeholder="e.g. P-001"
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 font-mono text-xs text-[#2c445c] uppercase outline-none focus:border-[#7ab1e8] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[#48637e]">
                Passage Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Teksti Letrar: 'Gjenerali i Ushtrisë së Vdekur'"
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs text-[#2c445c] outline-none focus:border-[#7ab1e8] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#48637e]">
              Passage Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or write the entire passage text here..."
              className="w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] p-3 text-xs leading-relaxed text-[#2c445c] outline-none focus:border-[#7ab1e8] focus:bg-white"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#48637e]">
              Passage Image (Optional Diagram / Chart / Reading scan)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-colors ${
                isDragging
                  ? "border-[#2563eb] bg-[#eff6ff]"
                  : "border-[#d0e0f0] bg-[#f9fcff] hover:bg-[#f3f8fd]"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                id="passage_img_input"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setPassageImage(e.target.files[0]);
                  }
                }}
                className="sr-only"
              />

              {previewUrl ? (
                <div className="w-full space-y-3">
                  <div className="relative mx-auto max-h-56 overflow-hidden rounded-lg border border-[#dce7f2] bg-white text-center shadow-xs">
                    <Image
                      src={previewUrl}
                      alt="Passage preview"
                      width={600}
                      height={280}
                      className="mx-auto max-h-52 w-auto object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#48637e]">
                      {passageImage ? passageImage.name : "Current Image Attached"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPassageImage(null);
                        setExistingImageUrl(null);
                      }}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="passage_img_input"
                  className="flex cursor-pointer flex-col items-center gap-2 py-3 text-center"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf3fc] text-[#2563eb]">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#273d52]">
                      Click to upload or drag &amp; drop
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#869cb0]">
                      PNG, JPG, WebP (up to 5MB)
                    </p>
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 rounded-lg border border-[#dce7f2] bg-white px-3 py-1 text-xs font-medium text-[#48637e] shadow-xs">
                    <Upload className="h-3.5 w-3.5" />
                    Browse Files
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-[#e7eef6] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-[#6a829a] transition-colors hover:bg-[#f1f6fb] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#1d4ed8] active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving Passage...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Passage"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
