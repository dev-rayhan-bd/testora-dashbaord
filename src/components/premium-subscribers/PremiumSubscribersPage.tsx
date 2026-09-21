"use client";

import { premiumSubscribersData } from "@/lib/premium-subscribers-data";
import type { PremiumSubscription } from "@/types";
import { Download, FileBarChart2, Info, X } from "lucide-react";
import { useMemo, useState } from "react";
import CancelSubscriptionModal from "./CancelSubscriptionModal";
import ExtendSubscriptionModal from "./ExtendSubscriptionModal";
import FiltersBar from "./FiltersBar";
import PremiumSubscribersTable from "./PremiumSubscribersTable";
import StatsCards, { type PremiumStats } from "./StatsCards";
import SubscriptionDetailsModal from "./SubscriptionDetailsModal";

const productOptions = [
  "All",
  "Matura",
  "Semimatura",
  "Medicine Entrance Exam",
  "Live Entrance Exam",
  "Economics Entrance Exam",
];
const planOptions = ["All", "Yearly", "Monthly", "One-time"];
const statusOptions = ["All", "Active", "Expired", "Cancelled"];
const expiringOptions = ["All", "Expiring Soon (30d)", "Expiring Soon (7d)"];

export default function PremiumSubscribersPage() {
  const [subscriptionsState, setSubscriptionsState] = useState(premiumSubscribersData);
  const [showBanner, setShowBanner] = useState(true);
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState("All");
  const [plan, setPlan] = useState("All");
  const [status, setStatus] = useState("All");
  const [expiring, setExpiring] = useState("All");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewingSub, setViewingSub] = useState<PremiumSubscription | null>(null);
  const [extendingSub, setExtendingSub] = useState<PremiumSubscription | null>(null);
  const [cancelingSub, setCancelingSub] = useState<PremiumSubscription | null>(null);

  const stats = useMemo<PremiumStats>(
    () => ({
      active: subscriptionsState.filter((s) => s.status === "Active").length,
      expiredThisMonth: subscriptionsState.filter((s) => s.status === "Expired").length,
      cancelled: subscriptionsState.filter((s) => s.status === "Cancelled").length,
      expiringSoon: subscriptionsState.filter((s) => s.expiringWarning === true).length,
    }),
    [subscriptionsState]
  );

  const filteredSubscriptions = useMemo(() => {
    return subscriptionsState.filter((s) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        s.userName.toLowerCase().includes(query) ||
        s.userEmail.toLowerCase().includes(query) ||
        s.orderId.toLowerCase().includes(query);
      const matchesProduct = product === "All" || s.product === product;
      const matchesPlan = plan === "All" || s.planType === plan;
      const matchesStatus = status === "All" || s.status === status;
      const matchesExpiring =
        expiring === "All" ||
        (expiring === "Expiring Soon (30d)" && s.expiringWarning === true) ||
        (expiring === "Expiring Soon (7d)" &&
          s.daysRemaining !== undefined &&
          s.daysRemaining <= 7);

      return matchesSearch && matchesProduct && matchesPlan && matchesStatus && matchesExpiring;
    });
  }, [subscriptionsState, search, product, plan, status, expiring]);

  const totalPages = Math.max(1, Math.ceil(filteredSubscriptions.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);

  const paginatedSubscriptions = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return filteredSubscriptions.slice(start, start + rowsPerPage);
  }, [filteredSubscriptions, safePage, rowsPerPage]);

  const withReset = (fn: (v: string) => void) => (v: string) => {
    fn(v);
    setPage(1);
  };

  const addDays = (dateStr: string, days: number) => {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-3">
      {/* Page header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#3f5f7a]">Premium Subscribers</h2>
          <p className="text-sm text-[#7e95ab]">Manage premium users and view payment details</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#dce7f2] bg-white px-3 text-xs font-medium text-[#3f5f7a] hover:bg-[#f8fbff]"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#dce7f2] bg-white px-3 text-xs font-medium text-[#3f5f7a] hover:bg-[#f8fbff]"
          >
            <FileBarChart2 className="h-3.5 w-3.5" />
            Subscription Report
          </button>
        </div>
      </section>

      {/* Info banner */}
      {showBanner && (
        <div className="flex items-start gap-3 rounded-lg border border-[#c8ddf2] bg-[#eaf4fd] px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#4a8fc7]" />
          <div className="flex-1">
            <p className="text-xs font-medium text-[#3a6e9e]">
              This screen manages digital subscription packages only — Semimatura, Matura, and
              Entrance Exam preparation packages.
            </p>
            <p className="mt-0.5 text-[11px] text-[#6b96ba]">
              Marketplace purchases (books, bags, physical items) are managed separately in the
              Orders section. User accounts are managed in User Management.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss banner"
            className="mt-0.5 rounded p-0.5 text-[#6b96ba] hover:bg-[#d9ecf8] hover:text-[#3a6e9e]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Stats cards */}
      <StatsCards stats={stats} />

      {/* Filters */}
      <FiltersBar
        search={search}
        onSearchChange={withReset(setSearch)}
        product={product}
        onProductChange={withReset(setProduct)}
        plan={plan}
        onPlanChange={withReset(setPlan)}
        status={status}
        onStatusChange={withReset(setStatus)}
        expiring={expiring}
        onExpiringChange={withReset(setExpiring)}
        products={productOptions}
        plans={planOptions}
        statuses={statusOptions}
        expiringOptions={expiringOptions}
      />

      {/* Results count */}
      <p className="text-xs text-[#7e95ab]">
        {filteredSubscriptions.length} subscription
        {filteredSubscriptions.length !== 1 ? "s" : ""} found
      </p>

      {/* Table */}
      <PremiumSubscribersTable
        subscriptions={paginatedSubscriptions}
        totalItems={filteredSubscriptions.length}
        page={safePage}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setPage(1);
        }}
        onViewSubscription={setViewingSub}
        onExtendSubscription={setExtendingSub}
        onCancelSubscription={setCancelingSub}
      />

      <SubscriptionDetailsModal
        open={!!viewingSub}
        sub={viewingSub}
        onClose={() => setViewingSub(null)}
      />

      <ExtendSubscriptionModal
        open={!!extendingSub}
        sub={extendingSub}
        onClose={() => setExtendingSub(null)}
        onConfirm={(days) => {
          if (!extendingSub) return;
          setSubscriptionsState((prev) =>
            prev.map((item) =>
              item.id === extendingSub.id
                ? {
                    ...item,
                    expiryDate: addDays(item.expiryDate, days),
                    status: "Active",
                    expiringWarning: false,
                    daysRemaining: undefined,
                  }
                : item
            )
          );
          setExtendingSub(null);
        }}
      />

      <CancelSubscriptionModal
        open={!!cancelingSub}
        sub={cancelingSub}
        onClose={() => setCancelingSub(null)}
        onConfirm={() => {
          if (!cancelingSub) return;
          setSubscriptionsState((prev) =>
            prev.map((item) =>
              item.id === cancelingSub.id
                ? { ...item, status: "Cancelled", expiringWarning: false, daysRemaining: undefined }
                : item
            )
          );
          setCancelingSub(null);
        }}
      />
    </div>
  );
}
