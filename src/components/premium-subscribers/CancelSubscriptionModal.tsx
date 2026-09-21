"use client";

import type { PremiumSubscription } from "@/types";
import { AlertOctagon, X } from "lucide-react";

type Props = {
  open: boolean;
  sub: PremiumSubscription | null;
  onClose: () => void;
  onConfirm: () => void;
};

export default function CancelSubscriptionModal({ open, sub, onClose, onConfirm }: Props) {
  if (!open || !sub) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/30 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#dce7f2] bg-white">
        <div className="flex items-start justify-between px-5 py-4">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-[#fdeeee] text-[#db6f6f]">
              <AlertOctagon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#2f3f52]">Cancel Subscription</h3>
              <p className="text-sm text-[#8ea1b4]">This action cannot be undone.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#8ea1b5] hover:bg-[#f4f8fc]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pb-4">
          <div className="rounded-lg border border-[#dce7f2] bg-[#f8fbff] p-3 text-sm text-[#4f6d87]">
            <p className="font-medium">{sub.userName}</p>
            <p className="text-[#90a2b5]">
              {sub.product} • {sub.planType}
            </p>
            <p className="mt-1 text-xs text-[#90a2b5]">Order ID: {sub.orderId}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#e6edf5] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-[#6f8194] hover:bg-[#f5f9fd]"
          >
            Keep Active
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-[#e55f5f] px-4 py-2 text-sm font-semibold text-white"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
