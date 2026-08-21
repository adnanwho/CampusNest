"use client";

import { UserRole } from "@/lib/types";

interface RoleSwitcherProps {
  onSelectRole: (role: UserRole) => void;
}

export default function RoleSwitcher({ onSelectRole }: RoleSwitcherProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            AI-Powered Student Housing
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            <span className="gradient-text">CampusNest</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Verified listings. Live availability. AI recommendations. Blockchain-backed trust.
          </p>
        </div>

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
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Demo Mode — No login required. Select a role to explore CampusNest.
          </p>
        </div>
      </div>
    </div>
  );
}
