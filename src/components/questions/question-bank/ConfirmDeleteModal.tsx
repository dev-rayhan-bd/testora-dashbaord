import { AlertTriangle, Loader2, X } from "lucide-react";

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDeleteModal({
  open,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete? This action cannot be undone.",
  isLoading = false,
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-200">
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

          <h2 className="mb-1 text-lg font-bold text-[#1e293b]">{title}</h2>
          <p className="mb-6 text-sm text-[#475569]">
            {description}
          </p>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-[#f0f4f9] py-2.5 text-sm font-semibold text-[#48637e] transition-colors hover:bg-[#e2e8f0] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-rose-700 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
