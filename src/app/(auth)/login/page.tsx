"use client";

import { cn } from "@/lib/utils";
import { getErrorMessage, useLoginMutation } from "@/store/apis";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login({ email: data.email, password: data.password }).unwrap();

      const user = response.data.user ?? {
        id: response.data.userId ?? "",
        name: data.email.split("@")[0] || "User",
        email: data.email,
        role: "admin",
      };

      if (typeof window !== "undefined") {
        window.localStorage.setItem("accessToken", response.data.accessToken);
        if (response.data.refreshToken) {
          window.localStorage.setItem("refreshToken", response.data.refreshToken);
        }
        document.cookie = `auth=true; path=/; max-age=${60 * 60 * 24 * 7}`;
      }

      dispatch(
        setCredentials({
          user,
          token: response.data.accessToken,
          refreshToken: response.data.refreshToken ?? null,
        })
      );

      toast.success(response.message || "Logged in successfully.");
      router.push("/dashboard");
    } catch (error) {
      const message = getErrorMessage(error, "Invalid credentials. Please try again.");
      toast.error(message);
    }
  };

  const isSubmittingForm = isSubmitting || isLoggingIn;

  if (isAuthenticated) return null;

  return (
    <div className="w-full max-w-100">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Testora</h1>
      <p className="mb-6 text-sm text-gray-500">Login to your account</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Email or Username */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              autoComplete="email"
              {...register("email")}
              placeholder="Enter your email"
              className={cn(
                "w-full rounded-lg border py-2.5 pr-3.5 pl-10 text-sm text-gray-900 placeholder-gray-400 transition outline-none",
                "focus:border-primary focus:ring-primary/20 focus:ring-2",
                errors.email
                  ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/20"
                  : "border-gray-200 bg-white"
              )}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <Link
              href={"/forgot-password"}
              className="text-primary text-xs font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              placeholder="Enter your password"
              className={cn(
                "w-full rounded-lg border py-2.5 pr-10 pl-10 text-sm text-gray-900 placeholder-gray-400 transition outline-none",
                "focus:border-primary focus:ring-primary/20 focus:ring-2",
                errors.password
                  ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/20"
                  : "border-gray-200 bg-white"
              )}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmittingForm}
          className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmittingForm && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {isSubmittingForm ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
