import type { ApiEnvelope } from "./authApi";
import { baseApi } from "./baseApi";

export interface AdminUserOverview {
  totalUsers: number;
  activeAccounts: number;
  blockedAccounts: number;
  disabledAccounts: number;
}

export interface AdminUserListItem {
  _id?: string;
  id?: string;
  email: string;
  fullName: string;
  avatar?: string;
  city: string | null;
  status: "active" | "blocked" | "disabled" | string;
  role?: string;
  faculty: string | null;
  createdAt: string;
  plan: string | null;
}

export interface AdminUserDetails extends AdminUserListItem {
  phone?: string;
  updatedAt?: string;
}

export interface AdminUserListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: AdminUserListItem[];
}

export interface UserListParams {
  page?: number;
  limit?: number;
  status?: string;
  plan?: string;
  role?: string;
  city?: string;
  searchTerm?: string;
}

export interface UpdateUserStatusParams {
  id: string;
  status: "active" | "blocked" | "disabled";
}

function buildQuery(params?: UserListParams) {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status && params.status !== "All") searchParams.set("status", params.status);
  if (params.plan && params.plan !== "All") searchParams.set("plan", params.plan);
  if (params.role && params.role !== "All") searchParams.set("role", params.role);
  if (params.city) searchParams.set("city", params.city);
  if (params.searchTerm) searchParams.set("searchTerm", params.searchTerm);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserOverview: builder.query<ApiEnvelope<AdminUserOverview>, void>({
      query: () => "/admin/users/overview",
      providesTags: ["Users"],
    }),
    getUserList: builder.query<AdminUserListResponse, UserListParams | void>({
      query: (params) => `/admin/users/list${buildQuery(params ?? undefined)}`,
      providesTags: ["Users"],
    }),
    getUserById: builder.query<ApiEnvelope<AdminUserDetails>, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),
    updateUserStatus: builder.mutation<ApiEnvelope<AdminUserListItem>, UpdateUserStatusParams>({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Users", "Dashboard", "AdminOverview"],
    }),
  }),
});

export const {
  useGetUserOverviewQuery,
  useGetUserListQuery,
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,
} = userApi;

