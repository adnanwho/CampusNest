"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, ArrowRight, Lock, Mail, User, AlertCircle, Compass, Home } from "lucide-react";
import { register } from "@/lib/api";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role")?.toUpperCase();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "LISTER">(
    roleParam === "LISTER" ? "LISTER" : "STUDENT"
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    try {
      const user = await register(name, email, password, role);
      const userRole = user.role.toLowerCase();
      if (userRole === "student") {
        router.push("/student");
      } else if (userRole === "lister") {
        router.push("/lister");
      } else {
        router.push("/");
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Registration failed. Please try again with a different email."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#17202A] tracking-tight mb-2">
          Create an Account
        </h1>
        <p className="text-sm text-[#596573]">
          Join CampusNest for verified student housing discovery & listing management
        </p>
      </div>

      <div className="campus-card p-7 sm:p-8 bg-white border border-[#E5E0D8] shadow-md">
        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-2">
            I am joining to
          </label>
          <div className="grid grid-cols-2 gap-2.5 p-1 bg-[#F7F5EF] rounded-2xl border border-[#E5E0D8]">
            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === "STUDENT"
                  ? "bg-[#39B86B] text-white shadow-sm"
                  : "text-[#596573] hover:text-[#17202A]"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Find Accommodation
            </button>
            <button
              type="button"
              onClick={() => setRole("LISTER")}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === "LISTER"
                  ? "bg-[#17202A] text-white shadow-sm"
                  : "text-[#596573] hover:text-[#17202A]"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              List Property
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8A96A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] placeholder:text-[#8A96A3] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all"
                placeholder={role === "STUDENT" ? "e.g., Aarav Sharma" : "e.g., Rajesh Kumar"}
              />
            </div>
          </div>

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
                placeholder="name@university.edu or owner@domain.com"
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
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A96A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] placeholder:text-[#8A96A3] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all"
                placeholder="Re-enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm font-bold shadow-sm mt-3 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "Creating account..." : `Join as ${role === "STUDENT" ? "Student" : "Lister"}`}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#E5E0D8] text-center">
          <p className="text-xs text-[#596573]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#39B86B] font-bold hover:text-[#2A8C50] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
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

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Suspense fallback={<p className="text-xs text-[#8A96A3]">Loading registration...</p>}>
          <RegisterContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#8A96A3]">
        CampusNest · Verified Student Accommodation Platform
      </footer>
    </div>
  );
}
