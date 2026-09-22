"use client";

import type { PremiumSubscription } from "@/types";
import { CalendarPlus, Loader2, X } from "lucide-react";
import { useState } from "react";
import { formatDate } from "./TableRow";

type Props = {
  open: boolean;
  sub: PremiumSubscription | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (days: number) => void;
};

const extensionOptions = [
  { label: "+7 days", days: 7 },
  { label: "+14 days", days: 14 },
  { label: "+30 days", days: 30 },
  { label: "+60 days", days: 60 },
  { label: "+90 days", days: 90 },
  { label: "+1 year", days: 365 },
];

export default function ExtendSubscriptionModal({
  open,
  sub,
  isLoading = false,
  onClose,
  onConfirm,
}: Props) {
  const [selected, setSelected] = useState<number>(30);

  if (!open || !sub) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-[#dce7f2] bg-white shadow-2xl">
        <div className="flex items-start justify-between px-5 py-4">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef4fd] text-[#347edb]">
              <CalendarPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#2f3f52]">Extend Subscription</h3>
              <p className="text-xs text-[#8ea1b4]">
                Add more days to this user&apos;s active subscription access.
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

        <div className="space-y-4 px-5 pb-4">
          <div className="rounded-xl border border-[#dce7f2] bg-[#f8fbff] p-3 text-xs">
            <p className="font-semibold text-[#3a546f]">{sub.userName}</p>
            <p className="text-[#879bb0]">{sub.userEmail}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#5e7790]">
              <span className="font-medium text-[#3f5f7a]">{sub.product}</span>
              <span>•</span>
              <span className="capitalize">{sub.planType}</span>
              <span>•</span>
              <span>Current Expiry: <strong>{formatDate(sub.expiryDate)}</strong></span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-[#4f6d87]">Select extension duration</p>
            <div className="grid grid-cols-3 gap-2">
              {extensionOptions.map((item) => (
                <button
                  key={item.days}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setSelected(item.days)}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all ${
                    selected === item.days
                      ? "border-[#6da5e0] bg-[#eef6fd] text-[#206fbe] shadow-xs ring-1 ring-[#6da5e0]/30"
                      : "border-[#dce7f2] bg-white text-[#5e768e] hover:border-[#cbdff2] hover:bg-[#f8fbff]"
                  } disabled:opacity-50`}
                >
                  {item.label}
                </button>
              ))}
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
            onClick={() => onConfirm(selected)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2f7fd1] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#256bb3] active:scale-95 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Extending...
              </>
            ) : (
              `Confirm Extension (+${selected}d)`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
