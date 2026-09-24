import { API_BASE_URL } from "@/constants";
import { logout, setCredentials } from "@/store/slices/authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { auth?: { token?: string | null } };
    const token = state.auth?.token;

    if (token) {
      headers.set("authorization", token.startsWith("Bearer ") ? token : `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (
  args: Parameters<typeof rawBaseQuery>[0],
  api: Parameters<typeof rawBaseQuery>[1],
  extraOptions: Parameters<typeof rawBaseQuery>[2]
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && "status" in result.error && result.error.status === 401) {
    const refreshToken =
      typeof window !== "undefined" ? window.localStorage.getItem("refreshToken") : null;

    if (!refreshToken) {
      api.dispatch(logout());
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");
      }
      return result;
    }

    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    const refreshData = refreshResult.data as
      | {
          data?: {
            accessToken?: string;
            refreshToken?: string;
            user?: { id: string; name: string; email: string; role: string; avatar?: string };
          };
        }
      | undefined;

    const accessToken = refreshData?.data?.accessToken;
    const nextRefreshToken = refreshData?.data?.refreshToken ?? refreshToken;
    const user = refreshData?.data?.user;

    if (accessToken) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("accessToken", accessToken);
        window.localStorage.setItem("refreshToken", nextRefreshToken);
      }

      if (user) {
        api.dispatch(
          setCredentials({
            user,
            token: accessToken,
            refreshToken: nextRefreshToken,
          })
        );
      }

      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Dashboard", "Users", "Auth", "Questions", "AdminOverview", "Subscriptions", "Blogs", "Categories", "Products", "Orders"],
  endpoints: () => ({}),
});
