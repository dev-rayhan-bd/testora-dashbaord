"use client";

import {
  useGetSubscriptionOverviewQuery,
  useGetSubscriptionsListQuery,
  useUpdateSubscriptionStatusMutation,
  type AdminSubscriptionItem,
} from "@/store/apis";
import type { PremiumSubscription } from "@/types";
import { Download, FileBarChart2, Info, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ActivateSubscriptionModal from "./ActivateSubscriptionModal";
import CancelSubscriptionModal from "./CancelSubscriptionModal";
import ExtendSubscriptionModal from "./ExtendSubscriptionModal";
import FiltersBar from "./FiltersBar";
import PremiumSubscribersTable from "./PremiumSubscribersTable";
import StatsCards, { type PremiumStats } from "./StatsCards";
import SubscriptionDetailsModal from "./SubscriptionDetailsModal";
import { getDisplayProductName } from "./TableRow";

const productOptions = [
  { label: "All Packages", value: "All" },
  { label: "Semimatura Package", value: "semi_matura" },
  { label: "Matura Package", value: "matura" },
  { label: "Entrance Exam Package", value: "provime" },
  { label: "Full Access Package", value: "full-access" },
];

const planOptions = ["All", "Yearly", "Monthly", "One-time"];
const statusOptions = ["All", "Active", "Expired", "Cancelled"];
const expiringOptions = ["All", "Expiring Soon (30d)", "Expiring Soon (7d)"];

export default function PremiumSubscribersPage() {
  const [showBanner, setShowBanner] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [product, setProduct] = useState("All");
  const [plan, setPlan] = useState("All");
  const [status, setStatus] = useState("All");
  const [expiring, setExpiring] = useState("All");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [viewingSub, setViewingSub] = useState<PremiumSubscription | null>(null);
  const [extendingSub, setExtendingSub] = useState<PremiumSubscription | null>(null);
  const [cancelingSub, setCancelingSub] = useState<PremiumSubscription | null>(null);
  const [activatingSub, setActivatingSub] = useState<PremiumSubscription | null>(null);

  // Debounce search by 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // 1. Overview Query
  const {
    data: overviewResponse,
    isLoading: isOverviewLoading,
    isFetching: isOverviewFetching,
    refetch: refetchOverview,
  } = useGetSubscriptionOverviewQuery();

  // 2. List Query
  const queryParams = useMemo(() => {
    const params: {
      page: number;
      limit: number;
      searchTerm?: string;
      product?: string;
      planType?: string;
      status?: string;
      expiring?: string;
    } = {
      page,
      limit: rowsPerPage,
    };

    if (debouncedSearch.trim()) params.searchTerm = debouncedSearch.trim();
    if (product !== "All") params.product = product;
    if (plan !== "All") params.planType = plan.toLowerCase();
    if (status !== "All") params.status = status.toLowerCase();
    if (expiring !== "All") {
      params.expiring = expiring.includes("7d") ? "7d" : "30d";
    }

    return params;
  }, [page, rowsPerPage, debouncedSearch, product, plan, status, expiring]);

  const {
    data: listResponse,
    isLoading: isListLoading,
    isFetching: isListFetching,
    refetch: refetchList,
  } = useGetSubscriptionsListQuery(queryParams);

  // 3. Status Action Mutation
  const [updateSubscriptionStatus, { isLoading: isUpdatingStatus }] =
    useUpdateSubscriptionStatusMutation();

  // Bind the 4 overview cards
  const stats = useMemo<PremiumStats>(() => {
    const data = overviewResponse?.data;
    return {
      active: data?.activeSubscriptions ?? 0,
      expiredThisMonth: data?.expiredThisMonth ?? 0,
      cancelled: data?.cancelledPlans ?? 0,
      expiringSoon: data?.expiringSoon ?? 0,
    };
  }, [overviewResponse?.data]);

  // Map API items to UI table rows
  const subscriptions = useMemo<PremiumSubscription[]>(() => {
    const items = listResponse?.data ?? [];
    return items.map((item: AdminSubscriptionItem) => {
      const daysLeft = item.daysLeft ?? item.daysRemaining;
      return {
        id: item.id || item._id || "",
        userId: item.user?.id || item.user?._id,
        userName: item.user?.fullName || "Unnamed Subscriber",
        userEmail: item.user?.email || "No email provided",
        userAvatar: item.user?.avatar,
        product: getDisplayProductName(item.product, item.plan),
        plan: item.plan,
        planType: item.planType || "Monthly",
        startDate: item.startDate,
        expiryDate: item.expiryDate,
        daysRemaining: daysLeft,
        expiringWarning:
          item.isExpiringSoon ?? (daysLeft !== undefined && daysLeft <= 30),
        status: item.status || "active",
        payment: item.payment || "Manual",
        orderId: item.orderId || "N/A",
        amount: item.price ? `${item.price} ${item.currency || "EUR"}` : undefined,
      };
    });
  }, [listResponse?.data]);

  const totalItems = listResponse?.meta?.total ?? subscriptions.length;
  const isRefreshing = isOverviewFetching || isListFetching;

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchOverview(), refetchList()]);
      toast.success("Subscriber data refreshed");
    } catch {
      toast.error("Failed to refresh data");
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setProduct("All");
    setPlan("All");
    setStatus("All");
    setExpiring("All");
    setPage(1);
  };

  const handleCardClick = (key: "active" | "expiredThisMonth" | "cancelled" | "expiringSoon") => {
    setPage(1);
    if (key === "active") {
      setStatus(status === "Active" ? "All" : "Active");
      setExpiring("All");
    } else if (key === "expiredThisMonth") {
      setStatus(status === "Expired" ? "All" : "Expired");
      setExpiring("All");
    } else if (key === "cancelled") {
      setStatus(status === "Cancelled" ? "All" : "Cancelled");
      setExpiring("All");
    } else if (key === "expiringSoon") {
      setExpiring(expiring === "Expiring Soon (30d)" ? "All" : "Expiring Soon (30d)");
      setStatus("All");
    }
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!cancelingSub) return;
    try {
      await updateSubscriptionStatus({
        id: cancelingSub.id,
        status: "cancelled",
        cancellationReason: reason,
      }).unwrap();
      toast.success("Subscription cancelled successfully");
      setCancelingSub(null);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to cancel subscription";
      toast.error(errorMsg);
    }
  };

  const handleConfirmExtend = async (days: number) => {
    if (!extendingSub) return;
    try {
      await updateSubscriptionStatus({
        id: extendingSub.id,
        extensionDays: days,
      }).unwrap();
      toast.success(`Subscription extended by ${days} days`);
      setExtendingSub(null);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to extend subscription";
      toast.error(errorMsg);
    }
  };

  const handleConfirmActivate = async () => {
    if (!activatingSub) return;
    try {
      await updateSubscriptionStatus({
        id: activatingSub.id,
        status: "active",
      }).unwrap();
      toast.success("Subscription activated successfully");
      setActivatingSub(null);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to activate subscription";
      toast.error(errorMsg);
    }
  };

  const handleExportCSV = () => {
    if (subscriptions.length === 0) {
      toast.info("No subscription data to export");
      return;
    }

    const headers = [
      "User Name",
      "User Email",
      "Product",
      "Plan Type",
      "Start Date",
      "Expiry Date",
      "Days Left",
      "Status",
      "Payment Method",
      "Order ID",
    ];

    const rows = subscriptions.map((s) => [
      `"${s.userName.replace(/"/g, '""')}"`,
      `"${s.userEmail.replace(/"/g, '""')}"`,
      `"${s.product.replace(/"/g, '""')}"`,
      `"${s.planType}"`,
      `"${s.startDate}"`,
      `"${s.expiryDate}"`,
      s.daysRemaining ?? "",
      `"${s.status}"`,
      `"${s.payment}"`,
      `"${s.orderId}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `premium_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV export downloaded");
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#2f4256]">Premium Subscribers</h2>
          <p className="text-xs text-[#7e95ab]">
            Manage student subscription packages, access periods, and payment records
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#dce7f2] bg-white px-3 text-xs font-semibold text-[#3f5f7a] shadow-xs transition-colors hover:bg-[#f8fbff] active:scale-95"
          >
            <Download className="h-3.5 w-3.5 text-[#6c869e]" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => toast.info("Subscription summary report will be available soon")}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#dce7f2] bg-white px-3 text-xs font-semibold text-[#3f5f7a] shadow-xs transition-colors hover:bg-[#f8fbff] active:scale-95"
          >
            <FileBarChart2 className="h-3.5 w-3.5 text-[#6c869e]" />
            Subscription Report
          </button>
        </div>
      </section>

      {/* Info Banner */}
      {showBanner && (
        <div className="flex items-start gap-3 rounded-xl border border-[#c8ddf2] bg-[#edf6fd] px-4 py-3 shadow-xs">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#3580ca]" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#2f6396]">
              This screen manages digital preparation packages only — Semimatura, Matura, and
              Entrance Exam preparation plans.
            </p>
            <p className="mt-0.5 text-[11px] text-[#608aa8]">
              Marketplace purchases (books, physical materials) are managed in Orders. User account credentials and security are managed in User Management.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss banner"
            className="mt-0.5 rounded p-1 text-[#6b96ba] transition-colors hover:bg-[#d9ecf8] hover:text-[#2f6396]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Top 4 Overview Stats Cards */}
      <StatsCards
        stats={stats}
        isLoading={isOverviewLoading}
        selectedFilter={status !== "All" ? status : expiring}
        onCardClick={handleCardClick}
      />

      {/* Filters Bar */}
      <FiltersBar
        search={search}
        onSearchChange={setSearch}
        product={product}
        onProductChange={(p) => {
          setProduct(p);
          setPage(1);
        }}
        plan={plan}
        onPlanChange={(pl) => {
          setPlan(pl);
          setPage(1);
        }}
        status={status}
        onStatusChange={(s) => {
          setStatus(s);
          setPage(1);
        }}
        expiring={expiring}
        onExpiringChange={(e) => {
          setExpiring(e);
          setPage(1);
        }}
        products={productOptions}
        plans={planOptions}
        statuses={statusOptions}
        expiringOptions={expiringOptions}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onResetFilters={handleResetFilters}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between px-0.5">
        <p className="text-xs font-semibold text-[#6d859c]">
          {totalItems} subscription{totalItems !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Subscribers Table */}
      <PremiumSubscribersTable
        subscriptions={subscriptions}
        totalItems={totalItems}
        page={page}
        rowsPerPage={rowsPerPage}
        isLoading={isListLoading}
        onPageChange={setPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setPage(1);
        }}
        onViewSubscription={setViewingSub}
        onExtendSubscription={setExtendingSub}
        onCancelSubscription={setCancelingSub}
        onActivateSubscription={setActivatingSub}
      />

      {/* Modals */}
      <SubscriptionDetailsModal
        open={!!viewingSub}
        sub={viewingSub}
        onClose={() => setViewingSub(null)}
        onActivate={setActivatingSub}
        onCancel={setCancelingSub}
        onExtend={setExtendingSub}
      />

      <ExtendSubscriptionModal
        open={!!extendingSub}
        sub={extendingSub}
        isLoading={isUpdatingStatus}
        onClose={() => setExtendingSub(null)}
        onConfirm={handleConfirmExtend}
      />

      <CancelSubscriptionModal
        open={!!cancelingSub}
        sub={cancelingSub}
        isLoading={isUpdatingStatus}
        onClose={() => setCancelingSub(null)}
        onConfirm={handleConfirmCancel}
      />

      <ActivateSubscriptionModal
        open={!!activatingSub}
        sub={activatingSub}
        isLoading={isUpdatingStatus}
        onClose={() => setActivatingSub(null)}
        onConfirm={handleConfirmActivate}
      />
    </div>
  );
}
