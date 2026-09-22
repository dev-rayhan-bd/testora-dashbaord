"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useDeleteSubjectMutation, type SubjectItem } from "@/store/apis";

interface Props {
  open: boolean;
  subject: SubjectItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteSubjectModal({
  open,
  subject,
  onClose,
  onSuccess,
}: Props) {
  const [deleteSubject, { isLoading }] = useDeleteSubjectMutation();

  if (!open || !subject) return null;

  const handleDelete = async () => {
    try {
      await deleteSubject(subject._id).unwrap();
      toast.success("Subject deleted successfully!");
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to delete subject. Please ensure no active tests rely on it.";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#dce7f2] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#f3e5e7] bg-[#fffbfb] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#273d52]">Delete Subject</h3>
              <p className="text-xs text-[#8e525a]">Permanent removal from system</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-[#7e95ab] hover:bg-[#f1f6fb] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-[#48637e]">
            Are you sure you want to delete the subject{" "}
            <span className="font-bold text-[#273d52]">“{subject.name}”</span>?
          </p>

          <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3.5 text-xs text-rose-800 space-y-1">
            <p className="font-semibold">⚠️ Attention:</p>
            <p className="text-[11px] leading-relaxed text-rose-700">
              Questions or tests currently tagged with this subject may need to be reassigned. This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-[#eaf0f7] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-[#6a829a] transition-colors hover:bg-[#f1f6fb] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-rose-700 active:scale-95 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Subject
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
