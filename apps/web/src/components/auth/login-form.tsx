"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ApiClientError } from "@/lib/api/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Login form component styled with the Kanflow design system.
 * Matches the Stitch-generated design: indigo/violet primary, clean card layout.
 */
export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      window.location.href = "/boards";
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : "Login failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
              <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.9"/>
              <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.6"/>
              <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.6"/>
              <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.3"/>
            </svg>
          </div>
          <span className="text-2xl font-bold text-[#0d1c2f] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Kanflow
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#e6eeff] p-8">
          <div className="mb-6">
            <h1 className="text-[28px] font-bold text-[#0d1c2f] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Welcome back
            </h1>
            <p className="text-sm text-[#464555]">Sign in to your Kanflow workspace</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0d1c2f] mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                suppressHydrationWarning
                {...formRegister("email")}
                className={`w-full h-10 px-3.5 rounded-lg border ${errors.email ? "border-red-500" : "border-[#c7c4d8]"} bg-white text-sm text-[#0d1c2f] placeholder:text-[#777587] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-[#0d1c2f]">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  suppressHydrationWarning
                  {...formRegister("password")}
                  className={`w-full h-10 px-3.5 pr-10 rounded-lg border ${errors.password ? "border-red-500" : "border-[#c7c4d8]"} bg-white text-sm text-[#0d1c2f] placeholder:text-[#777587] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777587] hover:text-[#0d1c2f] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#464555]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-[#4f46e5] hover:text-[#4338ca] transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
