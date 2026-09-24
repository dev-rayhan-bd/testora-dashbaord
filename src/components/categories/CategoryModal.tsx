"use client";

import { useState, useRef, useEffect } from "react";
import { X, Loader2, Image as ImageIcon, Upload } from "lucide-react";
import { useAddCategoryMutation, useUpdateCategoryMutation, ICategory } from "@/store/apis/categoryApi";
import { toast } from "sonner";

interface Props {
  open: boolean;
  category: ICategory | null;
  onClose: () => void;
}

export default function CategoryModal({ open, category, onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setIsActive(category.isActive ?? true);
      setPreviewUrl(category.image || null);
      setImageFile(null);
    } else {
      setName("");
      setDescription("");
      setIsActive(true);
      setPreviewUrl(null);
      setImageFile(null);
    }
  }, [category, open]);

  if (!open) return null;

  const isSaving = isAdding || isUpdating;
  const isEditing = !!category;

  const handleFile = (file: File | null) => {
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    const formData = new FormData();
    const dataObj = {
      name: name.trim(),
      description: description.trim(),
      isActive,
    };
    
    // IMPORTANT: The backend expects the fields inside a stringified "data" property
    formData.append("data", JSON.stringify(dataObj));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (isEditing) {
        await updateCategory({ id: category._id, formData }).unwrap();
        toast.success("Category updated successfully!");
      } else {
        await addCategory(formData).unwrap();
        toast.success("Category created successfully!");
      }
      onClose();
    } catch (err: any) {
      if (err?.data?.errors && typeof err.data.errors === 'object') {
        const errorMessages = Object.values(err.data.errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
      } else {
        toast.error(err?.data?.message || "Something went wrong.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5eff8] px-6 py-4">
          <h2 className="text-lg font-bold text-[#1e293b]">
            {isEditing ? "Edit Category" : "Add New Category"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="rounded-full p-1.5 text-[#8ba3b9] hover:bg-[#f0f4f9] hover:text-[#48637e] transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#587189]">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Entrance Exams"
                required
                className="w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3] focus:border-[#2f86d8]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#587189]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description for this category..."
                rows={3}
                className="w-full resize-none rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3] focus:border-[#2f86d8]"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#3f5f7a]">Status</p>
                <p className="text-xs text-[#7e95ab]">Enable or disable this category</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <div className="peer h-5 w-9 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#587189]">
                Thumbnail Image
              </label>
              {previewUrl ? (
                <div className="relative overflow-hidden rounded-lg border border-[#dce7f2] h-40">
                  <img src={previewUrl} alt="thumbnail preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-rose-500 hover:bg-white backdrop-blur-sm transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#c0d8ee] bg-[#f8fbff] py-8 text-center hover:border-[#2f86d8] hover:bg-[#f0f7fe] transition-colors"
                >
                  <ImageIcon className="h-8 w-8 text-[#b4cfe8]" />
                  <p className="mt-2 text-sm text-[#7e95ab]">Click to upload image</p>
                  <p className="text-xs text-[#90a3b6]">JPG, PNG · Max 3MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#e5eff8]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-md border border-[#dce7f2] bg-white px-4 py-2 text-xs font-semibold text-[#587189] hover:bg-[#f8fbff] disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center rounded-md bg-[#2f86d8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2a78c6] disabled:opacity-50 transition-colors min-w-[90px]"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
