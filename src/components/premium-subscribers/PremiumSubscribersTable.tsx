import Pagination from "@/components/users/Pagination";
import type { PremiumSubscription } from "@/types";
import TableRow from "./TableRow";

type PremiumSubscribersTableProps = {
  subscriptions: PremiumSubscription[];
  totalItems: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onViewSubscription: (sub: PremiumSubscription) => void;
  onExtendSubscription: (sub: PremiumSubscription) => void;
  onCancelSubscription: (sub: PremiumSubscription) => void;
};

export default function PremiumSubscribersTable({
  subscriptions,
  totalItems,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onViewSubscription,
  onExtendSubscription,
  onCancelSubscription,
}: PremiumSubscribersTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#dce7f2] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-275 text-left">
          <thead className="bg-[#f3f7fb] text-[11px] font-medium tracking-wide text-[#6f859b] uppercase">
            <tr>
              <th className="px-4 py-2.5 sm:px-5">User ↕</th>
              <th className="px-4 py-2.5 sm:px-5">Product ↕</th>
              <th className="px-4 py-2.5 sm:px-5">Plan Type ↕</th>
              <th className="px-4 py-2.5 sm:px-5">Start Date</th>
              <th className="px-4 py-2.5 sm:px-5">Expiry Date ↕</th>
              <th className="px-4 py-2.5 sm:px-5">Status ↕</th>
              <th className="px-4 py-2.5 sm:px-5">Payment</th>
              <th className="px-4 py-2.5 sm:px-5">Order ID</th>
              <th className="px-4 py-2.5 sm:px-5">Actions</th>
            </tr>
          </thead>

          <tbody>
            {subscriptions.map((sub) => (
              <TableRow
                key={sub.id}
                sub={sub}
                onView={onViewSubscription}
                onExtend={onExtendSubscription}
                onCancel={onCancelSubscription}
              />
            ))}
            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-sm text-[#90a3b6]">
                  No subscriptions match the current filters.
                </td>
              </tr>
            )}
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
