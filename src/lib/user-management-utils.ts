import type { AdminUserListItem } from "@/store/apis";
import type { UserManagementRow } from "@/components/users/UserRow";

export function formatDate(value?: string) {
  if (!value) return "N/A";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatRelativeTime(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "N/A";
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

export function formatPlanName(plan?: string | null) {
  if (!plan || plan.toLowerCase() === "free" || plan.toLowerCase() === "none") return "Free";
  const norm = plan.toLowerCase();
  if (norm === "semi_matura" || norm === "semi matura") return "Semi Matura";
  if (norm === "matura") return "Matura";
  if (norm === "provime") return "Provime";
  return plan;
}

export function mapUser(item: AdminUserListItem): UserManagementRow {
  const initials = (item.fullName || "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const rawStatus = (
    item.status === "blocked"
      ? "blocked"
      : item.status === "disabled"
        ? "disabled"
        : "active"
  ) as "active" | "blocked" | "disabled";

  const statusDisplay =
    rawStatus === "active"
      ? "Active"
      : rawStatus === "blocked"
        ? "Blocked"
        : "Disabled";

  const role = item.role || "student";

  return {
    id: item._id || item.id || item.email,
    initials: initials || "U",
    name: item.fullName || "Unnamed User",
    email: item.email || "N/A",
    avatar: item.avatar,
    role: role.charAt(0).toUpperCase() + role.slice(1),
    city: item.city || undefined,
    type: role.charAt(0).toUpperCase() + role.slice(1),
    activePlan: formatPlanName(item.plan),
    joinedDate: formatDate(item.createdAt),
    status: statusDisplay,
    rawStatus,
    createdAt: item.createdAt,
  };
}
