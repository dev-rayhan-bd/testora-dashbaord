"use client";

import { useGetMeQuery } from "@/store/apis";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUser } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const {
    data: getMeData,
    isLoading: getMeLoading,
  } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (getMeData?.data) {
      dispatch(updateUser(getMeData.data));
    }
  }, [getMeData, dispatch]);

  if (authLoading || (isAuthenticated && getMeLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f8fc]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2f86d8]/20 border-t-[#2f86d8]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
