import Pagination from "@/components/users/Pagination";
import type { PremiumSubscription } from "@/types";
import { SearchX } from "lucide-react";
import TableRow from "./TableRow";

type PremiumSubscribersTableProps = {
  subscriptions: PremiumSubscription[];
  totalItems: number;
  page: number;
  rowsPerPage: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onViewSubscription: (sub: PremiumSubscription) => void;
  onExtendSubscription: (sub: PremiumSubscription) => void;
  onCancelSubscription: (sub: PremiumSubscription) => void;
  onActivateSubscription: (sub: PremiumSubscription) => void;
};

export default function PremiumSubscribersTable({
  subscriptions,
  totalItems,
  page,
  rowsPerPage,
  isLoading = false,
  onPageChange,
  onRowsPerPageChange,
  onViewSubscription,
  onExtendSubscription,
  onCancelSubscription,
  onActivateSubscription,
}: PremiumSubscribersTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#dce7f2] bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-275 text-left">
          <thead className="bg-[#f3f7fb] text-[11px] font-medium tracking-wide text-[#6f859b] uppercase">
            <tr>
              <th className="px-4 py-3 sm:px-5">User</th>
              <th className="px-4 py-3 sm:px-5">Product</th>
              <th className="px-4 py-3 sm:px-5">Plan Type</th>
              <th className="px-4 py-3 sm:px-5">Start Date</th>
              <th className="px-4 py-3 sm:px-5">Expiry Date</th>
              <th className="px-4 py-3 sm:px-5">Status</th>
              <th className="px-4 py-3 sm:px-5">Payment</th>
              <th className="px-4 py-3 sm:px-5">Order ID</th>
              <th className="px-4 py-3 sm:px-5">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skel-${idx}`} className="animate-pulse border-b border-[#ecf2f8]">
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-slate-200" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-28 rounded bg-slate-200" />
                        <div className="h-2.5 w-36 rounded bg-slate-100" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="h-5 w-20 rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="h-5 w-16 rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="h-4 w-20 rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="h-4 w-20 rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="h-5 w-14 rounded-full bg-slate-200" />
                  </td>
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="h-5 w-14 rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="h-4 w-20 rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="h-6 w-6 rounded bg-slate-200" />
                  </td>
                </tr>
              ))
            ) : subscriptions.length > 0 ? (
              subscriptions.map((sub, index) => (
                <TableRow
                  key={sub.id}
                  sub={sub}
                  isLastRow={index >= subscriptions.length - 2}
                  onView={onViewSubscription}
                  onExtend={onExtendSubscription}
                  onCancel={onCancelSubscription}
                  onActivate={onActivateSubscription}
                />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-5 py-14 text-center">
                  <div className="mx-auto flex flex-col items-center justify-center text-[#90a3b6]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f4f9] text-[#7d93a8]">
                      <SearchX className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-[#4f6d87]">No subscriptions found</p>
                    <p className="mt-1 text-xs text-[#90a3b6]">
                      Try adjusting your search terms or filters to find what you are looking for.
                    </p>
                  </div>
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
