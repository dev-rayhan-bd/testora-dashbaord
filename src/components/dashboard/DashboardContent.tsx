"use client";

import DashboardAreaChart from "@/components/charts/DashboardAreaChart";
import DashboardDonutChart from "@/components/charts/DashboardDonutChart";
import YearSelect from "@/components/dashboard/YearSelect";
import { dashboardYears, type DashboardYear } from "@/lib/dashboard-sample-data";
import {
  formatCount,
  formatDate,
  formatRelativeTime,
  getPlanClass,
  getStatusClass,
} from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";
import {
  useGetAdminOverviewQuery,
  type IAdminOverviewProduct,
  type IAdminOverviewRecentUser,
} from "@/store/apis";
import {
  ArrowUpRight,
  BookOpen,
  Clock,
  Crown,
  DollarSign,
  FileText,
  HelpCircle,
  Package,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

function Surface({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section
      className={cn(
        "rounded-xl border border-[#dce7f2] bg-white shadow-xs transition-shadow duration-200 hover:shadow-sm",
        className
      )}
    >
      {children}
    </section>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-slate-200/80", className)} />;
}

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Surface key={index} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </Surface>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Surface className="p-5">
          <Skeleton className="mb-4 h-4 w-40" />
          <Skeleton className="h-76 w-full" />
        </Surface>
        <Surface className="p-5">
          <Skeleton className="mb-4 h-4 w-48" />
          <Skeleton className="h-76 w-full" />
        </Surface>
      </div>
      <Surface className="overflow-hidden p-5">
        <Skeleton className="h-64 w-full" />
      </Surface>
    </div>
  );
}

