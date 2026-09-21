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
  onSuspendUser: (user: UserManagementRow) => void;
  onDeactivateUser: (user: UserManagementRow) => void;
  onArchiveUser: (user: UserManagementRow) => void;
};

export default function UsersTable({
  users,
  totalItems,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onViewUser,
  onSuspendUser,
  onDeactivateUser,
  onArchiveUser,
}: UsersTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#dce7f2] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-240 text-left">
          <thead className="bg-[#f3f7fb] text-[11px] tracking-wide text-[#6f859b] uppercase">
            <tr>
              <th className="px-4 py-2.5 font-medium sm:px-5">User</th>
              <th className="px-4 py-2.5 font-medium sm:px-5">Preferred Category</th>
              <th className="px-4 py-2.5 font-medium sm:px-5">Active Plan</th>
              <th className="px-4 py-2.5 font-medium sm:px-5">Last Activity</th>
              <th className="px-4 py-2.5 font-medium sm:px-5">Joined Date</th>
              <th className="px-4 py-2.5 font-medium sm:px-5">Status</th>
              <th className="px-4 py-2.5 text-right font-medium sm:px-5">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onView={onViewUser}
                onSuspend={onSuspendUser}
                onDeactivate={onDeactivateUser}
                onArchive={onArchiveUser}
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
