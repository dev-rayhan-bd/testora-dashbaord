"use client";

import StatusBadge from "@/components/users/StatusBadge";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types";
import {
  Ban,
  CheckCircle2,
  Eye,
  MoreHorizontal,
  PauseCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type UserManagementRow = {
  id: string;
  initials: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  city?: string;
  preferredCategory: string;
  type: string;
  activePlan: string;
  lastActivity: string;
  joinedDate: string;
  status: UserStatus;
  rawStatus: "active" | "blocked" | "disabled";
  createdAt: string;
};

type UserRowProps = {
  user: UserManagementRow;
  onView: (user: UserManagementRow) => void;
  onStatusAction: (actionType: "block" | "unblock" | "disable", user: UserManagementRow) => void;
};

function planBadgeClass(plan: string) {
  const norm = (plan || "Free").toLowerCase();
  if (norm.includes("pro") || norm.includes("premium")) {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }
  if (norm.includes("matura")) {
    return "border-blue-200 bg-blue-50 text-[#2f86d8]";
  }
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function categoryBadgeClass(category: string) {
  const norm = (category || "General").toLowerCase();
  if (norm.includes("matura")) {
    return "border-blue-100 bg-blue-50/70 text-blue-700";
  }
  if (norm.includes("semi")) {
    return "border-indigo-100 bg-indigo-50/70 text-indigo-700";
  }
  return "border-emerald-100 bg-emerald-50/70 text-emerald-700";
}

export default function UserRow({
  user,
  onView,
  onStatusAction,
}: UserRowProps) {
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

  const isBlocked = user.rawStatus === "blocked";
  const isDisabled = user.rawStatus === "disabled";
  const isActive = !isBlocked && !isDisabled;

  return (
    <tr className="border-b border-slate-100 text-xs transition-colors hover:bg-[#f9fbfe]">
      {/* User info */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={34}
              height={34}
              className="h-8 w-8 shrink-0 rounded-full border border-slate-200 object-cover shadow-2xs"
              unoptimized
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] text-xs font-bold text-[#2072c4] shadow-2xs">
              {user.initials}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-slate-800 truncate" title={user.name}>
                {user.name}
              </p>
              {user.role && user.role !== "user" && (
                <span className="rounded-sm bg-slate-100 px-1 py-0.2 text-[9px] font-bold uppercase text-slate-500">
                  {user.role}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate" title={user.email}>
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* Preferred Category */}
      <td className="px-5 py-3.5">
        <span
          className={cn(
            "inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium",
            categoryBadgeClass(user.preferredCategory)
          )}
        >
          {user.preferredCategory}
        </span>
      </td>

      {/* Active Plan */}
      <td className="px-5 py-3.5">
        <span
          className={cn(
            "inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold",
            planBadgeClass(user.activePlan)
          )}
        >
          {user.activePlan}
        </span>
      </td>

      {/* Last Activity */}
      <td className="px-5 py-3.5 text-slate-500 font-medium">{user.lastActivity}</td>

      {/* Joined Date */}
      <td className="px-5 py-3.5 text-slate-500">{user.joinedDate}</td>

      {/* Status */}
      <td className="px-5 py-3.5">
        <StatusBadge status={user.status} />
      </td>

      {/* Actions */}
      <td className="px-5 py-3.5 text-right">
        <div ref={menuRef} className="relative inline-flex">
          <button
            type="button"
            aria-label="Open row actions"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 shadow-2xs transition-all cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {open && (
            <div className="absolute top-9 right-0 z-30 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onView(user);
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50/60 hover:text-[#2f86d8] transition-colors cursor-pointer"
              >
                <Eye className="h-4 w-4 text-[#2f86d8]" />
                View User Details
              </button>

              <div className="my-1 border-t border-slate-100" />

              {isActive && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onStatusAction("block", user);
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Ban className="h-4 w-4" />
                    Block User
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onStatusAction("disable", user);
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                  >
                    <PauseCircle className="h-4 w-4" />
                    Deactivate Account
                  </button>
                </>
              )}

              {isBlocked && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onStatusAction("unblock", user);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Unblock & Activate
                </button>
              )}

              {isDisabled && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onStatusAction("unblock", user);
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Activate Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onStatusAction("block", user);
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Ban className="h-4 w-4" />
                    Block User
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
