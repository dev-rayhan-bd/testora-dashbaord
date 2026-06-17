import GuestGuard from "@/components/layout/GuestGuard";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
        {children}
      </div>
    </GuestGuard>
  );
}
