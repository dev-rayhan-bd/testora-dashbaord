"use client";

import { cn } from "@/lib/utils";
import type { PremiumSubscription } from "@/types";
import { CalendarPlus, CheckCircle2, Clock, Eye, MoreHorizontal, XCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SubscriptionStatusBadge from "./SubscriptionStatusBadge";

export function getDisplayProductName(product?: string, plan?: string): string {
  const p = (product || "").toLowerCase();
  const pl = (plan || "").toLowerCase();

  if (pl === "semi_matura" || p.includes("semi")) {
    return "Semimatura Package";
  }
  if (pl === "matura" || (p.includes("matura") && !p.includes("semi"))) {
    return "Matura Package";
  }
  if (pl === "provime" || p.includes("entrance") || p.includes("provime")) {
    return "Entrance Exam Package";
  }
  if (pl === "full-access" || p.includes("full")) {
    return "Full Access Package";
  }
  return product || "General Package";
}

const productBadgeClass: Record<string, string> = {
  "Semimatura Package": "border-[#dce4f6] bg-[#edf0fb] text-[#5b73cf]",
  "Matura Package": "border-[#d6e5f4] bg-[#eaf2fb] text-[#2c7cd1]",
  "Entrance Exam Package": "border-[#d5ece5] bg-[#e9f5f1] text-[#289278]",
  "Full Access Package": "border-[#fbe8ca] bg-[#fef7ec] text-[#c97720]",
  semi_matura: "border-[#dce4f6] bg-[#edf0fb] text-[#5b73cf]",
  matura: "border-[#d6e5f4] bg-[#eaf2fb] text-[#2c7cd1]",
  provime: "border-[#d5ece5] bg-[#e9f5f1] text-[#289278]",
  "full-access": "border-[#fbe8ca] bg-[#fef7ec] text-[#c97720]",
  Semimatura: "border-[#dce4f6] bg-[#edf0fb] text-[#5b73cf]",
  Matura: "border-[#d6e5f4] bg-[#eaf2fb] text-[#2c7cd1]",
};

const planBadgeClass: Record<string, string> = {
  yearly: "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]",
  monthly: "border-[#e4ddf4] bg-[#f1edfb] text-[#8468c4]",
  "one-time": "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]",
  Yearly: "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]",
  Monthly: "border-[#e4ddf4] bg-[#f1edfb] text-[#8468c4]",
  "One-time": "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]",
};

const paymentBadgeClass: Record<string, string> = {
  Stripe: "border-[#dce4f6] bg-[#edf0fb] text-[#748ccc]",
  PayPal: "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]",
  Card: "border-[#dee8f2] bg-[#f2f6fb] text-[#6d839a]",
  Apple: "border-[#dee8f2] bg-[#f2f6fb] text-[#3f5f7a]",
  "Google Play": "border-[#d0ecd9] bg-[#e9f8ef] text-[#3ea666]",
  Manual: "border-[#f0dfb9] bg-[#fff6e3] text-[#c48a2e]",
};

const fallbackBadge = "border-[#dee8f2] bg-[#f2f6fb] text-[#6d839a]";

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type Props = {
  sub: PremiumSubscription;
  isLastRow?: boolean;
  onView: (sub: PremiumSubscription) => void;
  onExtend: (sub: PremiumSubscription) => void;
  onCancel: (sub: PremiumSubscription) => void;
  onActivate: (sub: PremiumSubscription) => void;
};

export default function TableRow({ sub, isLastRow = false, onView, onExtend, onCancel, onActivate }: Props) {
  const [open, setOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials =
    sub.initials ||
    sub.userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    sub.userEmail.slice(0, 2).toUpperCase();

  const isExpiringSoon =
    sub.status.toLowerCase() === "active" &&
    sub.daysRemaining !== undefined &&
    sub.daysRemaining <= 30;

  return (
    <tr className="border-b border-[#ecf2f8] text-xs text-[#5e768e] transition-colors hover:bg-[#fcfdfe] last:border-b-0">
      {/* USER: user.fullName and user.email */}
      <td className="px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          {sub.userAvatar && !avatarError ? (
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[#dce7f2]">
              <Image
                src={sub.userAvatar}
                alt={sub.userName}
                fill
                className="object-cover"
                onError={() => setAvatarError(true)}
              />
            </div>
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f2fc] text-[11px] font-semibold text-[#4b92d9]">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-[#3f5f7a]">{sub.userName}</p>
            <p className="truncate text-[11px] text-[#90a2b5]">{sub.userEmail}</p>
          </div>
        </div>
      </td>

      {/* PRODUCT */}
      <td className="px-4 py-3 sm:px-5">
        {(() => {
          const displayProduct = getDisplayProductName(sub.product, sub.plan);
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
                productBadgeClass[displayProduct] ?? productBadgeClass[sub.product] ?? fallbackBadge
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {displayProduct}
            </span>
          );
        })()}
      </td>

      {/* PLAN TYPE */}
      <td className="px-4 py-3 sm:px-5">
        <span
          className={cn(
            "rounded-md border px-2.5 py-0.5 text-[11px] font-medium capitalize whitespace-nowrap",
            planBadgeClass[sub.planType] ?? fallbackBadge
          )}
        >
          {sub.planType}
        </span>
      </td>

      {/* START DATE */}
      <td className="px-4 py-3 whitespace-nowrap sm:px-5">
        <span className="text-[#4f6d87]">{formatDate(sub.startDate)}</span>
      </td>

      {/* EXPIRY DATE */}
      <td className="px-4 py-3 sm:px-5">
        <p className={cn("whitespace-nowrap", isExpiringSoon && "font-medium text-[#d6563c]")}>
          {formatDate(sub.expiryDate)}
        </p>
        {isExpiringSoon && sub.daysRemaining !== undefined && (
          <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-[#fbd4cf] bg-[#fdf2f0] px-2 py-0.5 text-[10px] font-semibold text-[#d6563c]">
            <Clock className="h-2.5 w-2.5" />
            {sub.daysRemaining}d left
          </span>
        )}
      </td>

      {/* STATUS */}
      <td className="px-4 py-3 sm:px-5">
        <SubscriptionStatusBadge status={sub.status} />
      </td>

      {/* PAYMENT */}
      <td className="px-4 py-3 sm:px-5">
        <span
          className={cn(
            "rounded-md border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
            paymentBadgeClass[sub.payment] ?? fallbackBadge
          )}
        >
          {sub.payment}
        </span>
      </td>

      {/* ORDER ID */}
      <td className="px-4 py-3 font-mono text-[11px] text-[#5e768e] sm:px-5">
        {sub.orderId}
      </td>

      {/* ACTIONS */}
      <td className="relative px-4 py-3 sm:px-5">
        <div ref={menuRef} className="relative inline-flex">
          <button
            type="button"
            aria-label="Open row actions"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-[#7f95aa] transition-colors hover:border-[#dce7f2] hover:bg-[#f8fbff] hover:text-[#3f5f7a]"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {open && (
            <div
              className={cn(
                "absolute right-0 z-50 w-48 rounded-xl border border-[#dce7f2] bg-white py-1.5 shadow-lg shadow-slate-200/50",
                isLastRow ? "bottom-8" : "top-8"
              )}
            >
              <button
                type="button"
                onClick={() => {
                  onView(sub);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[#4f6d87] transition-colors hover:bg-[#f8fbff]"
              >
                <Eye className="h-3.5 w-3.5 text-[#8fa2b5]" />
                View Details
              </button>
              <button
                type="button"
                onClick={() => {
                  onExtend(sub);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[#3571d5] transition-colors hover:bg-[#f3f8ff]"
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                Extend Subscription
              </button>
              {sub.status.toLowerCase() === "cancelled" || sub.status.toLowerCase() === "expired" ? (
                <button
                  type="button"
                  onClick={() => {
                    onActivate(sub);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[#268a4c] transition-colors hover:bg-[#eef8f2]"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Activate Subscription
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onCancel(sub);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[#e24d4d] transition-colors hover:bg-[#fff5f5]"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Cancel Subscription
                </button>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
