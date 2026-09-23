"use client";

import { useState } from "react";
import { Loader2, Plus, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  type SubjectItem,
} from "@/store/apis";

interface Props {
  open: boolean;
  subjectToEdit?: SubjectItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddEditSubjectModal({
  open,
  subjectToEdit,
  onClose,
  onSuccess,
}: Props) {
  if (!open) return null;

  return (
    <SubjectFormDialog
      key={subjectToEdit?._id ?? "new"}
      subjectToEdit={subjectToEdit}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

function SubjectFormDialog({
  subjectToEdit,
  onClose,
  onSuccess,
}: {
  subjectToEdit?: SubjectItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const isEditing = !!subjectToEdit;
  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();
  const isSubmitting = isCreating || isUpdating;

  // Form State
  const [name, setName] = useState(() => subjectToEdit?.name || "");
  const [examType, setExamType] = useState<string>(
    () => subjectToEdit?.examType || "matura"
  );
  const [nameInEnglish, setNameInEnglish] = useState(
    () => subjectToEdit?.nameInEnglish || ""
  );
  const [nameInAlbanian, setNameInAlbanian] = useState(
    () => subjectToEdit?.nameInAlbanian || ""
  );
  const [isElective, setIsElective] = useState<boolean>(
    () => Boolean(subjectToEdit?.isElective)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Subject name is required");
      return;
    }

    try {
      if (isEditing && subjectToEdit) {
        await updateSubject({
          subjectId: subjectToEdit._id,
          name: name.trim(),
          examType,
          nameInEnglish: nameInEnglish.trim() || undefined,
          nameInAlbanian: nameInAlbanian.trim() || undefined,
          isElective,
        }).unwrap();
        toast.success("Subject updated successfully!");
      } else {
        await createSubject({
          name: name.trim(),
          examType,
          nameInEnglish: nameInEnglish.trim() || undefined,
          nameInAlbanian: nameInAlbanian.trim() || undefined,
          isElective,
        }).unwrap();
        toast.success("Subject added successfully!");
      }

      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        `Failed to ${isEditing ? "update" : "create"} subject.`;
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#dce7f2] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e6edf5] bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d5e2f7] bg-[#edf4fe] text-[#2563eb]">
              {isEditing ? (
                <Sparkles className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#273d52]">
                {isEditing ? "Edit Subject" : "Create New Subject"}
              </h3>
              <p className="text-xs text-[#71889e]">
                {isEditing
                  ? "Update subject details and elective configurations"
                  : "Define a curriculum subject with localization for state exams"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-[#7e95ab] hover:bg-[#f1f6fb] hover:text-[#2f4256] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Subject Name */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3f5f7a]">
              Subject Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Matematikë or Gjuhë Shqipe"
              className="h-10 w-full rounded-xl border border-[#dce7f2] bg-[#f8fbff] px-3.5 text-sm text-[#273d52] placeholder:text-[#9bb0c4] outline-none transition-all focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/10"
            />
          </div>

          {/* Exam Type */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3f5f7a]">
              Exam Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#dce7f2] bg-[#f8fbff] px-3 text-sm text-[#273d52] outline-none transition-all focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/10"
            >
              <option value="matura">Matura (State High School Exit)</option>
              <option value="semi_matura">Semimatura (Grade 9 State Exam)</option>
              <option value="provime">Entrance Exam / Provime Pranuese</option>
            </select>
          </div>

          {/* Translations Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#3f5f7a]">
                Name in English <span className="text-xs font-normal text-[#8ba3b9]">(Optional)</span>
              </label>
              <input
                type="text"
                value={nameInEnglish}
                onChange={(e) => setNameInEnglish(e.target.value)}
                placeholder="e.g. Mathematics"
                className="h-10 w-full rounded-xl border border-[#dce7f2] bg-[#f8fbff] px-3.5 text-sm text-[#273d52] placeholder:text-[#9bb0c4] outline-none transition-all focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#3f5f7a]">
                Name in Albanian <span className="text-xs font-normal text-[#8ba3b9]">(Optional)</span>
              </label>
              <input
                type="text"
                value={nameInAlbanian}
                onChange={(e) => setNameInAlbanian(e.target.value)}
                placeholder="e.g. Matematikë"
                className="h-10 w-full rounded-xl border border-[#dce7f2] bg-[#f8fbff] px-3.5 text-sm text-[#273d52] placeholder:text-[#9bb0c4] outline-none transition-all focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/10"
              />
            </div>
          </div>

          {/* Elective Toggle Card */}
          <div className="rounded-xl border border-[#dce7f2] bg-[#f9fcff] p-3.5 transition-colors hover:bg-[#f3f8fd]">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={isElective}
                onChange={(e) => setIsElective(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#b9cfdc] text-[#2563eb] focus:ring-[#2563eb]"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#273d52]">
                  Elective Choice Subject
                </span>
                <p className="text-[11px] text-[#71889e]">
                  Check if this subject is an optional/elective choice in the exam (instead of a core mandatory subject).
                </p>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-[#eaf0f7] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-[#6a829a] transition-colors hover:bg-[#f1f6fb] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563eb] px-5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#1d4ed8] active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving Subject...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Subject"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
