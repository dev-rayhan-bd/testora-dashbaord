import type { ApiEnvelope } from "./authApi";
import { baseApi } from "./baseApi";

export interface SubscriptionOverviewData {
  activeSubscriptions: number;
  expiredThisMonth: number;
  cancelledPlans: number;
  expiringSoon: number;
}

export interface SubscriptionUser {
  id?: string;
  _id?: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export interface AdminSubscriptionItem {
  id: string;
  _id?: string;
  user: SubscriptionUser;
  product: string;
  plan?: string;
  planType: "yearly" | "monthly" | "one-time" | "Yearly" | "Monthly" | "One-time" | string;
  startDate: string;
  expiryDate: string;
  daysLeft?: number;
  daysRemaining?: number;
  isExpiringSoon?: boolean;
  status: "active" | "expired" | "cancelled" | "Active" | "Expired" | "Cancelled" | string;
  payment: "Stripe" | "Card" | "PayPal" | "Apple" | "Google Play" | "Manual" | string;
  orderId: string;
  price?: number;
  currency?: string;
  cancellationReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionListResponse {
  statusCode?: number;
  success?: boolean;
  message?: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: AdminSubscriptionItem[];
}

export interface SubscriptionListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  product?: string;
  planType?: "monthly" | "yearly" | "one-time" | string;
  status?: "active" | "expired" | "cancelled" | string;
  expiring?: "7d" | "30d" | string;
}

export interface UpdateSubscriptionStatusPayload {
  id: string;
  status?: "active" | "expired" | "cancelled" | string;
  cancellationReason?: string;
  extensionDays?: number;
}

function buildQuery(params?: SubscriptionListParams) {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.searchTerm) searchParams.set("searchTerm", params.searchTerm.trim());
  if (params.product && params.product !== "All") searchParams.set("product", params.product);
  if (params.planType && params.planType !== "All") searchParams.set("planType", params.planType);
  if (params.status && params.status !== "All") searchParams.set("status", params.status);
  if (params.expiring && params.expiring !== "All") searchParams.set("expiring", params.expiring);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionOverview: builder.query<ApiEnvelope<SubscriptionOverviewData>, void>({
      query: () => "/admin/subscriptions/overview",
      providesTags: ["Subscriptions"],
    }),
    getSubscriptionsList: builder.query<SubscriptionListResponse, SubscriptionListParams | void>({
      query: (params) => `/admin/subscriptions/list${buildQuery(params ?? undefined)}`,
      providesTags: ["Subscriptions"],
    }),
    updateSubscriptionStatus: builder.mutation<
      ApiEnvelope<AdminSubscriptionItem>,
      UpdateSubscriptionStatusPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/subscriptions/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Subscriptions", "Dashboard", "AdminOverview"],
    }),
  }),
});

export const {
  useGetSubscriptionOverviewQuery,
  useGetSubscriptionsListQuery,
  useUpdateSubscriptionStatusMutation,
} = subscriptionApi;
