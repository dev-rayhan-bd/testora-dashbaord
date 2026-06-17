"use client";

import StatsCards from "@/components/users/StatsCards";
import SuspendUserModal from "@/components/users/SuspendUserModal";
import UserDetailsModal from "@/components/users/UserDetailsModal";
import UserFilters from "@/components/users/UserFilters";
import UsersTable from "@/components/users/UsersTable";
import { PAGINATION_DEFAULTS } from "@/constants";
import { mapUser } from "@/lib/user-management-utils";
import { cn } from "@/lib/utils";
import { useGetUserListQuery, useGetUserOverviewQuery } from "@/store/apis";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { UserManagementRow } from "./UserRow";

const statusOptions = ["All", "active", "blocked", "disabled"];

function PageSkeleton() {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="h-6 w-44 animate-pulse rounded bg-slate-200/80" />
        <div className="h-4 w-64 animate-pulse rounded bg-slate-200/80" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-lg border border-[#dce7f2] bg-white"
          />
        ))}
      </div>
      <div className="h-16 animate-pulse rounded-lg border border-[#dce7f2] bg-white" />
      <div className="h-96 animate-pulse rounded-lg border border-[#dce7f2] bg-white" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-[#dce7f2] bg-white">
      <div className="h-12 border-b border-[#dce7f2] bg-slate-100/70" />
      <div className="space-y-3 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-11 animate-pulse rounded-md border border-[#ecf2f8] bg-slate-100/80"
          />
        ))}
      </div>
    </div>
  );
}

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [plan, setPlan] = useState("All");
  const [page, setPage] = useState<number>(PAGINATION_DEFAULTS.PAGE);
  const [rowsPerPage, setRowsPerPage] = useState<number>(PAGINATION_DEFAULTS.LIMIT);
  const [viewingUser, setViewingUser] = useState<UserManagementRow | null>(null);
  const [suspendingUser, setSuspendingUser] = useState<UserManagementRow | null>(null);

  const {
    data: overviewResponse,
    isLoading: isOverviewLoading,
    isError: overviewError,
    error: overviewFetchError,
  } = useGetUserOverviewQuery();
  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
    isError: usersError,
    error: usersFetchError,
  } = useGetUserListQuery({
    page,
    limit: rowsPerPage,
    status: status === "All" ? undefined : status,
    plan: plan === "All" ? undefined : plan,
    searchTerm: search.trim() || undefined,
  });

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
  }, [overviewError, usersError, overviewFetchError, usersFetchError, previousError]);

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
  const isRefreshing = isUsersFetching && !isUsersLoading;
  const showInitialSkeleton = isLoading && !overviewResponse && !usersResponse;

  if (showInitialSkeleton) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-3">
      <section>
        <h2 className="text-xl font-semibold text-[#3f5f7a]">User Management</h2>
        <p className="text-sm text-[#7e95ab]">View, search, and manage all users</p>
      </section>

      {isLoading && !overviewResponse ? <PageSkeleton /> : <StatsCards stats={stats} />}

      <UserFilters
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        category="All"
        onCategoryChange={() => undefined}
        type="All"
        onTypeChange={() => undefined}
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
        categories={["All"]}
        types={["All"]}
        plans={planOptions}
        statuses={statusOptions}
      />

      {isLoading && !usersResponse ? (
        <TableSkeleton />
      ) : (
        <div className={cn("relative", isRefreshing && "opacity-90")}>
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
            onSuspendUser={setSuspendingUser}
            onDeactivateUser={(user) =>
              toast.info(`Deactivate flow for ${user.name} is not wired yet.`)
            }
            onArchiveUser={(user) => toast.info(`Archive flow for ${user.name} is not wired yet.`)}
          />
        </div>
      )}

      {users.length === 0 && !isLoading ? (
        <div className="rounded-lg border border-dashed border-[#dce7f2] bg-white px-4 py-8 text-center text-sm text-[#7e95ab]">
          No users match the current filters.
        </div>
      ) : null}

      <UserDetailsModal
        open={!!viewingUser}
        user={viewingUser}
        onClose={() => setViewingUser(null)}
      />

      <SuspendUserModal
        open={!!suspendingUser}
        user={suspendingUser}
        onClose={() => setSuspendingUser(null)}
        onConfirm={(reason) => {
          if (suspendingUser) {
            toast.success(
              `Suspension confirmed for ${suspendingUser.name}${reason ? ` - ${reason}` : ""}.`
            );
          }
          setSuspendingUser(null);
        }}
      />
    </div>
  );
}
