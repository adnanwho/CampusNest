"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { UserRole } from "@/lib/types";

interface RoleSwitcherProps {
  onSelectRole?: (role: UserRole) => void;
}

export default function RoleSwitcher({ onSelectRole }: RoleSwitcherProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      if (onSelectRole) onSelectRole(user.role);
      router.push(`/${user.role.toLowerCase()}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="campus-card p-6 max-w-md mx-auto bg-white border border-[#E5E0D8]">
      <h3 className="font-bold text-[#17202A] mb-4 text-center text-base">Sign in to CampusNest</h3>
      <form onSubmit={handleLogin} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-[#596573] mb-1 uppercase tracking-wider">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/50 text-[#17202A] text-sm focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all"
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
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/50 text-[#17202A] text-sm focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 mt-2 text-xs font-bold">
          {loading ? "Signing in..." : "Sign In"}
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
  );
}