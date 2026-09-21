import type { AdminUserListItem } from "@/store/apis";
import type { UserManagementRow } from "@/components/users/UserRow";

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatRelativeTime(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

export function mapUser(item: AdminUserListItem): UserManagementRow {
  const initials = item.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return {
    id: item.email,
    initials: initials || "U",
    name: item.fullName,
    email: item.email,
    preferredCategory: item.faculty ?? "General",
    type: "Student",
    activePlan: item.plan ?? "Free",
    lastActivity: formatRelativeTime(item.createdAt),
    joinedDate: formatDate(item.createdAt),
    status:
      item.status === "active"
        ? "Active"
        : item.status === "blocked"
          ? "Suspended"
          : "Inactive",
  };
}
