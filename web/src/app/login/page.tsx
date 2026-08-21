"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      const role = user.role.toLowerCase();
      if (role === "student") {
        router.push("/student");
      } else if (role === "lister") {
        router.push("/lister");
      } else if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Invalid email or password. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col justify-between selection:bg-[#39B86B]/20 selection:text-[#17202A]">
      {/* Top Brand Bar */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#39B86B] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#17202A]">CampusNest</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EBF8F0] text-[#2A8C50] border border-[#39B86B]/20">
              Verified Stays
            </span>
          </div>
        </Link>
      </header>

      {/* Main Login Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#17202A] tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-[#596573]">
              Sign in to manage your student stays or property listings
            </p>
          </div>

          <div className="campus-card p-7 sm:p-8 bg-white border border-[#E5E0D8] shadow-md">
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A96A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] placeholder:text-[#8A96A3] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all"
                    placeholder="name@university.edu or lister@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A96A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] placeholder:text-[#8A96A3] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm font-bold shadow-sm mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E5E0D8] text-center space-y-2">
              <p className="text-xs text-[#596573]">
                New to CampusNest?{" "}
                <Link
                  href="/register?role=STUDENT"
                  className="text-[#39B86B] font-bold hover:text-[#2A8C50] hover:underline"
                >
                  Create an account
                </Link>
              </p>
              <p className="text-xs text-[#596573]">
                Property owner?{" "}
                <Link
                  href="/register?role=LISTER"
                  className="text-[#17202A] font-bold hover:underline"
                >
                  List your property
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#8A96A3]">
        CampusNest · Verified Student Accommodation Platform
      </footer>
    </div>
  );
}
