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
    <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-240 text-left border-collapse">
          <thead className="border-b border-slate-200 bg-[#f8fbff] text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            <tr>
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Preferred Category</th>
              <th className="px-5 py-3">Active Plan</th>
              <th className="px-5 py-3">Last Activity</th>
              <th className="px-5 py-3">Joined Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <UserRow
                key={user.id || user.email}
                user={user}
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
