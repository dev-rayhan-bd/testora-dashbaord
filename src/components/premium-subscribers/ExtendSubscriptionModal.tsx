"use client";

import type { PremiumSubscription } from "@/types";
import { CalendarPlus, X } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  sub: PremiumSubscription | null;
  onClose: () => void;
  onConfirm: (days: number, note: string) => void;
};

const options = [
  { label: "+1 day", days: 1 },
  { label: "+7 days", days: 7 },
  { label: "+30 days", days: 30 },
  { label: "+3 months", days: 90 },
  { label: "+6 months", days: 180 },
  { label: "+1 year", days: 365 },
];

export default function ExtendSubscriptionModal({ open, sub, onClose, onConfirm }: Props) {
  const [selected, setSelected] = useState<number>(30);
  const [note, setNote] = useState("");

  if (!open || !sub) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/30 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#dce7f2] bg-white">
        <div className="flex items-start justify-between px-5 py-4">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-[#eef4fd] text-[#4b92d9]">
              <CalendarPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#2f3f52]">Extend Subscription</h3>
              <p className="text-sm text-[#8ea1b4]">
                Add more time to the user&apos;s subscription
              </p>
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

        <div className="space-y-4 px-5 pb-4">
          <div className="rounded-lg border border-[#dce7f2] bg-[#f8fbff] p-3">
            <p className="font-medium text-[#4f6d87]">{sub.userName}</p>
            <p className="text-xs text-[#90a2b5]">
              {sub.product} • Current expiry: {sub.expiryDate}
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-[#4f6d87]">Select extension period</p>
            <div className="grid grid-cols-3 gap-2">
              {options.map((item) => (
                <button
                  key={item.days}
                  type="button"
                  onClick={() => setSelected(item.days)}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium ${
                    selected === item.days
                      ? "border-[#8fc0ef] bg-[#ecf5fe] text-[#3571d5]"
                      : "border-[#dce7f2] bg-white text-[#5e768e] hover:bg-[#f8fbff]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-[#4f6d87]">
              Admin note <span className="text-[#8ea1b4]">(optional)</span>
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Reason for extension..."
              className="w-full resize-none rounded-xl border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-sm text-[#4f6d87] outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#e6edf5] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-[#6f8194] hover:bg-[#f5f9fd]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(selected, note);
              setNote("");
            }}
            className="rounded-md bg-[#7ab5ef] px-4 py-2 text-sm font-semibold text-white"
          >
            Confirm Extension
          </button>
        </div>
      </div>
    </div>
  );
}
