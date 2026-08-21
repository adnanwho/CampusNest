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
  color: string;
  icon: React.ReactNode;
}

const demoCredentials: Record<string, DemoCredential> = {
  student: {
    email: "aarav@campusnest.demo",
    password: "student123",
    label: "Student / Seeker",
    color: "bg-indigo-100 text-indigo-600",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" />
      </svg>
    ),
  },
  lister: {
    email: "lister@campusnest.demo",
    password: "lister123",
    label: "Lister / Owner",
    color: "bg-cyan-100 text-cyan-600",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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

  async function enterRole(role: string) {
    const credentials = demoCredentials[role];
    if (!credentials) return;
    setError(null);
    setLoadingRole(role);
    try {
      await login(credentials.email, credentials.password);
      onSelectRole(role as UserRole);
      router.push(`/${role}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to connect to the backend");
    } finally {
      setLoadingRole(null);
    }
  }

  async function handleManualLogin(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoadingRole("student");
    try {
      const user = await login(email, password);
      const role = user.role as UserRole;
      onSelectRole(role);
      router.push(`/${role}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to connect to the backend");
    } finally {
      setLoadingRole(null);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Smart Student Housing
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            <span className="gradient-text">CampusNest</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Verified listings. Live availability. Smart recommendations. Blockchain-backed trust.
          </p>
        </div>

<<<<<<< HEAD
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {(Object.keys(demoCredentials) as string[]).map((role) => {
            const cred = demoCredentials[role];
            if (!cred) return null;
            return (
              <button
                key={role}
                onClick={() => enterRole(role)}
                disabled={loadingRole !== null}
                className="glass-card rounded-2xl p-8 text-left group cursor-pointer disabled:opacity-50"
              >
                <div className={`w-14 h-14 rounded-xl ${cred.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {cred.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{cred.label}</h3>
                <p className="text-slate-600 text-sm mb-6">
                  {role === "student" && "Discover verified accommodations near your college with smart match scores."}
                  {role === "lister" && "Manage your properties, update live availability, and submit for verification."}
                </p>
                <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  {loadingRole === role ? "Connecting..." : "Enter Portal"}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
=======
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onSelectRole("STUDENT")}
            className="glass-card rounded-2xl p-8 text-left group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Student / Seeker</h3>
            <p className="text-slate-600 text-sm mb-6">
              Discover verified accommodations near your college with AI-powered match scores.
            </p>
            <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
              Explore Properties
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => onSelectRole("LISTER")}
            className="glass-card rounded-2xl p-8 text-left group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Lister / Owner</h3>
            <p className="text-slate-600 text-sm mb-6">
              Manage your properties, update live availability, and submit for verification.
            </p>
            <div className="flex items-center text-cyan-600 font-semibold text-sm group-hover:gap-2 transition-all">
              Manage Listings
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => onSelectRole("ADMIN")}
            className="glass-card rounded-2xl p-8 text-left group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Admin / Verifier</h3>
            <p className="text-slate-600 text-sm mb-6">
              Review verification requests, approve properties, and generate blockchain records.
            </p>
            <div className="flex items-center text-emerald-600 font-semibold text-sm group-hover:gap-2 transition-all">
              Verification Portal
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
>>>>>>> origin/main
        </div>

        <div className="glass-card rounded-2xl p-6 max-w-md mx-auto">
          <h3 className="font-semibold text-slate-900 mb-4 text-center">Or Login with Email</h3>
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loadingRole !== null} className="btn-primary w-full disabled:opacity-50">
              {loadingRole ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {error && <p className="mt-6 text-center text-sm text-red-600">{error}</p>}

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Demo Mode — One-click login with seeded demo accounts, or use your own credentials.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Admin access requires backend authentication. Demo credentials are for local development only.
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}