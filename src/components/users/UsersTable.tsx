"use client";

import Pagination from "@/components/users/Pagination";
import UserRow, { type UserManagementRow } from "@/components/users/UserRow";

type UsersTableProps = {
  users: UserManagementRow[];
  totalItems: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onViewUser: (user: UserManagementRow) => void;
  onStatusAction: (actionType: "block" | "unblock" | "disable", user: UserManagementRow) => void;
};

export default function UsersTable({
  users,
  totalItems,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onViewUser,
  onStatusAction,
}: UsersTableProps) {
  return (
    <section className="rounded-xl border border-slate-200/90 bg-white shadow-2xs">
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full min-w-180 text-left border-collapse">
          <thead className="border-b border-slate-200 bg-[#f8fbff] text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            <tr>
              <th className="px-5 py-3 w-[28%]">Student</th>
              <th className="px-5 py-3 w-[14%]">Role</th>
              <th className="px-5 py-3 w-[16%]">Active Plan</th>
              <th className="px-5 py-3 w-[16%]">Joined Date</th>
              <th className="px-5 py-3 w-[14%]">Status</th>
              <th className="px-5 py-3 w-[12%] text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user, index) => (
              <UserRow
                key={user.id || user.email}
                user={user}
                isLastRow={index >= Math.max(0, users.length - 2)}
                onView={onViewUser}
                onStatusAction={onStatusAction}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={totalItems}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </section>
  );
}
