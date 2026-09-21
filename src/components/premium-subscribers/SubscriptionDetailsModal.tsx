"use client";

import type { PremiumSubscription } from "@/types";
import { BookOpen, CalendarDays, CreditCard, Hash, X } from "lucide-react";

type Props = {
  open: boolean;
  sub: PremiumSubscription | null;
  onClose: () => void;
};

function remainingDays(expiryDate: string) {
  const end = new Date(expiryDate).getTime();
  const now = new Date().getTime();
  return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
}

export default function SubscriptionDetailsModal({ open, sub, onClose }: Props) {
  if (!open || !sub) return null;

  const days = sub.daysRemaining ?? remainingDays(sub.expiryDate);

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-[#2d4056]/35 p-4 md:justify-start md:pl-52">
      <div className="h-full w-full max-w-md overflow-y-auto border-r border-[#dce7f2] bg-white">
        <div className="flex items-start justify-between border-b border-[#e6edf5] px-5 py-4">
          <h3 className="text-3xl font-semibold text-[#2f3f52]">Subscription Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#8ea1b5] hover:bg-[#f4f8fc]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f2fc] text-sm font-semibold text-[#4b92d9]">
              {sub.initials}
            </div>
            <div>
              <p className="text-xl font-semibold text-[#2f3f52]">{sub.userName}</p>
              <p className="text-sm text-[#90a2b5]">{sub.userEmail}</p>
              <p className="mt-1 text-sm text-[#2f9960]">• {sub.status}</p>
            </div>
          </div>

          <div className="rounded-xl border border-[#d3e2f3] bg-[#eef5fc] p-3">
            <p className="text-[11px] font-semibold tracking-wide text-[#8aa3bb] uppercase">
              Product
            </p>
            <p className="text-xl font-medium text-[#3571d5]">{sub.product}</p>
          </div>

          <div className="rounded-xl border border-[#dce7f2] bg-white">
            <div className="flex items-center gap-2 border-b border-[#ecf2f8] px-3 py-2 text-sm text-[#7f94a8]">
              <BookOpen className="h-4 w-4" />
              Plan Type
            </div>
            <p className="px-3 pb-3 text-xl font-medium text-[#445a73]">{sub.planType}</p>

            <div className="flex items-center gap-2 border-t border-b border-[#ecf2f8] px-3 py-2 text-sm text-[#7f94a8]">
              <CalendarDays className="h-4 w-4" />
              Start Date
            </div>
            <p className="px-3 pb-3 text-xl font-medium text-[#445a73]">{sub.startDate}</p>

            <div className="flex items-center gap-2 border-t border-b border-[#ecf2f8] px-3 py-2 text-sm text-[#7f94a8]">
              <CalendarDays className="h-4 w-4" />
              Expiry Date
            </div>
            <p className="px-3 pb-3 text-xl font-medium text-[#445a73]">{sub.expiryDate}</p>

            <div className="flex items-center gap-2 border-t border-b border-[#ecf2f8] px-3 py-2 text-sm text-[#7f94a8]">
              <CreditCard className="h-4 w-4" />
              Payment Method
            </div>
            <p className="px-3 pb-3 text-xl font-medium text-[#445a73]">{sub.payment}</p>

            <div className="flex items-center gap-2 border-t border-b border-[#ecf2f8] px-3 py-2 text-sm text-[#7f94a8]">
              <Hash className="h-4 w-4" />
              Order ID
            </div>
            <p className="px-3 pb-3 font-mono text-sm font-semibold text-[#445a73]">
              {sub.orderId}
            </p>
          </div>

          <div className="rounded-xl border border-[#c7dbf2] bg-[#eef5fd] px-3 py-2.5">
            <p className="text-2xl font-semibold text-[#3571d5]">{days} days remaining</p>
            <p className="text-sm text-[#78a1cb]">Until subscription expiry</p>
          </div>
        </div>
      </div>
    </div>
  );
}
