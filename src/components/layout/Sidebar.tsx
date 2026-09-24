"use client";

import { cn } from "@/lib/utils";
import {
  CircleHelp,
  Crown,
  FileText,
  LayoutGrid,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Tags,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/users", label: "User Management", icon: Users },
  { href: "/premium-users", label: "Premium Users", icon: Crown },
  { href: "/questions", label: "Question & Test", icon: CircleHelp },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/orders", label: "Order", icon: Package },
];

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    // Clear localStorage
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
      // Clear auth cookie
      document.cookie = "auth=; path=/; max-age=0";
    }

    // Hard reload to login page to completely unmount dashboard and clear all state
    // This prevents race conditions with pending API calls
    window.location.href = "/login";
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-slate-900/30 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-[#c9dbee] bg-[#d8e8f7] transition-transform lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:w-56 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-[#c5d9ee] px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#bad3ea] bg-white text-[#2f86d8]">
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor">
                <path
                  d="M4 16L12 8L20 16"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M8 16H16" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold tracking-wide text-[#43627d]">TESTORA</p>
              <p className="text-[10px] text-[#7087a0]">Admin Panel</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#b9d2ea] bg-white text-[#7087a0] lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-md border px-3 py-2 text-[13px] font-medium transition-colors",
                isActive(item.href)
                  ? "border-[#bfd7ee] bg-[#2f86d8] text-white"
                  : "border-transparent text-[#557089] hover:border-[#bfd6eb] hover:bg-[#edf4fb] hover:text-[#3f5f7a]"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#c5d9ee] px-3 py-3">
          <Link
            href="/settings"
            onClick={onClose}
            className={cn(
              "mb-1.5 flex items-center gap-3 rounded-md border px-3 py-2 text-[13px] font-medium transition-colors",
              isActive("/settings")
                ? "border-[#bfd7ee] bg-[#2f86d8] text-white"
                : "border-transparent text-[#557089] hover:border-[#bfd6eb] hover:bg-[#edf4fb] hover:text-[#3f5f7a]"
            )}
          >
            <Settings className="h-4 w-4 shrink-0" />
            Settings
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md border border-transparent px-3 py-2 text-left text-[13px] font-medium text-[#557089] transition-colors hover:border-[#bfd6eb] hover:bg-[#edf4fb] hover:text-[#3f5f7a]"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
