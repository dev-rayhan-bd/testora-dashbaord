"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useAddFacultyMutation, useUpdateFacultyMutation, type FacultyItem } from "@/store/apis";

interface Props {
  open: boolean;
  facultyToEdit: FacultyItem | null;
  onClose: () => void;
}

export function AddEditFacultyModal({ open, facultyToEdit, onClose }: Props) {
  if (!open) return null;

  return (
    <FacultyModalDialog
      key={facultyToEdit?._id ?? "new"}
      facultyToEdit={facultyToEdit}
      onClose={onClose}
    />
  );
}

function FacultyModalDialog({
  facultyToEdit,
  onClose,
}: {
  facultyToEdit: FacultyItem | null;
  onClose: () => void;
}) {
  const isEditing = !!facultyToEdit;
  const [addFaculty, { isLoading: isAdding }] = useAddFacultyMutation();
  const [updateFaculty, { isLoading: isUpdating }] = useUpdateFacultyMutation();
  const isSubmitting = isAdding || isUpdating;

  // Form State
  const [name, setName] = useState(facultyToEdit?.name || "");
  const [nameInEnglish, setNameInEnglish] = useState(facultyToEdit?.nameInEnglish || "");
  const [nameInAlbanian, setNameInAlbanian] = useState(facultyToEdit?.nameInAlbanian || "");

  const [errors, setErrors] = useState<{ name?: string }>({});

  const validate = () => {
    const newErrors: { name?: string } = {};
    if (!name.trim()) newErrors.name = "Faculty name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditing && facultyToEdit) {
        await updateFaculty({
          facultyId: facultyToEdit._id,
          name: name.trim(),
          nameInEnglish: nameInEnglish.trim() || undefined,
          nameInAlbanian: nameInAlbanian.trim() || undefined,
        }).unwrap();
        toast.success("Faculty updated successfully!");
      } else {
        await addFaculty({
          name: name.trim(),
          nameInEnglish: nameInEnglish.trim() || undefined,
          nameInAlbanian: nameInAlbanian.trim() || undefined,
        }).unwrap();
        toast.success("Faculty created successfully!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save faculty");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />
      <div className="relative w-full max-w-md scale-100 opacity-100 rounded-2xl bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eef2f6] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0f6fc]">
              <Plus className="h-4 w-4 text-[#2563eb]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1e293b]">
                {isEditing ? "Edit Faculty" : "Add New Faculty"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full p-1.5 text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a] disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] overflow-y-auto p-5">
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#334155]">
                  Faculty Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  className={`h-9 w-full rounded-lg border px-3 text-xs text-[#0f172a] outline-none transition-colors focus:border-[#2563eb] ${
                    errors.name ? "border-rose-300 bg-rose-50" : "border-[#cbd5e1] bg-white"
                  }`}
                  placeholder="e.g. Faculty of Engineering"
                />
                {errors.name && (
                  <p className="mt-1 text-[10px] text-rose-500">{errors.name}</p>
                )}
              </div>

              {/* Translation English */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#334155]">
                  English Translation (Optional)
                </label>
                <input
                  type="text"
                  value={nameInEnglish}
                  onChange={(e) => setNameInEnglish(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#cbd5e1] bg-white px-3 text-xs text-[#0f172a] outline-none transition-colors focus:border-[#2563eb]"
                  placeholder="e.g. Faculty of Engineering"
                />
              </div>

              {/* Translation Albanian */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#334155]">
                  Albanian Translation (Optional)
                </label>
                <input
                  type="text"
                  value={nameInAlbanian}
                  onChange={(e) => setNameInAlbanian(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#cbd5e1] bg-white px-3 text-xs text-[#0f172a] outline-none transition-colors focus:border-[#2563eb]"
                  placeholder="e.g. Fakulteti i Inxhinierisë"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-[#eef2f6] px-5 py-4 bg-[#f8fafc] rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-[#475569] transition-colors hover:bg-[#e2e8f0] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-[90px] items-center justify-center gap-1.5 rounded-lg bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Add Faculty"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
