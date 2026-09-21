"use client";

import StatusBadge from "@/components/users/StatusBadge";
import { AlertOctagon, CheckCircle2, Loader2, PauseCircle, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { UserManagementRow } from "./UserRow";

export type StatusActionType = "block" | "unblock" | "disable";

type Props = {
  open: boolean;
  user: UserManagementRow | null;
  actionType: StatusActionType;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (targetStatus: "active" | "blocked" | "disabled", reason?: string) => void;
};

const blockReasons = [
  "Violation of platform community guidelines",
  "Spamming or inappropriate content submissions",
  "Failed or disputed payment charges",
  "Suspected account sharing or security risk",
  "Administrative review",
];

export default function StatusActionModal({
  open,
  user,
  actionType,
  isSubmitting = false,
  onClose,
  onConfirm,
}: Props) {
  const [selectedReason, setSelectedReason] = useState(blockReasons[0]);
  const [customReason, setCustomReason] = useState("");

  if (!open || !user) return null;

  const isBlock = actionType === "block";
  const isUnblock = actionType === "unblock";
  const isDisable = actionType === "disable";

  const targetStatus: "active" | "blocked" | "disabled" = isBlock
    ? "blocked"
    : isUnblock
      ? "active"
      : "disabled";

  const handleConfirm = () => {
    const finalReason = isBlock
      ? customReason.trim() || selectedReason
      : undefined;
    onConfirm(targetStatus, finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-xs ${
                isBlock
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : isUnblock
                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                    : "border-amber-200 bg-amber-50 text-amber-600"
              }`}
            >
              {isBlock && <AlertOctagon className="h-5 w-5" />}
              {isUnblock && <CheckCircle2 className="h-5 w-5" />}
              {isDisable && <PauseCircle className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {isBlock && "Block User Account"}
                {isUnblock && "Unblock & Activate Account"}
                {isDisable && "Deactivate / Put on Hold"}
              </h3>
              <p className="text-xs text-slate-500">
                {isBlock && "Prevent user from logging in and accessing platform resources"}
                {isUnblock && "Restore complete platform access and active student status"}
                {isDisable && "Temporarily disable access without a permanent block record"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 px-6 py-5">
          {/* User Card */}
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#f8fbff] p-3.5">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border border-slate-200 object-cover shadow-xs"
                  unoptimized
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-100 text-xs font-bold text-[#2f86d8] shadow-xs">
                  {user.initials}
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Status</span>
              <StatusBadge status={user.status} />
            </div>
          </div>

          {/* Warning / Explanation banner */}
          <div
            className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
              isBlock
                ? "border-rose-200/80 bg-rose-50/60 text-rose-800"
                : isUnblock
                  ? "border-emerald-200/80 bg-emerald-50/60 text-emerald-800"
                  : "border-amber-200/80 bg-amber-50/60 text-amber-800"
            }`}
          >
            {isBlock && (
              <p>
                <strong>Warning:</strong> The user will immediately be blocked from logging into Testora. Their active sessions will terminate.
              </p>
            )}
            {isUnblock && (
              <p>
                <strong>Action:</strong> The user&apos;s status will transition to <strong>Active</strong>. They will be able to log in, access exams, and browse their enrolled kits immediately.
              </p>
            )}
            {isDisable && (
              <p>
                <strong>Notice:</strong> The account will be marked as <strong>Disabled</strong>. You can reactivate this account at any time from this dashboard.
              </p>
            )}
          </div>

          {/* Block Reason selector (only when blocking) */}
          {isBlock && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Select Reason for Action
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {blockReasons.map((item) => (
                  <label
                    key={item}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 text-xs transition-colors ${
                      selectedReason === item
                        ? "border-[#2f86d8] bg-[#f0f7ff] text-[#1e293b] font-medium"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="block-reason"
                      checked={selectedReason === item}
                      onChange={() => setSelectedReason(item)}
                      className="h-3.5 w-3.5 text-[#2f86d8] accent-[#2f86d8]"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Or specify custom administrative note (optional)..."
                className="mt-2 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#2f86d8] focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all disabled:opacity-60 cursor-pointer ${
              isBlock
                ? "bg-rose-600 hover:bg-rose-700 active:scale-95"
                : isUnblock
                  ? "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
                  : "bg-amber-600 hover:bg-amber-700 active:scale-95"
            }`}
          >
            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>
              {isSubmitting
                ? "Updating..."
                : isBlock
                  ? "Confirm Block"
                  : isUnblock
                    ? "Confirm Activation"
                    : "Confirm Deactivate"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
