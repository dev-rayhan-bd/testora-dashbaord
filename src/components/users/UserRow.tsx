import StatusBadge from "@/components/users/StatusBadge";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types";
import { Archive, Ban, Eye, MoreHorizontal, UserX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type UserManagementRow = {
  id: string;
  initials: string;
  name: string;
  email: string;
  preferredCategory: string;
  type: string;
  activePlan: string;
  lastActivity: string;
  joinedDate: string;
  status: UserStatus;
};

type UserRowProps = {
  user: UserManagementRow;
  onView: (user: UserManagementRow) => void;
  onSuspend: (user: UserManagementRow) => void;
  onDeactivate: (user: UserManagementRow) => void;
  onArchive: (user: UserManagementRow) => void;
};

function badgeClass(value: string, kind: "category" | "plan") {
  if (kind === "category") {
    if (value === "Matura") return "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]";
    if (value === "Semimatura") return "border-[#dce4f6] bg-[#edf0fb] text-[#748ccc]";
    return "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]";
  }

  if (value === "Free") return "border-[#dee8f2] bg-[#f2f6fb] text-[#6d839a]";
  if (value.includes("Matura")) return "border-[#d6e6f4] bg-[#ebf3fc] text-[#4d93d9]";
  if (value.includes("Semimatura")) return "border-[#e4ddf4] bg-[#f1edfb] text-[#8468c4]";
  return "border-[#dbe7f4] bg-[#edf4fd] text-[#5f88bd]";
}

export default function UserRow({
  user,
  onView,
  onSuspend,
  onDeactivate,
  onArchive,
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

  return (
    <tr className="border-b border-[#ecf2f8] text-xs text-[#5e768e] last:border-b-0">
      <td className="px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8f2fc] text-[11px] font-semibold text-[#4b92d9]">
            {user.initials}
          </div>
          <div>
            <p className="font-medium text-[#4f6d87]">{user.name}</p>
            <p className="text-[11px] text-[#90a2b5]">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 sm:px-5">
        <span
          className={cn(
            "rounded-sm border px-2 py-0.5 text-[11px]",
            badgeClass(user.preferredCategory, "category")
          )}
        >
          {user.preferredCategory}
        </span>
      </td>
      <td className="px-4 py-3 sm:px-5">
        <span
          className={cn(
            "rounded-sm border px-2 py-0.5 text-[11px]",
            badgeClass(user.activePlan, "plan")
          )}
        >
          {user.activePlan}
        </span>
      </td>
      <td className="px-4 py-3 sm:px-5">{user.lastActivity}</td>
      <td className="px-4 py-3 sm:px-5">{user.joinedDate}</td>
      <td className="px-4 py-3 sm:px-5">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-4 py-3 text-right sm:px-5">
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
            <div className="absolute top-8 right-0 z-20 w-52 rounded-xl border border-[#dce7f2] bg-white py-1.5">
              <button
                type="button"
                onClick={() => {
                  onView(user);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#4f6d87] hover:bg-[#f8fbff]"
              >
                <Eye className="h-4 w-4 text-[#8fa2b5]" />
                View User
              </button>
              <button
                type="button"
                onClick={() => {
                  onSuspend(user);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#e24d4d] hover:bg-[#fff5f5]"
              >
                <Ban className="h-4 w-4" />
                Suspend User
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeactivate(user);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#d58023] hover:bg-[#fffaf0]"
              >
                <UserX className="h-4 w-4" />
                Deactivate User
              </button>
              <button
                type="button"
                onClick={() => {
                  onArchive(user);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#6f8194] hover:bg-[#f8fbff]"
              >
                <Archive className="h-4 w-4" />
                Archive User
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
