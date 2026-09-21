export const APP_NAME = "Testora Dashboard";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  PREMIUM_USERS: "/premium-users",
  QUESTIONS: "/questions",
  BLOG: "/blog",
  MARKETPLACE: "/marketplace",
  ORDERS: "/orders",
  SETTINGS: "/settings",
} as const; 

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://10.10.28.81:5009/api/v1";

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
} as const;
