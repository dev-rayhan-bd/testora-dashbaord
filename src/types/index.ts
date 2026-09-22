// Global type definitions for testora-dashboard

export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type UserStatus = "Active" | "Suspended" | "Inactive" | "Blocked" | "Disabled";
export type PlanType = "Yearly" | "Monthly" | "One-time";
export type SubscriptionStatus = "Active" | "Expired" | "Cancelled";
export type PaymentMethod = "Stripe" | "PayPal" | "Card" | "Manual";

export interface User {
  id: string;
  initials: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  activePlan: string;
  lastActivity: string;
  joinedDate: string;
  status: UserStatus;
  planDate: string;
  planExpiration: string;
  completedQuizzes: number;
  averageScore: number;
  lastLogin: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PremiumSubscription {
  id: string;
  userId?: string;
  initials?: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  product: string;
  productColor?: string;
  plan?: string;
  planType: PlanType | string;
  startDate: string;
  expiryDate: string;
  status: SubscriptionStatus | string;
  payment: PaymentMethod | string;
  orderId: string;
  amount?: string;
  daysRemaining?: number;
  expiringWarning?: boolean;
}

export interface PaymentHistoryEntry {
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
}
