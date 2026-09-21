"use client";

import StatusBadge from "@/components/users/StatusBadge";
import {
  Ban,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Mail,
  PauseCircle,
  Shield,
  Sparkles,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import type { UserManagementRow } from "./UserRow";

type Props = {
  open: boolean;
  user: UserManagementRow | null;
  onClose: () => void;
  onAction?: (actionType: "block" | "unblock" | "disable", user: UserManagementRow) => void;
};

export default function UserDetailsModal({ open, user, onClose, onAction }: Props) {
  const [copied, setCopied] = useState(false);

  if (!open || !user) return null;

  const handleCopyId = () => {
    if (user.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      toast.success("User ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isBlocked = user.rawStatus === "blocked";
  const isDisabled = user.rawStatus === "disabled";
  const isActive = !isBlocked && !isDisabled;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 bg-[#fbfdff] px-6 py-5">
          <div className="flex items-center gap-3.5">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full border border-slate-200 object-cover shadow-xs"
                unoptimized
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-200 bg-gradient-to-br from-blue-100 to-blue-200 text-sm font-bold text-[#2072c4] shadow-xs">
                {user.initials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">{user.name}</h3>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#2f86d8]">
                  {user.role || "Student"}
                </span>
              </div>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Details Grid */}
        <div className="space-y-4 px-6 py-5">
          {/* User ID copy bar */}
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#f8fbff] px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                User ID:
              </span>
              <span className="font-mono text-xs text-slate-700">{user.id}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyId}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 hover:text-[#2f86d8] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Details Grid (Only Real Fields) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Account Status */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1">
                <Shield className="h-3.5 w-3.5 text-slate-400" /> Account Status
              </span>
              <StatusBadge status={user.status} />
            </div>

            {/* Active Plan */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-[#2f86d8]" /> Active Plan
              </span>
              <span
                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
                  user.activePlan.toLowerCase().includes("semi")
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                    : user.activePlan.toLowerCase().includes("matura")
                      ? "border-blue-200 bg-blue-50 text-[#2f86d8]"
                      : user.activePlan.toLowerCase().includes("provime")
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {user.activePlan || "Free"}
              </span>
            </div>

            {/* Role */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1">
                <User className="h-3.5 w-3.5 text-slate-400" /> Platform Role
              </span>
              <p className="text-xs font-semibold text-slate-700 capitalize">
                {user.role || "Student"}
              </p>
            </div>

            {/* Joined Date */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" /> Member Since
              </span>
              <p className="text-xs font-semibold text-slate-700">{user.joinedDate || "N/A"}</p>
            </div>

            {/* Email Address */}
            <div className="col-span-full rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" /> Registered Email
              </span>
              <p className="text-xs font-semibold text-slate-700 select-all">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Footer with Quick Status Actions */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {isActive && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAction?.("block", user);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <Ban className="h-3.5 w-3.5" />
                  Block User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAction?.("disable", user);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <PauseCircle className="h-3.5 w-3.5" />
                  Disable Account
                </button>
              </>
            )}
            {isBlocked && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAction?.("unblock", user);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Unblock & Activate
              </button>
            )}
            {isDisabled && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAction?.("unblock", user);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Activate Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAction?.("block", user);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <Ban className="h-3.5 w-3.5" />
                  Block User
                </button>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
