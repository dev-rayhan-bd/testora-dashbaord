"use client";

import StatsCards from "@/components/users/StatsCards";
import StatusActionModal, { type StatusActionType } from "@/components/users/StatusActionModal";
import UserDetailsModal from "@/components/users/UserDetailsModal";
import UserFilters from "@/components/users/UserFilters";
import UsersTable from "@/components/users/UsersTable";
import { PAGINATION_DEFAULTS } from "@/constants";
import { mapUser } from "@/lib/user-management-utils";
import { cn } from "@/lib/utils";
import {
  useGetUserListQuery,
  useGetUserOverviewQuery,
  useUpdateUserStatusMutation,
} from "@/store/apis";
import { RefreshCw, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { UserManagementRow } from "./UserRow";

const statusOptions = ["All", "active", "blocked", "disabled"];

function PageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="h-6 w-44 animate-pulse rounded bg-slate-200/80" />
        <div className="h-4 w-64 animate-pulse rounded bg-slate-200/80" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white"
          />
        ))}
      </div>
      <div className="h-16 animate-pulse rounded-xl border border-slate-200 bg-white" />
      <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-white" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="h-12 border-b border-slate-200 bg-slate-50/80" />
      <div className="space-y-3 p-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-12 animate-pulse rounded-lg border border-slate-100 bg-slate-50"
          />
        ))}
      </div>
    </div>
  );
}

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [plan, setPlan] = useState("All");
  const [page, setPage] = useState<number>(PAGINATION_DEFAULTS.PAGE);
  const [rowsPerPage, setRowsPerPage] = useState<number>(PAGINATION_DEFAULTS.LIMIT);

  // Modals state
  const [viewingUser, setViewingUser] = useState<UserManagementRow | null>(null);
  const [statusActionState, setStatusActionState] = useState<{
    open: boolean;
    user: UserManagementRow | null;
    actionType: StatusActionType;
  }>({
    open: false,
    user: null,
    actionType: "block",
  });

  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  // Debounce search by 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Queries
  const {
    data: overviewResponse,
    isLoading: isOverviewLoading,
    isError: overviewError,
    error: overviewFetchError,
    refetch: refetchOverview,
  } = useGetUserOverviewQuery();

  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
    isError: usersError,
    error: usersFetchError,
    refetch: refetchUsers,
  } = useGetUserListQuery({
    page,
    limit: rowsPerPage,
    status: status === "All" ? undefined : status,
    plan: plan === "All" ? undefined : plan,
    searchTerm: debouncedSearch.trim() || undefined,
  });

  // Mutation
  const [updateUserStatus, { isLoading: isStatusUpdating }] = useUpdateUserStatusMutation();

  const previousError = useRef<string | null>(null);

  useEffect(() => {
    const message =
      (overviewError && "Unable to load user overview.") ||
      (usersError && "Unable to load user list.") ||
      null;

    const detail =
      (overviewError && (overviewFetchError as { data?: { message?: string }; error?: string })) ||
      (usersError && (usersFetchError as { data?: { message?: string }; error?: string })) ||
      undefined;

    if (message && previousError.current !== message) {
      previousError.current = message;
      toast.error(detail?.data?.message ?? detail?.error ?? message);
    }
  }, [overviewError, usersError, overviewFetchError, usersFetchError]);

  // Refresh handler with guaranteed spinner feedback
  const handleRefresh = async () => {
    try {
      setIsManualRefreshing(true);
      await Promise.all([
        refetchOverview(),
        refetchUsers(),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
      toast.success("User management metrics refreshed successfully!");
    } catch {
      toast.error("Failed to refresh user metrics.");
    } finally {
      setIsManualRefreshing(false);
    }
  };

  // Status Action Trigger
  const handleOpenStatusAction = (actionType: StatusActionType, targetUser: UserManagementRow) => {
    setStatusActionState({
      open: true,
      user: targetUser,
      actionType,
    });
  };

  // Status Action Confirmation
  const handleConfirmStatusAction = async (
    targetStatus: "active" | "blocked" | "disabled",
    reason?: string
  ) => {
    const targetUser = statusActionState.user;
    if (!targetUser) return;

    try {
      await updateUserStatus({
        id: targetUser.id,
        status: targetStatus,
      }).unwrap();

      const statusLabels = {
        active: "activated",
        blocked: "blocked",
        disabled: "deactivated",
      };

      toast.success(
        `User ${targetUser.name} has been ${statusLabels[targetStatus]}${
          reason ? ` (${reason})` : ""
        }.`
      );

      // Also update viewing user if currently inspected
      if (viewingUser && viewingUser.id === targetUser.id) {
        setViewingUser({
          ...viewingUser,
          status:
            targetStatus === "active"
              ? "Active"
              : targetStatus === "blocked"
                ? "Blocked"
                : "Disabled",
          rawStatus: targetStatus,
        });
      }

      setStatusActionState({ open: false, user: null, actionType: "block" });
    } catch (err) {
      const errorObj = err as { data?: { message?: string }; error?: string };
      toast.error(errorObj.data?.message || errorObj.error || "Failed to update user status.");
    }
  };

  // Dynamic Plans options from records
  const planOptions = useMemo(() => {
    const availablePlans = Array.from(
      new Set((usersResponse?.data ?? []).map((user) => user.plan).filter(Boolean))
    ) as string[];
    return ["All", ...availablePlans];
  }, [usersResponse]);

  const users = useMemo(() => (usersResponse?.data ?? []).map(mapUser), [usersResponse]);

  const stats = useMemo(
    () => ({
      total: overviewResponse?.data?.totalUsers ?? 0,
      active: overviewResponse?.data?.activeAccounts ?? 0,
      suspended: overviewResponse?.data?.blockedAccounts ?? 0,
      inactive: overviewResponse?.data?.disabledAccounts ?? 0,
    }),
    [overviewResponse]
  );

  const totalItems = usersResponse?.meta?.total ?? 0;
  const totalPages = usersResponse?.meta?.totalPages ?? 1;
  const safePage = Math.min(page, totalPages);
  const isLoading = isOverviewLoading || isUsersLoading;
  const isRefreshing = (isUsersFetching && !isUsersLoading) || isManualRefreshing;
  const showInitialSkeleton = isLoading && !overviewResponse && !usersResponse;

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("All");
    setPlan("All");
    setPage(1);
  };

  if (showInitialSkeleton) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Admin User Management</h2>
          <p className="text-xs text-slate-500">
            Real-time student monitoring, access moderation, and status controls
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-[#2f86d8] transition-colors disabled:opacity-60 cursor-pointer active:scale-95"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5 text-[#2f86d8]", isRefreshing && "animate-spin")}
            />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Stats Cards with interactive filtering */}
      {isLoading && !overviewResponse ? (
        <PageSkeleton />
      ) : (
        <StatsCards
          stats={stats}
          currentStatus={status}
          onStatusClick={(newStatus) => {
            setStatus(newStatus);
            setPage(1);
          }}
        />
      )}

      {/* Filter and Search Bar */}
      <UserFilters
        search={search}
        onSearchChange={setSearch}
        plan={plan}
        onPlanChange={(value) => {
          setPlan(value);
          setPage(1);
        }}
        status={status}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        plans={planOptions}
        statuses={statusOptions}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onReset={handleResetFilters}
      />

      {/* Table Section */}
      {isLoading && !usersResponse ? (
        <TableSkeleton />
      ) : (
        <div className={cn("relative transition-opacity", isRefreshing && "opacity-80")}>
          <UsersTable
            users={users}
            totalItems={totalItems}
            page={safePage}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows);
              setPage(1);
            }}
            onViewUser={setViewingUser}
            onStatusAction={handleOpenStatusAction}
          />
        </div>
      )}

      {/* Empty State */}
      {users.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-4 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#2f86d8] mb-3">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No students found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            {debouncedSearch || status !== "All" || plan !== "All"
              ? "No student matches the current search or filter criteria. Try adjusting your filters."
              : "No students registered on the platform yet."}
          </p>
          {(debouncedSearch || status !== "All" || plan !== "All") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#2f86d8] hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        open={!!viewingUser}
        user={viewingUser}
        onClose={() => setViewingUser(null)}
        onAction={handleOpenStatusAction}
      />

      {/* Status Action Confirmation Modal */}
      <StatusActionModal
        open={statusActionState.open}
        user={statusActionState.user}
        actionType={statusActionState.actionType}
        isSubmitting={isStatusUpdating}
        onClose={() => setStatusActionState({ open: false, user: null, actionType: "block" })}
        onConfirm={handleConfirmStatusAction}
      />
    </div>
  );
}
