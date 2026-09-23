import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useDeleteDepartmentMutation, type DepartmentItem } from "@/store/apis";

interface Props {
  open: boolean;
  department: DepartmentItem | null;
  onClose: () => void;
}

export function DeleteDepartmentModal({ open, department, onClose }: Props) {
  const [deleteDepartment, { isLoading }] = useDeleteDepartmentMutation();

  if (!open || !department) return null;

  const handleDelete = async () => {
    try {
      await deleteDepartment(department._id).unwrap();
      toast.success("Department deleted successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete department");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#8ba3b9] transition-colors hover:bg-[#f0f4f9] hover:text-[#48637e] disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
            <AlertTriangle className="h-7 w-7 text-rose-500" />
          </div>

          <h2 className="mb-1 text-lg font-bold text-[#1e293b]">Delete Department?</h2>
          <p className="mb-6 text-sm text-[#475569]">
            Are you sure you want to delete <span className="font-semibold text-[#0f172a]">{department.name}</span>? This action cannot be undone.
          </p>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-[#f1f5f9] px-4 py-2.5 text-sm font-semibold text-[#475569] transition-colors hover:bg-[#e2e8f0] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-600 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
