"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  SlidersHorizontal,
  ChevronRight,
  Wifi,
  Utensils,
  Zap,
  Clock,
  X
} from "lucide-react";
import { getProperties, getStoredUser, logout } from "@/lib/api";
import type { Property, User } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { getEffectiveMonthlyCost, getAvailabilityBadge } from "@/lib/scoring";
import RoleSwitcher from "@/components/shared/RoleSwitcher";

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [showPortalModal, setShowPortalModal] = useState(false);

  // Search Bar State
  const [searchLocality, setSearchLocality] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchBudgetMax, setSearchBudgetMax] = useState("");
  const [selectedLifestyles, setSelectedLifestyles] = useState<string[]>([]);

  useEffect(() => {
    setCurrentUser(getStoredUser());
    getProperties()
      .then((data) => {
        setFeaturedProperties(data.slice(0, 3));
      })
      .catch(() => {
        setFeaturedProperties([]);
      })
      .finally(() => {
        setLoadingProperties(false);
      });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchLocality) queryParams.set("locality", searchLocality);
    if (searchType) queryParams.set("type", searchType);
    if (searchBudgetMax) queryParams.set("budgetMax", searchBudgetMax);
    router.push(`/student/search?${queryParams.toString()}`);
  };

  const toggleLifestyle = (tag: string) => {
    setSelectedLifestyles((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#17202A] flex flex-col selection:bg-[#39B86B]/20 selection:text-[#17202A]">
      {/* 1. Brand Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#F7F5EF]/90 backdrop-blur-md border-b border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
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

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#596573]">
            <Link href="/student" className="hover:text-[#17202A] transition-colors">
              Discover
            </Link>
            <Link href="/student/search" className="hover:text-[#17202A] transition-colors">
              Search Stays
            </Link>
            <Link href="/student/compare" className="hover:text-[#17202A] transition-colors">
              Compare
            </Link>
            <a href="#how-it-works" className="hover:text-[#17202A] transition-colors">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/${currentUser.role.toLowerCase()}`}
                  className="btn-secondary text-xs sm:text-sm py-2 px-3.5"
                >
                  Go to {currentUser.role} Portal
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setCurrentUser(null);
                  }}
                  className="text-xs font-semibold text-[#596573] hover:text-[#E63946] py-2 px-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowPortalModal(true)}
                  className="btn-secondary text-xs sm:text-sm py-2 px-3.5"
                >
                  Demo Logins
                </button>
                <Link
                  href="/register"
                  className="btn-primary text-xs sm:text-sm py-2 px-4 shadow-sm"
                >
                  List a Property
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E5E0D8] text-[#17202A] text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#39B86B] animate-pulse" />
            Verified Student Accommodation · Greater Noida & NCR
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#17202A] tracking-tight leading-[1.1] mb-6">
            Your next place <br className="hidden sm:inline" />
            starts here.
          </h1>

          <p className="text-lg sm:text-xl text-[#596573] leading-relaxed mb-8 max-w-2xl font-normal">
            Find student stays that fit your budget, commute, and lifestyle — with verified listings and availability you can actually trust.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link href="/student" className="btn-primary text-base py-3.5 px-6 font-semibold">
              Find my stay
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <button
              onClick={() => setShowPortalModal(true)}
              className="btn-secondary text-base py-3.5 px-6 font-semibold"
            >
              Explore Demo Portals
            </button>
          </div>
        </div>

        {/* 3. Search & Interactive Preferences Bar */}
        <div className="campus-card p-6 sm:p-8 bg-white border border-[#E5E0D8] shadow-md mt-4">
          <form onSubmit={handleSearchSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* College / Locality */}
              <div>
                <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-2">
                  College or Locality
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8A96A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchLocality}
                    onChange={(e) => setSearchLocality(e.target.value)}
                    placeholder="Knowledge Park, Pari Chowk..."
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] placeholder:text-[#8A96A3] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Max Monthly Budget */}
              <div>
                <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-2">
                  Max Budget / Month
                </label>
                <select
                  value={searchBudgetMax}
                  onChange={(e) => setSearchBudgetMax(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all"
                >
                  <option value="">Any Budget</option>
                  <option value="6000">Up to ₹6,000 / mo</option>
                  <option value="8000">Up to ₹8,000 / mo</option>
                  <option value="10000">Up to ₹10,000 / mo</option>
                  <option value="13000">Up to ₹13,000 / mo</option>
                  <option value="16000">Up to ₹16,000 / mo</option>
                </select>
              </div>

              {/* Stay Type */}
              <div>
                <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-2">
                  Accommodation Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all"
                >
                  <option value="">All Types</option>
                  <option value="PG">PG (Paying Guest)</option>
                  <option value="HOSTEL">Student Hostel</option>
                  <option value="FLAT">Independent Flat</option>
                </select>
              </div>

              {/* Search Action */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="btn-primary w-full py-2.5 h-[42px] text-sm font-bold shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  Search Stays
                </button>
              </div>
            </div>

            {/* Quick Lifestyle Filters */}
            <div className="pt-3 border-t border-[#E5E0D8] flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#8A96A3] uppercase tracking-wider mr-1">
                Lifestyle Preferences:
              </span>
              {[
                { label: "Wi-Fi Included", icon: <Wifi className="w-3.5 h-3.5" /> },
                { label: "Meals Included", icon: <Utensils className="w-3.5 h-3.5" /> },
                { label: "AC Room", icon: <Zap className="w-3.5 h-3.5" /> },
                { label: "Walking Distance", icon: <Clock className="w-3.5 h-3.5" /> },
              ].map((item) => {
                const active = selectedLifestyles.includes(item.label);
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => toggleLifestyle(item.label)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                      active
                        ? "bg-[#39B86B] text-white border-[#39B86B]"
                        : "bg-[#F7F5EF] text-[#596573] border-[#E5E0D8] hover:border-[#8A96A3]"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </form>
        </div>
      </section>

      {/* 4. Featured Verified Stays */}
      <section className="py-12 bg-white border-y border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#39B86B] uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                Curated Listings
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#17202A]">
                Top Verified Properties in Greater Noida
              </h2>
            </div>
            <Link
              href="/student"
              className="mt-3 md:mt-0 text-sm font-bold text-[#39B86B] hover:text-[#2A8C50] flex items-center gap-1 group"
            >
              Browse all verified places
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loadingProperties ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="campus-card h-80 animate-pulse bg-slate-100" />
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProperties.map((prop) => {
                const effective = getEffectiveMonthlyCost(prop);
                const badge = getAvailabilityBadge(prop);
                return (
                  <div key={prop.id} className="campus-card overflow-hidden flex flex-col group">
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EBF8F0] text-[#2A8C50] border border-[#39B86B]/20 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            CampusNest Verified
                          </span>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-[#17202A] group-hover:text-[#39B86B] transition-colors mb-1">
                          {prop.name}
                        </h3>
                        <p className="text-xs text-[#596573] flex items-center gap-1 mb-4">
                          <MapPin className="w-3.5 h-3.5 text-[#8A96A3]" />
                          {prop.address}
                        </p>

                        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#F7F5EF] mb-4 text-xs">
                          <div>
                            <span className="text-[#8A96A3] block">Commute</span>
                            <span className="font-semibold text-[#17202A]">{prop.commuteTimeMin} min ({prop.distanceKm} km)</span>
                          </div>
                          <div>
                            <span className="text-[#8A96A3] block">Live Capacity</span>
                            <span className="font-semibold text-[#17202A]">{prop.occupied}/{prop.capacity} occupied</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {prop.facilities?.slice(0, 3).map((f) => (
                            <span key={f} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-[#596573] font-medium">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E5E0D8] flex items-center justify-between">
                        <div>
                          <div className="text-xs text-[#8A96A3]">Effective Monthly</div>
                          <div className="text-base font-extrabold text-[#17202A]">
                            {formatCurrency(effective)}
                            <span className="text-xs font-normal text-[#8A96A3]"> /mo</span>
                          </div>
                        </div>
                        <Link
                          href={`/student/property/${prop.id}`}
                          className="btn-secondary text-xs py-2 px-3 font-bold"
                        >
                          View Place
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-12 text-[#596573]">No listings available at this moment.</p>
          )}
        </div>
      </section>

      {/* 5. Editorial Product Story / The CampusNest Standard */}
      <section id="how-it-works" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#39B86B] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            Designed for Students & Families
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17202A] tracking-tight">
            How CampusNest makes student housing honest.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="campus-card p-7 bg-white">
            <div className="w-12 h-12 rounded-xl bg-[#EBF8F0] text-[#39B86B] flex items-center justify-center font-black text-xl mb-5">
              01
            </div>
            <h3 className="text-xl font-bold text-[#17202A] mb-3">
              True Effective Monthly Cost
            </h3>
            <p className="text-[#596573] text-sm leading-relaxed">
              No hidden surprises when you move in. We compute base rent + food + electricity meter policies + Wi-Fi + maintenance upfront so you compare real costs.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="campus-card p-7 bg-white">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#D49B24] flex items-center justify-center font-black text-xl mb-5">
              02
            </div>
            <h3 className="text-xl font-bold text-[#17202A] mb-3">
              Real-time Bed Occupancy
            </h3>
            <p className="text-[#596573] text-sm leading-relaxed">
              Listers manage live bed counts directly through the verified owner dashboard. See genuine vacancies before traveling for physical visits.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="campus-card p-7 bg-white">
            <div className="w-12 h-12 rounded-xl bg-[#EBF8F0] text-[#2A8C50] flex items-center justify-center font-black text-xl mb-5">
              03
            </div>
            <h3 className="text-xl font-bold text-[#17202A] mb-3">
              Tamper-evident Verification
            </h3>
            <p className="text-[#596573] text-sm leading-relaxed">
              Every property on CampusNest is verified by campus moderators with cryptographic record hashing and transparent status auditing.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Quick Demo Access Banner */}
      <section className="py-12 bg-[#17202A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#39B86B] mb-1 block">
              Evaluation & Sandbox
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Ready to test CampusNest?
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mt-1">
              Switch between Student, Property Owner, and Admin Verifier roles instantly.
            </p>
          </div>
          <button
            onClick={() => setShowPortalModal(true)}
            className="btn-primary bg-[#39B86B] hover:bg-[#32A55F] text-white font-bold py-3 px-6 shadow-md text-sm whitespace-nowrap"
          >
            Launch Role Switcher
          </button>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="mt-auto bg-[#F7F5EF] border-t border-[#E5E0D8] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#596573]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#39B86B] flex items-center justify-center text-white font-bold text-xs">
              CN
            </div>
            <span className="font-bold text-[#17202A]">CampusNest Platform</span>
            <span>· Greater Noida Student Accommodations</span>
          </div>
          <div>
            <span>Verified Listings · Deterministic Matching · Tamper-evident Audit Records</span>
          </div>
        </div>
      </footer>

      {/* Portal Modal */}
      <AnimatePresence>
        {showPortalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-4xl bg-[#F7F5EF] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5E0D8] max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowPortalModal(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white border border-[#E5E0D8] flex items-center justify-center text-[#596573] hover:text-[#17202A] hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <RoleSwitcher onSelectRole={() => setShowPortalModal(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
