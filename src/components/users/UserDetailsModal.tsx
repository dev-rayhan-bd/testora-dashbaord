"use client";

import { X } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { UserManagementRow } from "./UserRow";

type Props = {
  open: boolean;
  user: UserManagementRow | null;
  onClose: () => void;
};

export default function UserDetailsModal({ open, user, onClose }: Props) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/30 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-[#dce7f2] bg-white">
        <div className="flex items-start justify-between border-b border-[#e6edf5] px-5 py-4">
          <div>
            <h3 className="text-xl font-semibold text-[#2f3f52]">User Details</h3>
            <p className="text-xs text-[#8ea1b4]">{user.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#8ea1b5] hover:bg-[#f4f8fc]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="flex items-center gap-3 rounded-lg border border-[#dce7f2] bg-[#f8fbff] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f2fc] text-xs font-semibold text-[#4b92d9]">
              {user.initials}
            </div>
            <div>
              <p className="font-medium text-[#4f6d87]">{user.name}</p>
              <p className="text-xs text-[#90a2b5]">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
            <div>
              <p className="text-[#8ea1b4]">Preferred Category</p>
              <p className="font-medium text-[#4f6d87]">{user.preferredCategory}</p>
            </div>
            <div>
              <p className="text-[#8ea1b4]">Active Plan</p>
              <p className="font-medium text-[#4f6d87]">{user.activePlan}</p>
            </div>
            <div>
              <p className="text-[#8ea1b4]">Joined Date</p>
              <p className="font-medium text-[#4f6d87]">{user.joinedDate}</p>
            </div>
            <div>
              <p className="text-[#8ea1b4]">Last Activity</p>
              <p className="font-medium text-[#4f6d87]">{user.lastActivity}</p>
            </div>
            <div>
              <p className="text-[#8ea1b4]">Status</p>
              <div className="mt-0.5">
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-[#e6edf5] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#d4e2ef] px-4 py-2 text-sm text-[#556f88] hover:bg-[#f5f9fd]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
