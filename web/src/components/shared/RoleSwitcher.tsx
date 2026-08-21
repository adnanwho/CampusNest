"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { UserRole } from "@/lib/types";

interface RoleSwitcherProps {
  onSelectRole: (role: UserRole) => void;
}

interface DemoCredential {
  email: string;
  password: string;
  label: string;
  roleType: UserRole;
  badge: string;
  color: string;
  iconBg: string;
  icon: React.ReactNode;
}

const demoCredentials: Record<string, DemoCredential> = {
  student: {
    email: "aarav@campusnest.demo",
    password: "student123",
    label: "Student Portal",
    roleType: "STUDENT",
    badge: "Find & Compare Stays",
    color: "border-emerald-200 hover:border-emerald-400 bg-white",
    iconBg: "bg-emerald-100 text-emerald-700",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" />
      </svg>
    ),
  },
  lister: {
    email: "lister@campusnest.demo",
    password: "lister123",
    label: "Lister Portal",
    roleType: "LISTER",
    badge: "Manage Beds & Properties",
    color: "border-amber-200 hover:border-amber-400 bg-white",
    iconBg: "bg-amber-100 text-amber-800",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  admin: {
    email: "admin@campusnest.demo",
    password: "admin123",
    label: "Admin Verification",
    roleType: "ADMIN",
    badge: "Audit & Trust Queue",
    color: "border-slate-300 hover:border-slate-500 bg-white",
    iconBg: "bg-slate-100 text-slate-800",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
};

export default function RoleSwitcher({ onSelectRole }: RoleSwitcherProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function enterRole(roleKey: string) {
    const cred = demoCredentials[roleKey];
    if (!cred) return;
    setError(null);
    setLoadingRole(roleKey);
    try {
      const user = await login(cred.email, cred.password);
      if (onSelectRole) onSelectRole(user.role);
      router.push(`/${user.role.toLowerCase()}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to connect demo user");
    } finally {
      setLoadingRole(null);
    }
  }

  async function handleCustomLogin(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoadingRole("custom");
    try {
      const user = await login(email, password);
      if (onSelectRole) onSelectRole(user.role);
      router.push(`/${user.role.toLowerCase()}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Invalid email or password");
    } finally {
      setLoadingRole(null);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8F0] border border-[#39B86B]/30 text-[#17202A] text-xs font-semibold uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-[#39B86B]" />
          Instant Demo Access
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#17202A] tracking-tight mb-3">
          Choose a portal to explore
        </h2>
        <p className="text-base text-[#596573] max-w-xl mx-auto">
          One-click sign in with pre-seeded accounts or log in with your custom credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {(Object.keys(demoCredentials) as string[]).map((role) => {
          const cred = demoCredentials[role];
          if (!cred) return null;
          return (
            <button
              key={role}
              onClick={() => enterRole(role)}
              disabled={loadingRole !== null}
              className={`campus-card p-6 text-left group cursor-pointer disabled:opacity-50 border ${cred.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${cred.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  {cred.icon}
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {cred.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#17202A] mb-1.5">{cred.label}</h3>
              <p className="text-[#596573] text-sm mb-5 leading-relaxed">
                {role === "student" && "Explore student stays, view effective cost breakdowns, and check match scores."}
                {role === "lister" && "Manage Shree Balaji PG, live bed availability, and verification requests."}
                {role === "admin" && "Review pending property verifications and inspect tamper-evident audit records."}
              </p>
              <div className="flex items-center text-[#39B86B] font-semibold text-sm group-hover:gap-1.5 transition-all">
                <span>{loadingRole === role ? "Connecting..." : "Launch Demo Portal"}</span>
                <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="campus-card p-6 max-w-md mx-auto">
        <h3 className="font-bold text-[#17202A] mb-4 text-center text-base">Or Sign in with Email</h3>
        <form onSubmit={handleCustomLogin} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#596573] mb-1 uppercase tracking-wider">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E0D8] bg-[#F7F5EF]/50 text-[#17202A] text-sm focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#596573] mb-1 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E0D8] bg-[#F7F5EF]/50 text-[#17202A] text-sm focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loadingRole !== null} className="btn-primary w-full disabled:opacity-50 mt-2">
            {loadingRole === "custom" ? "Signing in..." : "Sign In"}
          </button>
        </form>
        {error && <p className="mt-3 text-center text-xs font-medium text-[#E63946]">{error}</p>}
        <div className="mt-4 pt-4 border-t border-[#E5E0D8] text-center">
          <p className="text-xs text-[#596573]">
            New to CampusNest?{" "}
            <Link href="/register" className="text-[#39B86B] font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}