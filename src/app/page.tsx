"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = typeof window !== "undefined" ? window.localStorage.getItem("accessToken") : null;
    const refreshToken = typeof window !== "undefined" ? window.localStorage.getItem("refreshToken") : null;

    if (accessToken || refreshToken) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
