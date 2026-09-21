import type { ApiEnvelope } from "./authApi";
import { baseApi } from "./baseApi";

// ─── Legacy interfaces ────────────────────────────────────────────────────────
export interface AdminDashboardStats {
  totalUsers: number;
  activeAccounts: number;
  blockedAccounts: number;
  premiumUsers: number;
}

export interface AdminGrowthPoint {
  label: string;
  count: number;
}

export interface AdminRecentUser {
  fullName: string;
  avatar: string | null;
  city: string | null;
  email: string;
  status: string;
  plan: string | null;
  createdAt: string;
}

// ─── Unified Admin Overview interfaces ────────────────────────────────────────
export interface IAdminOverviewUserStats {
  totalUsers: number;
  activeAccounts: number;
  blockedAccounts: number;
  premiumUsers: number;
  growthRate?: string;
}

export interface IAdminOverviewUserGrowth {
  label: string;
  count: number;
}

export interface IAdminOverviewProduct {
  id?: string;
  name: string;
  count: number;
  percentage: number;
  revenue?: number;
  users?: number;
  stock?: number;
  price?: number;
  image?: string | null;
}

export interface IAdminOverviewProductInsights {
  topProduct?: {
    name: string;
    users: number;
  };
  fastestGrowing?: {
    name: string;
    rate: string;
  };
  latestAccepted?: {
    name: string;
    newUsers: number;
  };
}

export interface IAdminOverviewRecentUser {
  id: string;
  fullName: string;
  avatar: string | null;
  city?: string;
  email: string;
  role?: string;
  status: string;
  plan: string;
  joinedDate: string;
}

export interface IAdminOverviewContentSummaryItem {
  count: number;
  monthlyDelta: string;
}

export interface IAdminOverviewContentSummary {
  totalQuestions: IAdminOverviewContentSummaryItem;
  totalTests: IAdminOverviewContentSummaryItem;
  draftQuestions: IAdminOverviewContentSummaryItem;
  blogPosts: IAdminOverviewContentSummaryItem;
  marketplaceProducts: IAdminOverviewContentSummaryItem;
}

export interface IAdminOverviewContentAlertItem {
  count: number;
  label: string;
  description: string;
}

export interface IAdminOverviewContentAlerts {
  totalAlerts: number;
  draftQuestionsPending: IAdminOverviewContentAlertItem;
  testsMissingQuestions: IAdminOverviewContentAlertItem;
  ordersRequiringAttention: IAdminOverviewContentAlertItem;
  expiringSubscriptions: IAdminOverviewContentAlertItem;
  unpublishedBlogs: IAdminOverviewContentAlertItem;
}

export interface IAdminOverviewCategoryItem {
  id?: string;
  name: string;
  slug?: string;
  count: number;
  percentage: number;
}

export interface IAdminOverviewCategoryDistribution {
  totalUsers: number;
  categories: IAdminOverviewCategoryItem[];
  mostUsedThisMonth: string;
}

export interface IAdminOverviewPlanSnapshotItem {
  name: string;
  percentage: number;
}

export interface IAdminOverviewSalesNoteItem {
  name: string;
  revenue: number;
  users: number;
  change: string;
}

export interface IAdminOverviewPlanSummary {
  planSnapshot?: IAdminOverviewPlanSnapshotItem[];
  salesNotes?: IAdminOverviewSalesNoteItem[];
}

export interface IAdminOverviewData {
  year: number;
  userStats: IAdminOverviewUserStats;
  userGrowth: IAdminOverviewUserGrowth[];
  premiumUsersByProduct: {
    totalPremiumUsers: number;
    products: IAdminOverviewProduct[];
    insights: IAdminOverviewProductInsights;
  };
  recentUsers: IAdminOverviewRecentUser[];
  contentSummary: IAdminOverviewContentSummary;
  contentAlerts?: IAdminOverviewContentAlerts;
  categoryDistribution: IAdminOverviewCategoryDistribution;
  planSummary?: IAdminOverviewPlanSummary;
  salesNotes?: IAdminOverviewSalesNoteItem[];
}

export type IAdminOverviewResponse = ApiEnvelope<IAdminOverviewData>;

// ─── API endpoints ─────────────────────────────────────────────────────────────
export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<IAdminOverviewResponse, { year?: number } | void>({
      query: (params) => ({
        url: "/admin/overview",
        method: "GET",
        params: params && typeof params === "object" && params.year ? { year: params.year } : undefined,
      }),
      providesTags: ["AdminOverview"],
    }),
  }),
});

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<ApiEnvelope<AdminDashboardStats>, void>({
      query: () => "/admin/overview/stats",
      providesTags: ["Dashboard"],
    }),
    getUserGrowth: builder.query<ApiEnvelope<AdminGrowthPoint[]>, { year?: number } | void>({
      query: (params) => ({
        url: "/admin/overview/user-growth",
        method: "GET",
        params: params && typeof params === "object" && params.year ? { year: params.year } : undefined,
      }),
      providesTags: ["Dashboard"],
    }),
    getRecentActiveUsers: builder.query<ApiEnvelope<AdminRecentUser[]>, void>({
      query: () => "/admin/overview/recent-active-users",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetAdminOverviewQuery } = overviewApi;
export const {
  useGetDashboardStatsQuery,
  useGetUserGrowthQuery,
  useGetRecentActiveUsersQuery,
} = dashboardApi;
