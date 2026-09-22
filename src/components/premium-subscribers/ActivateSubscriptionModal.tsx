"use client";

import type { PremiumSubscription } from "@/types";
import { CheckCircle2, Loader2, X } from "lucide-react";

type Props = {
  open: boolean;
  sub: PremiumSubscription | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ActivateSubscriptionModal({
  open,
  sub,
  isLoading = false,
  onClose,
  onConfirm,
}: Props) {
  if (!open || !sub) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-[#dce7f2] bg-white shadow-2xl">
        <div className="flex items-start justify-between px-5 py-4">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#e9f8ef] text-[#3ea666]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#2f3f52]">Activate Subscription</h3>
              <p className="text-xs text-[#8ea1b4]">
                This will reactivate the subscription and restore active access.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1 text-[#8ea1b5] transition-colors hover:bg-[#f4f8fc] hover:text-[#3f5f7a] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pb-4">
          <div className="rounded-xl border border-[#dce7f2] bg-[#f8fbff] p-3.5 text-xs text-[#4f6d87]">
            <p className="font-semibold text-[#37526d]">{sub.userName}</p>
            <p className="text-[#889cb0]">{sub.userEmail}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#5e7790]">
              <span className="font-medium text-[#3f5f7a]">{sub.product}</span>
              <span>•</span>
              <span className="capitalize">{sub.planType}</span>
              <span>•</span>
              <span className="font-mono">{sub.orderId}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#e6edf5] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-[#6f8194] transition-colors hover:bg-[#f5f9fd] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#389b5f] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#2e834f] active:scale-95 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Activating...
              </>
            ) : (
              "Confirm Activation"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
