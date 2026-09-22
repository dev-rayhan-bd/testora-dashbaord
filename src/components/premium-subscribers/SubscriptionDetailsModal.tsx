"use client";

import type { PremiumSubscription } from "@/types";
import { BookOpen, CalendarDays, CreditCard, Hash, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import SubscriptionStatusBadge from "./SubscriptionStatusBadge";
import { formatDate, getDisplayProductName } from "./TableRow";

type Props = {
  open: boolean;
  sub: PremiumSubscription | null;
  onClose: () => void;
  onActivate?: (sub: PremiumSubscription) => void;
  onCancel?: (sub: PremiumSubscription) => void;
  onExtend?: (sub: PremiumSubscription) => void;
};

export default function SubscriptionDetailsModal({
  open,
  sub,
  onClose,
  onActivate,
  onCancel,
  onExtend,
}: Props) {
  const [avatarError, setAvatarError] = useState(false);

  if (!open || !sub) return null;

  const initials =
    sub.initials ||
    sub.userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    sub.userEmail.slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#dce7f2] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e6edf5] px-6 py-4">
          <h3 className="text-lg font-bold text-[#2f3f52]">Subscription Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#8ea1b5] transition-colors hover:bg-[#f4f8fc] hover:text-[#3f5f7a]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {/* User Info */}
          <div className="flex items-center justify-between rounded-xl border border-[#dce7f2] bg-[#f8fbff] p-3.5">
            <div className="flex items-center gap-3">
              {sub.userAvatar && !avatarError ? (
                <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[#dce7f2]">
                  <Image
                    src={sub.userAvatar}
                    alt={sub.userName}
                    fill
                    className="object-cover"
                    onError={() => setAvatarError(true)}
                  />
                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f2fc] text-sm font-bold text-[#3571d5]">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-[#2f3f52]">{sub.userName}</p>
                <p className="text-xs text-[#8297ab]">{sub.userEmail}</p>
              </div>
            </div>
            <SubscriptionStatusBadge status={sub.status} />
          </div>

          {/* Product card */}
          <div className="rounded-xl border border-[#d3e2f3] bg-[#eef5fc] p-3.5">
            <p className="text-[10px] font-bold tracking-wider text-[#7994ac] uppercase">
              Target Product
            </p>
            <p className="mt-0.5 text-base font-bold text-[#236bb5]">
              {getDisplayProductName(sub.product, sub.plan)}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#dce7f2] bg-white p-3">
              <div className="flex items-center gap-1.5 text-xs text-[#7f94a8]">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="font-medium">Plan Type</span>
              </div>
              <p className="mt-1 text-sm font-semibold capitalize text-[#3f5f7a]">{sub.planType}</p>
            </div>

            <div className="rounded-xl border border-[#dce7f2] bg-white p-3">
              <div className="flex items-center gap-1.5 text-xs text-[#7f94a8]">
                <CreditCard className="h-3.5 w-3.5" />
                <span className="font-medium">Payment</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-[#3f5f7a]">{sub.payment}</p>
            </div>

            <div className="rounded-xl border border-[#dce7f2] bg-white p-3">
              <div className="flex items-center gap-1.5 text-xs text-[#7f94a8]">
                <CalendarDays className="h-3.5 w-3.5" />
                <span className="font-medium">Start Date</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[#3f5f7a]">{formatDate(sub.startDate)}</p>
            </div>

            <div className="rounded-xl border border-[#dce7f2] bg-white p-3">
              <div className="flex items-center gap-1.5 text-xs text-[#7f94a8]">
                <CalendarDays className="h-3.5 w-3.5" />
                <span className="font-medium">Expiry Date</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[#3f5f7a]">{formatDate(sub.expiryDate)}</p>
            </div>
          </div>

          {/* Order ID */}
          <div className="flex items-center justify-between rounded-xl border border-[#dce7f2] bg-white px-3.5 py-2.5">
            <div className="flex items-center gap-2 text-xs text-[#7f94a8]">
              <Hash className="h-3.5 w-3.5" />
              <span className="font-medium">Order ID</span>
            </div>
            <span className="font-mono text-xs font-semibold text-[#445a73]">{sub.orderId}</span>
          </div>

          {/* Days Left badge if available */}
          {sub.daysRemaining !== undefined && (
            <div className="flex items-center justify-between rounded-xl border border-[#c7dbf2] bg-[#eef5fd] px-4 py-3">
              <div>
                <p className="text-sm font-bold text-[#276eb7]">
                  {sub.daysRemaining} days remaining
                </p>
                <p className="text-xs text-[#78a1cb]">Until subscription package expires</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#e6edf5] px-6 py-3.5">
          <div className="flex items-center gap-2">
            {onExtend && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExtend(sub);
                }}
                className="rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-xs font-semibold text-[#3571d5] transition-colors hover:bg-[#edf5fc]"
              >
                Extend
              </button>
            )}
            {sub.status.toLowerCase() === "cancelled" || sub.status.toLowerCase() === "expired" ? (
              onActivate && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onActivate(sub);
                  }}
                  className="rounded-lg border border-[#cbe8d5] bg-[#edf8f2] px-3 py-2 text-xs font-semibold text-[#258d4e] transition-colors hover:bg-[#dcf3e5]"
                >
                  Activate Subscription
                </button>
              )
            ) : (
              onCancel && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onCancel(sub);
                  }}
                  className="rounded-lg border border-[#f5d9d9] bg-[#fff3f3] px-3 py-2 text-xs font-semibold text-[#d44848] transition-colors hover:bg-[#fee7e7]"
                >
                  Cancel Subscription
                </button>
              )
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#2f7fd1] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#256bb3]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
