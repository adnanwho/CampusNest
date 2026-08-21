"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Shield, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface PortalNavProps {
  role: "STUDENT" | "LISTER" | "ADMIN";
  userName?: string;
}

export default function PortalNav({ role, userName }: PortalNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const studentNav: NavItem[] = [
    { label: "Discover", href: "/student", icon: <Search className="w-4 h-4" /> },
    { label: "Compare", href: "/student/compare", icon: <Home className="w-4 h-4" /> },
    { label: "Profile", href: "/student/profile", icon: <User className="w-4 h-4" /> },
  ];

  const listerNav: NavItem[] = [
    { label: "My Properties", href: "/lister", icon: <Home className="w-4 h-4" /> },
    { label: "Add Property", href: "/lister/add", icon: <Search className="w-4 h-4" /> },
  ];

  const adminNav: NavItem[] = [
    { label: "Verifications", href: "/admin", icon: <Shield className="w-4 h-4" /> },
  ];

  const navItems = role === "STUDENT" ? studentNav : role === "LISTER" ? listerNav : adminNav;

  const roleColors = {
    STUDENT: "text-indigo-600 bg-indigo-50 border-indigo-200",
    LISTER: "text-cyan-600 bg-cyan-50 border-cyan-200",
    ADMIN: "text-emerald-600 bg-emerald-50 border-emerald-200",
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href={`/${role.toLowerCase()}`} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <span className="text-white font-bold text-sm">CN</span>
              </div>
              <span className="font-bold text-lg text-slate-900">CampusNest</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={cn("hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-medium border capitalize", roleColors[role])}>
              {role}
            </span>
            <span className="hidden md:inline-flex text-sm text-slate-600">
              {userName || "Demo User"}
            </span>
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-slate-900 font-medium"
            >
              Exit
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200/60 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-1",
                  pathname === item.href
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
