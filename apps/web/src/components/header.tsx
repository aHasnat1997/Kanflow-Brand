"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e2e8f0] shadow-sm h-14 flex items-center shrink-0">
      <div className="w-full px-4 sm:px-6 flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
              <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.9" />
              <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
              <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
              <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          <span className="text-lg font-bold text-[#0d1c2f] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Kanflow
          </span>
        </Link>

        {/* User Info / Logout */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-[#464555]">
              {user.name}
            </div>
            <div className="w-8 h-8 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#4f46e5] font-semibold text-sm border border-[#c7c4d8]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="text-[#777587] hover:text-[#0d1c2f] transition-colors p-1.5 rounded-md hover:bg-[#f8fafc]"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
