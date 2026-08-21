"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  User, 
  Menu, 
  X, 
  Compass, 
  Columns, 
  PlusCircle,
  Home,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getStoredUser, logout } from "@/lib/api";

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
  const storedUser = getStoredUser();
  const displayName = storedUser?.name ?? userName ?? "CampusNest User";

  const studentNav: NavItem[] = [
    { label: "Discover", href: "/student", icon: <Compass className="w-4 h-4" /> },
    { label: "Search Stays", href: "/student/search", icon: <Search className="w-4 h-4" /> },
    { label: "Compare", href: "/student/compare", icon: <Columns className="w-4 h-4" /> },
    { label: "My Profile", href: "/student/profile", icon: <User className="w-4 h-4" /> },
  ];

  const listerNav: NavItem[] = [
    { label: "My Properties", href: "/lister", icon: <Home className="w-4 h-4" /> },
    { label: "Add Property", href: "/lister/add", icon: <PlusCircle className="w-4 h-4" /> },
  ];

  const adminNav: NavItem[] = [
    { label: "Verification Queue", href: "/admin", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const navItems = role === "STUDENT" ? studentNav : role === "LISTER" ? listerNav : adminNav;

  const rolePills = {
    STUDENT: "bg-[#EBF8F0] text-[#2A8C50] border-[#39B86B]/30",
    LISTER: "bg-[#FFF8E7] text-[#D49B24] border-[#FFC857]/40",
    ADMIN: "bg-slate-100 text-slate-800 border-slate-300",
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#F7F5EF]/95 backdrop-blur-md border-b border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#39B86B] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#17202A]">CampusNest</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive
                        ? "bg-[#17202A] text-white shadow-sm"
                        : "text-[#596573] hover:text-[#17202A] hover:bg-[#E5E0D8]/50"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={cn("hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider", rolePills[role])}>
              {role} Portal
            </span>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E5E0D8]">
              <div className="w-6 h-6 rounded-full bg-[#39B86B] text-white flex items-center justify-center text-xs font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-[#17202A] max-w-[130px] truncate">
                {displayName}
              </span>
            </div>

            <Link
              href="/"
              onClick={logout}
              className="inline-flex items-center gap-1 text-xs text-[#596573] hover:text-[#E63946] font-bold px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              title="Sign out & return home"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-[#17202A] hover:bg-[#E5E0D8]/60 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-[#E5E0D8] pt-3 space-y-1">
            <div className="px-3 py-2 text-xs font-bold text-[#596573] uppercase tracking-wider">
              Signed in as <span className="text-[#17202A]">{displayName}</span> ({role})
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors",
                    isActive
                      ? "bg-[#17202A] text-white"
                      : "text-[#596573] hover:text-[#17202A] hover:bg-[#E5E0D8]/40"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
