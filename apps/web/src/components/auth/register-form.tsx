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

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

/** Register form component styled with the Kanflow design system. */
export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await register(data.email, data.name, data.password);
      toast.success("Account created! Welcome to Kanflow.");
      window.location.href = "/boards";
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center px-4">
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

        <div className="bg-white rounded-2xl shadow-xl border border-[#e6eeff] p-8">
          <div className="mb-6">
            <h1 className="text-[28px] font-bold text-[#0d1c2f] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Create your account
            </h1>
            <p className="text-sm text-[#464555]">Start organising your work with Kanflow</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#0d1c2f] mb-1.5">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Smith"
                suppressHydrationWarning
                {...formRegister("name")}
                className={`w-full h-10 px-3.5 rounded-lg border ${errors.name ? "border-red-500" : "border-[#c7c4d8]"} bg-white text-sm text-[#0d1c2f] placeholder:text-[#777587] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-[#0d1c2f] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
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
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#464555]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#4f46e5] hover:text-[#4338ca] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
