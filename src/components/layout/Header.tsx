"use client";

import { useAppSelector } from "@/store/hooks";
import { Menu } from "lucide-react";

type DashboardHeaderProps = {
  onOpenSidebar: () => void;
};

export default function DashboardHeader({ onOpenSidebar }: DashboardHeaderProps) {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-20 border-b border-[#c9dbee] bg-[#d8e8f7] px-3 py-2 sm:px-4 lg:px-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#b9d2ea] bg-white text-[#587189] lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
          <h1 className="text-sm font-semibold text-[#3f5f7a] sm:text-base">Admin Dashboard</h1>
        </div>

        {/* User profile section */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#3f5f7a] leading-tight">
                {user.name || "-"}
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-[#7087a0] leading-tight">
                {user.email || "-"}
              </p>
            </div>
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#bad3ea] bg-white shadow-sm">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt={user.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-[#2f86d8] uppercase">
                  {(user.name || "A").charAt(0)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