function RecentUsersTable({ users }: { users: IAdminOverviewRecentUser[] }) {
  return (
    <Surface className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#e6eff7] px-5 py-3.5 bg-[#fbfdff]">
        <div>
          <h3 className="text-sm font-semibold text-[#2c4b66]">Recent User Registrations</h3>
          <p className="text-xs text-[#7f99b2]">Latest student accounts registered on the platform</p>
        </div>
        <span className="rounded-full bg-[#edf5fd] px-2.5 py-0.5 text-xs font-medium text-[#2f86d8]">
          {users.length} Active
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-215 text-left">
          <thead className="bg-[#f4f8fc] text-[11px] font-semibold text-[#5c758e] uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">#</th>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">City</th>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Joined Date</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf3f9]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-xs text-[#8fa2b5]">
                  No recent users found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id || `${user.email}-${index}`}
                  className="text-xs text-[#526b82] transition-colors hover:bg-[#f9fcff]"
                >
                  <td className="px-5 py-3.5 font-medium text-[#8ea4b8]">{index + 1}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {user.avatar && user.avatar.startsWith("http") ? (
                        <Image
                          src={user.avatar}
                          alt={user.fullName || "User"}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full border border-slate-200 object-cover shadow-xs"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#cbe1f7] bg-gradient-to-br from-[#e0effe] to-[#cfe4fc] text-xs font-bold text-[#2072c4]">
                          {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[#294660]">{user.fullName || "Unnamed User"}</p>
                        <p className="text-[11px] text-[#869cb0]">{user.email || "N/A"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#5e778e]">{user.city || "N/A"}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                        getPlanClass(user.plan)
                      )}
                    >
                      {user.plan || "Free"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#6c849b]">
                    {user.joinedDate ? formatDate(user.joinedDate) : "N/A"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize",
                        getStatusClass(user.status)
                      )}
                    >
                      {user.status || "active"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}

export default function DashboardContent() {
  const [selectedYear, setSelectedYear] = useState<DashboardYear>(2026);
  const years = dashboardYears;

  const {
    data: overviewResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAdminOverviewQuery({ year: selectedYear });

  const overview = overviewResponse?.data;
  const previousError = useRef<string | null>(null);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsManualRefreshing(true);
      const [res] = await Promise.all([
        refetch(),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
      if (res?.data) {
        toast.success("Dashboard metrics refreshed successfully!");
      } else if (res?.error) {
        toast.error("Failed to refresh metrics. Please try again.");
      } else {
        toast.success("Dashboard metrics updated.");
      }
    } catch {
      toast.error("Network error while refreshing metrics.");
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const isBusy = isFetching || isManualRefreshing;

  useEffect(() => {
    if (isError && error) {
      const errObj = error as { data?: { message?: string }; error?: string };
      const message = errObj.data?.message || errObj.error || "Unable to load dashboard overview data.";
      if (previousError.current !== message) {
        previousError.current = message;
        toast.error(message);
      }
    }
  }, [isError, error]);

  // Top stats cards data
  const stats = useMemo(() => {
    return [
      {
        label: "Total Users",
        value: overview?.userStats?.totalUsers ?? 0,
        sub: "Platform students",
        icon: Users,
        badge: overview?.userStats?.growthRate,
        color: "blue",
      },
      {
        label: "Active Accounts",
        value: overview?.userStats?.activeAccounts ?? 0,
        sub: "Verified students",
        icon: UserCheck,
        badge: null,
        color: "emerald",
      },
      {
        label: "Blocked Accounts",
        value: overview?.userStats?.blockedAccounts ?? 0,
        sub: "Restricted access",
        icon: UserX,
        badge: null,
        color: "rose",
      },
      {
        label: "Premium Users",
        value: overview?.userStats?.premiumUsers ?? 0,
        sub: "Active subscribers",
        icon: Crown,
        badge: null,
        color: "violet",
      },
    ];
  }, [overview]);

  // User growth area chart data
  const growthData = useMemo(() => {
    return (overview?.userGrowth ?? []).map((item) => ({
      month: item.label,
      users: item.count,
    }));
  }, [overview]);

  // Products list from response
  const products: IAdminOverviewProduct[] = useMemo(() => {
    return overview?.premiumUsersByProduct?.products ?? [];
  }, [overview]);

  // Total units sold
  const totalUnitsSold = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.count || 0), 0);
  }, [products]);

  // Total marketplace revenue
  const totalRevenue = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.revenue || 0), 0);
  }, [products]);

  // Quick insights
  const premiumInsights = useMemo(() => {
    const insights = overview?.premiumUsersByProduct?.insights;
    const topProduct =
      insights?.topProduct ||
      (products[0] ? { name: products[0].name, users: products[0].users ?? products[0].count } : undefined);
    const fastestGrowing =
      insights?.fastestGrowing ||
      (products[1] ? { name: products[1].name, rate: `+${products[1].count} sold` } : undefined);
    const latestAccepted =
      insights?.latestAccepted ||
      (products[products.length - 1]
        ? { name: products[products.length - 1].name, newUsers: products.length }
        : undefined);

    return {
      topProduct,
      fastestGrowing,
      latestAccepted,
    };
  }, [overview, products]);

  // Donut chart data for category distribution
  const donutData = useMemo(() => {
    const categories = overview?.categoryDistribution?.categories ?? [];
    const colors = ["#2f86d8", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];
    return categories.map((cat, idx) => ({
      label: cat.name,
      value: cat.count,
      color: colors[idx % colors.length],
    }));
  }, [overview]);

  // Sales notes from top-level or planSummary
  const salesNotes = useMemo(() => {
    if (overview?.salesNotes && overview.salesNotes.length > 0) {
      return overview.salesNotes;
    }
    if (overview?.planSummary?.salesNotes && overview.planSummary.salesNotes.length > 0) {
      return overview.planSummary.salesNotes;
    }
    return [];
  }, [overview]);

  // Content summary metrics
  const contentMetrics = useMemo(() => {
    const summary = overview?.contentSummary;
    return [
      {
        label: "Total Questions",
        value: formatCount(summary?.totalQuestions?.count),
        delta: summary?.totalQuestions?.monthlyDelta ?? "+0 this month",
        icon: HelpCircle,
        color: "text-[#2f86d8] bg-[#eff6ff] border-[#dbeafe]",
      },
      {
        label: "Total Tests",
        value: formatCount(summary?.totalTests?.count),
        delta: summary?.totalTests?.monthlyDelta ?? "+0 new tests",
        icon: FileText,
        color: "text-[#10b981] bg-[#ecfdf5] border-[#d1fae5]",
      },
      {
        label: "Draft Questions",
        value: formatCount(summary?.draftQuestions?.count),
        delta: summary?.draftQuestions?.monthlyDelta ?? "+0 pending review",
        icon: Clock,
        color: "text-[#f59e0b] bg-[#fffbeb] border-[#fef3c7]",
      },
      {
        label: "Blog Posts",
        value: formatCount(summary?.blogPosts?.count),
        delta: summary?.blogPosts?.monthlyDelta ?? "+0 this week",
        icon: BookOpen,
        color: "text-[#8b5cf6] bg-[#f5f3ff] border-[#ede9fe]",
      },
      {
        label: "Marketplace Products",
        value: formatCount(summary?.marketplaceProducts?.count),
        delta: summary?.marketplaceProducts?.monthlyDelta ?? "+0 new listings",
        icon: ShoppingBag,
        color: "text-[#06b6d4] bg-[#ecfeff] border-[#cffafe]",
      },
    ];
  }, [overview]);

  const recentUsers = overview?.recentUsers ?? [];

  if (isLoading && !overview) {
    return <SectionSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1e293b]">Admin Dashboard Overview</h2>
          <p className="text-xs text-[#64748b]">
            Unified analytics for platform users, marketplace products, and study materials
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isBusy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#475569] shadow-xs hover:bg-slate-50 hover:text-[#2f86d8] transition-colors disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 text-[#2f86d8]", isBusy && "animate-spin")} />
            <span>{isBusy ? "Refreshing..." : "Refresh Overview"}</span>
          </button>
        </div>
      </div>

      {/* ── 4 Top KPI Cards ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Surface key={item.label} className="p-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl border shadow-xs",
                    item.color === "blue" && "border-blue-200 bg-blue-50 text-[#2f86d8]",
                    item.color === "emerald" && "border-emerald-200 bg-emerald-50 text-emerald-600",
                    item.color === "rose" && "border-rose-200 bg-rose-50 text-rose-600",
                    item.color === "violet" && "border-violet-200 bg-violet-50 text-violet-600"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#64748b]">{item.label}</p>
                  <p className="text-2xl font-bold tracking-tight text-[#1e293b]">
                    {formatCount(item.value)}
                  </p>
                </div>
              </div>
              {item.badge && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <TrendingUp className="h-3 w-3" />
                  {item.badge}
                </span>
              )}
            </div>
            <p className="mt-2 text-[11px] text-[#94a3b8]">{item.sub}</p>
          </Surface>
        ))}
      </div>

      {/* ── Growth Chart & Product Performance ── */}
      <div className="grid gap-4 xl:grid-cols-2">
        {/* Monthly User Growth */}
        <Surface className="p-5 flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-[#1e293b]">Monthly Student Growth</h3>
                <p className="text-xs text-[#64748b]">Registration trends across {selectedYear}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#eff6ff] px-2 py-1 text-[11px] font-semibold text-[#2f86d8]">
                  {stats[0].value} Registered
                </span>
                <YearSelect
                  years={[...years]}
                  value={selectedYear}
                  onChange={(value) => setSelectedYear(value as DashboardYear)}
                />
              </div>
            </div>
            <div className="mt-2">
              <DashboardAreaChart data={growthData} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-[#64748b]">
            <span>Peak Activity: September ({growthData.find((d) => d.month === "Sep")?.users || 0} students)</span>
            <span className="font-medium text-[#2f86d8]">Real-time Database Metric</span>
          </div>
        </Surface>

        {/* Product & Premium Analytics */}
        <Surface className="p-5 flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-[#1e293b]">Product Sales & Performance</h3>
                <p className="text-xs text-[#64748b]">Marketplace revenue and sales distribution</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#2f86d8]">
                  ${totalRevenue.toFixed(2)} Revenue
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {totalUnitsSold} Units Sold
                </span>
              </div>
            </div>

            {/* Product Performance Items */}
            <div className="space-y-3">
              {products.length === 0 ? (
                <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                  No products in catalog
                </div>
              ) : (
                products.map((p) => {
                  const sharePct = p.percentage ?? 0;
                  return (
                    <div
                      key={p.id || p.name}
                      className="group rounded-xl border border-slate-100 bg-[#f8fbff] p-3.5 transition-all hover:border-blue-200 hover:bg-white hover:shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              width={38}
                              height={38}
                              className="h-9 w-9 shrink-0 rounded-lg border border-slate-200 object-cover shadow-xs"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-[#2f86d8]">
                              <Package className="h-4 w-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4
                              className="text-xs font-semibold text-[#1e293b] truncate group-hover:text-[#2f86d8]"
                              title={p.name}
                            >
                              {p.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#64748b]">
                              <span className="font-semibold text-emerald-600">${p.price?.toFixed(2) || "0.00"}</span>
                              <span>•</span>
                              <span>{p.stock !== undefined ? `${p.stock} in stock` : "Available"}</span>
                              <span>•</span>
                              <span>{p.users !== undefined ? `${p.users} buyer(s)` : ""}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-[#1e293b]">${p.revenue?.toFixed(2) || "0.00"}</span>
                          <p className="text-[11px] font-semibold text-[#2f86d8]">
                            {p.count || 0} sold ({sharePct}%)
                          </p>
                        </div>
                      </div>

                      {/* Visual progress bar */}
                      <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-200/80 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#2f86d8] to-[#60a5fa] transition-all duration-500"
                          style={{ width: `${Math.max(sharePct, sharePct > 0 ? 5 : 0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Insights Cards */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">Quick Performance Insights</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-2.5">
                <p className="text-[10px] font-bold uppercase text-[#2f86d8] flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Top Product
                </p>
                <p className="mt-1 text-xs font-semibold text-[#1e293b] truncate" title={premiumInsights.topProduct?.name}>
                  {premiumInsights.topProduct?.name || "Official Book"}
                </p>
                <p className="text-[10px] text-[#64748b]">
                  {premiumInsights.topProduct?.users || 0} active buyer(s)
                </p>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-2.5">
                <p className="text-[10px] font-bold uppercase text-emerald-700 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Growth Rate
                </p>
                <p className="mt-1 text-xs font-semibold text-[#1e293b] truncate" title={premiumInsights.fastestGrowing?.name}>
                  {premiumInsights.fastestGrowing?.name || "Practice Workbook"}
                </p>
                <p className="text-[10px] text-emerald-600 font-medium">
                  {premiumInsights.fastestGrowing?.rate || "+0% this year"}
                </p>
              </div>

              <div className="rounded-lg border border-amber-100 bg-gradient-to-br from-amber-50/50 to-white p-2.5">
                <p className="text-[10px] font-bold uppercase text-amber-700 flex items-center gap-1">
                  <Package className="h-3 w-3" /> Catalog Status
                </p>
                <p className="mt-1 text-xs font-semibold text-[#1e293b] truncate" title={premiumInsights.latestAccepted?.name}>
                  {premiumInsights.latestAccepted?.name || "All Inventory"}
                </p>
                <p className="text-[10px] text-[#64748b]">
                  {products.length} live catalog listings
                </p>
              </div>
            </div>
          </div>
        </Surface>
      </div>

      {/* ── Platform Content Summary & Category Distribution ── */}
      <Surface className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#1e293b]">Platform Content & Asset Metrics</h3>
            <p className="text-xs text-[#64748b]">Real-time count of exam content, blogs, and marketplace inventory</p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isBusy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#475569] shadow-xs hover:bg-slate-50 hover:text-[#2f86d8] transition-colors disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 text-[#2f86d8]", isBusy && "animate-spin")} />
            <span>{isBusy ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>

        {/* 5 Content KPI Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {contentMetrics.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-100 bg-gradient-to-b from-[#fbfdff] to-[#f4f8fc] p-3.5 transition-all hover:border-slate-300 hover:shadow-xs"
            >
              <div className={cn("mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg border", item.color)}>
                <item.icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-[#1e293b]">{item.value}</p>
              <p className="mt-0.5 text-xs font-medium text-[#475569]">{item.label}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <ArrowUpRight className="h-3 w-3" />
                {item.delta}
              </p>
            </div>
          ))}
        </div>

        {/* Most Used Category Section (Without empty Content Alerts) */}
        <div className="mt-5 rounded-xl border border-[#e2eaf2] bg-[#fbfdff] p-5">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-[#1e293b]">Category Distribution & Materials</h4>
              <p className="text-xs text-[#64748b]">Marketplace categories and study material distribution</p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2f86d8]">
              Most active: {overview?.categoryDistribution?.mostUsedThisMonth || "Books & Study Materials"}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-center">
            {/* Donut Chart */}
            <div className="flex justify-center">
              {donutData.length > 0 && donutData.some((d) => d.value > 0) ? (
                <DashboardDonutChart data={donutData} centerLabel="study materials" />
              ) : (
                <div className="flex h-44 w-full items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                  No category session data available
                </div>
              )}
            </div>

            {/* Category Progress Bars */}
            <div className="space-y-3">
              {(overview?.categoryDistribution?.categories ?? []).map((cat, idx) => {
                const colors = ["#2f86d8", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];
                const color = colors[idx % colors.length];
                return (
                  <div key={cat.id || cat.name} className="rounded-lg border border-slate-200/70 bg-white p-3 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-2 text-[#334155]">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        {cat.name}
                      </span>
                      <span className="text-[#1e293b]">
                        {cat.count} items ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cat.percentage}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Surface>

      {/* ── Recent Users Table ── */}
      <RecentUsersTable users={recentUsers} />

      {/* ── Sales & Product Summary (Replaces old blank charts) ── */}
      <Surface className="p-5">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-[#1e293b]">Marketplace Sales & Revenue Breakdown</h3>
            <p className="text-xs text-[#64748b]">Live breakdown of product transactions, buyers, and inventory health</p>
          </div>
          <span className="text-xs text-[#8ea1b4]">
            Updated {recentUsers[0]?.joinedDate ? formatRelativeTime(recentUsers[0].joinedDate) : "Today"}
          </span>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {/* Left: Product Inventory & Revenue Table */}
          <div className="rounded-xl border border-slate-200/80 bg-[#fbfdff] p-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#475569] flex items-center gap-2">
              <DollarSign className="h-3.5 w-3.5 text-emerald-600" /> Product Inventory & Revenue Share
            </h4>
            <div className="space-y-2.5">
              {products.length === 0 ? (
                <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                  No products available
                </div>
              ) : (
                products.map((p) => (
                  <div
                    key={p.id || p.name}
                    className="flex items-center justify-between rounded-lg border border-slate-200/60 bg-white p-3 shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-xs font-semibold text-[#1e293b] truncate" title={p.name}>
                        {p.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-[#64748b]">
                        <span className="font-semibold text-emerald-600">${p.price?.toFixed(2) || "0.00"}</span>
                        <span>•</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-[#475569]">
                          {p.stock !== undefined ? `${p.stock} in stock` : "In stock"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-[#1e293b]">${p.revenue?.toFixed(2) || "0.00"}</p>
                      <span className="inline-block text-[11px] font-semibold text-[#2f86d8]">
                        {p.percentage}% market share
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Live Sales Transactions & Order Activity */}
          <div className="rounded-xl border border-slate-200/80 bg-[#fbfdff] p-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#475569] flex items-center gap-2">
              <ShoppingBag className="h-3.5 w-3.5 text-blue-600" /> Sales Notes & Transaction Status
            </h4>
            <div className="space-y-2.5">
              {salesNotes.length === 0 ? (
                <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                  No sales notes recorded
                </div>
              ) : (
                salesNotes.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between rounded-lg border border-slate-200/60 bg-white p-3 shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="text-xs font-semibold text-[#1e293b] truncate" title={item.name}>
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#64748b]">
                        <span className="font-semibold text-emerald-600">${item.revenue.toFixed(2)}</span>
                        {" • "}
                        <span>{item.users} {item.users === 1 ? "buyer" : "buyers"}</span>
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        item.change.includes("+")
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border border-slate-200 bg-slate-100 text-slate-700"
                      )}
                    >
                      {item.change}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Surface>
    </div>
  );
}
