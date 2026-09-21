import { cn } from "@/lib/utils";
import type { PremiumSubscription } from "@/types";
import { CalendarPlus, Clock, Eye, MoreHorizontal, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SubscriptionStatusBadge from "./SubscriptionStatusBadge";

const productBadgeClass: Record<string, string> = {
  Matura: "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]",
  Semimatura: "border-[#dce4f6] bg-[#edf0fb] text-[#748ccc]",
  "Medicine Entrance Exam": "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]",
  "Live Entrance Exam": "border-[#d4ece2] bg-[#e8f5ee] text-[#3aa86e]",
  "Economics Entrance Exam": "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]",
};

const planBadgeClass: Record<string, string> = {
  Yearly: "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]",
  Monthly: "border-[#e4ddf4] bg-[#f1edfb] text-[#8468c4]",
  "One-time": "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]",
};

const paymentBadgeClass: Record<string, string> = {
  Stripe: "border-[#dce4f6] bg-[#edf0fb] text-[#748ccc]",
  PayPal: "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]",
  Card: "border-[#dee8f2] bg-[#f2f6fb] text-[#6d839a]",
  Manual: "border-[#f0dfb9] bg-[#fff6e3] text-[#c48a2e]",
};

const fallbackBadge = "border-[#dee8f2] bg-[#f2f6fb] text-[#6d839a]";

type Props = {
  sub: PremiumSubscription;
  onView: (sub: PremiumSubscription) => void;
  onExtend: (sub: PremiumSubscription) => void;
  onCancel: (sub: PremiumSubscription) => void;
};

export default function TableRow({ sub, onView, onExtend, onCancel }: Props) {
  const [open, setOpen] = useState(false);
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

  return (
    <tr className="border-b border-[#ecf2f8] text-xs text-[#5e768e] last:border-b-0">
      {/* User */}
      <td className="px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8f2fc] text-[11px] font-semibold text-[#4b92d9]">
            {sub.initials.slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-[#4f6d87]">{sub.userName}</p>
            <p className="text-[11px] text-[#90a2b5]">{sub.userEmail}</p>
          </div>
        </div>
      </td>

      {/* Product */}
      <td className="px-4 py-3 sm:px-5">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[11px]",
            productBadgeClass[sub.product] ?? fallbackBadge
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {sub.product}
        </span>
      </td>

      {/* Plan Type */}
      <td className="px-4 py-3 sm:px-5">
        <span
          className={cn(
            "rounded-sm border px-2 py-0.5 text-[11px]",
            planBadgeClass[sub.planType] ?? fallbackBadge
          )}
        >
          {sub.planType}
        </span>
      </td>

      {/* Start Date */}
      <td className="px-4 py-3 whitespace-nowrap sm:px-5">{sub.startDate}</td>

      {/* Expiry Date */}
      <td className="px-4 py-3 sm:px-5">
        <p className={cn("whitespace-nowrap", sub.expiringWarning && "font-medium text-[#d6563c]")}>
          {sub.expiryDate}
        </p>
        {sub.expiringWarning && sub.daysRemaining !== undefined && (
          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#d6563c]">
            <Clock className="h-2.5 w-2.5" />
            {sub.daysRemaining}d left
          </p>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3 sm:px-5">
        <SubscriptionStatusBadge status={sub.status} />
      </td>

      {/* Payment */}
      <td className="px-4 py-3 sm:px-5">
        <span
          className={cn(
            "rounded-sm border px-2 py-0.5 text-[11px]",
            paymentBadgeClass[sub.payment] ?? fallbackBadge
          )}
        >
          {sub.payment}
        </span>
      </td>

      {/* Order ID */}
      <td className="px-4 py-3 font-mono text-[11px] sm:px-5">{sub.orderId}</td>

      {/* Actions */}
      <td className="px-4 py-3 sm:px-5">
        <div ref={menuRef} className="relative inline-flex">
          <button
            type="button"
            aria-label="Open row actions"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-[#7f95aa] hover:border-[#dce7f2] hover:bg-[#f8fbff]"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {open && (
            <div className="absolute top-8 right-0 z-20 w-48 rounded-xl border border-[#dce7f2] bg-white py-1.5">
              <button
                type="button"
                onClick={() => {
                  onView(sub);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#4f6d87] hover:bg-[#f8fbff]"
              >
                <Eye className="h-4 w-4 text-[#8fa2b5]" />
                View Subscription
              </button>
              <button
                type="button"
                onClick={() => {
                  onExtend(sub);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#3571d5] hover:bg-[#f3f8ff]"
              >
                <CalendarPlus className="h-4 w-4" />
                Extend Subscription
              </button>
              <button
                type="button"
                onClick={() => {
                  onCancel(sub);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#e24d4d] hover:bg-[#fff5f5]"
              >
                <XCircle className="h-4 w-4" />
                Cancel Subscription
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
