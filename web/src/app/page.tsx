"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  Wifi,
  Utensils,
  Zap,
  Clock,
  Layers,
  Users,
  Check
} from "lucide-react";
import { getProperties, getStoredUser, logout } from "@/lib/api";
import type { Property, User } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { getEffectiveMonthlyCost, getAvailabilityBadge } from "@/lib/scoring";
import PropertyCard from "@/components/shared/PropertyCard";

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Search Bar State
  const [searchLocality, setSearchLocality] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchBudgetMax, setSearchBudgetMax] = useState("");
  const [selectedLifestyles, setSelectedLifestyles] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) setCurrentUser(getStoredUser());
    });

    getProperties()
      .then((data) => {
        if (isMounted) setFeaturedProperties(data.slice(0, 3));
      })
      .catch(() => {
        if (isMounted) setFeaturedProperties([]);
      })
      .finally(() => {
        if (isMounted) setLoadingProperties(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role.toUpperCase() !== "STUDENT") {
      router.push("/register?role=STUDENT");
      return;
    }
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

  // Dynamic Auth-Aware Link Handlers
  const getDiscoverHref = () => {
    if (currentUser?.role.toUpperCase() === "STUDENT") return "/student";
    return "/register?role=STUDENT";
  };

  const getSearchHref = () => {
    if (currentUser?.role.toUpperCase() === "STUDENT") return "/student/search";
    return "/register?role=STUDENT";
  };

  const getCompareHref = () => {
    if (currentUser?.role.toUpperCase() === "STUDENT") return "/student/compare";
    return "/register?role=STUDENT";
  };

  const getStudentCtaHref = () => {
    if (currentUser?.role.toUpperCase() === "STUDENT") return "/student";
    return "/register?role=STUDENT";
  };

  const getListerCtaHref = () => {
    if (currentUser?.role.toUpperCase() === "LISTER") return "/lister";
    return "/register?role=LISTER";
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#17202A] flex flex-col selection:bg-[#39B86B]/20 selection:text-[#17202A]">
      {/* 1. Header */}
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
            <Link href={getDiscoverHref()} className="hover:text-[#17202A] transition-colors">
              Discover
            </Link>
            <Link href={getSearchHref()} className="hover:text-[#17202A] transition-colors">
              Search Stays
            </Link>
            <Link href={getCompareHref()} className="hover:text-[#17202A] transition-colors">
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
                  className="btn-secondary text-xs sm:text-sm py-2 px-3.5 font-bold"
                >
                  Go to {currentUser.role === "STUDENT" ? "Student" : currentUser.role === "LISTER" ? "Lister" : "Admin"} Portal
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setCurrentUser(null);
                  }}
                  className="text-xs font-semibold text-[#596573] hover:text-[#E63946] py-2 px-2 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn-secondary text-xs sm:text-sm py-2 px-4 font-bold"
                >
                  Login
                </Link>
                <Link
                  href="/register?role=STUDENT"
                  className="btn-primary text-xs sm:text-sm py-2 px-4 font-bold shadow-sm"
                >
                  Find your Nest
                </Link>
                <Link
                  href="/register?role=LISTER"
                  className="hidden lg:inline-flex btn-secondary text-xs sm:text-sm py-2 px-3.5 font-bold"
                >
                  List your Property
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E0D8] text-[#17202A] text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#39B86B]" />
            Verified Student Accommodation · Greater Noida & NCR
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#17202A] tracking-tight leading-[1.1] mb-6">
            Find a place that <br className="hidden sm:inline" />
            feels like home.
          </h1>

          <p className="text-lg sm:text-xl text-[#596573] leading-relaxed mb-8 max-w-2xl font-normal">
            Find verified student accommodation based on your budget, location, availability, and lifestyle preferences.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link href={getStudentCtaHref()} className="btn-primary text-base py-3.5 px-6 font-bold shadow-sm">
              Find your Nest
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              href={getListerCtaHref()}
              className="btn-secondary text-base py-3.5 px-6 font-bold"
            >
              List your Property
            </Link>
          </div>
        </div>

        {/* 3. Search & Interactive Discovery Preview */}
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

      {/* 4. How CampusNest Works */}
      <section id="how-it-works" className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#39B86B] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            Simple & Transparent Journey
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17202A] tracking-tight">
            How CampusNest Works
          </h2>
          <p className="text-sm text-[#596573] mt-2">
            From search to move-in day, every step is built around student peace of mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="campus-card p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EBF8F0] text-[#39B86B] font-black text-base flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-[#17202A] mb-2">Discover</h3>
              <p className="text-xs text-[#596573] leading-relaxed">
                Filter verified properties by campus distance, rent bracket, room type, and essential student amenities.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E5E0D8] text-[11px] font-semibold text-[#39B86B]">
              Campus-scoped discovery →
            </div>
          </div>

          <div className="campus-card p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FFF8E7] text-[#D49B24] font-black text-base flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-[#17202A] mb-2">Smart Match</h3>
              <p className="text-xs text-[#596573] leading-relaxed">
                Our 5-factor scoring engine calculates budget deviation, commute time, and lifestyle fit for your profile.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E5E0D8] text-[11px] font-semibold text-[#D49B24]">
              Deterministic fit score →
            </div>
          </div>

          <div className="campus-card p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EBF8F0] text-[#2A8C50] font-black text-base flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-[#17202A] mb-2">Compare</h3>
              <p className="text-xs text-[#596573] leading-relaxed">
                Evaluate true effective monthly outlays side-by-side with meals, electricity, Wi-Fi, and deposits included.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E5E0D8] text-[11px] font-semibold text-[#2A8C50]">
              Zero hidden fees →
            </div>
          </div>

          <div className="campus-card p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#17202A] text-white font-black text-base flex items-center justify-center mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-[#17202A] mb-2">Move In</h3>
              <p className="text-xs text-[#596573] leading-relaxed">
                Check real-time live bed availability updated by property managers before scheduling your visit.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E5E0D8] text-[11px] font-semibold text-[#17202A]">
              Live vacancy counts →
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust & Verification */}
      <section className="py-16 bg-white border-y border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#39B86B] uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                The CampusNest Standard
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17202A] tracking-tight mb-4">
                Trust built on verified facts, not marketing claims.
              </h2>
              <p className="text-sm text-[#596573] leading-relaxed mb-6">
                Finding student housing shouldn&apos;t involve misleading photos or hidden surcharges. CampusNest establishes a verified standard for every accommodation on our platform.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#EBF8F0] text-[#39B86B] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#17202A]">Verified Listings & Physical Audits</h4>
                    <p className="text-xs text-[#596573] mt-0.5">Campus moderators review property listings, facility claims, and campus proximity before granting verification.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#EBF8F0] text-[#39B86B] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#17202A]">Transparent Pricing Policy</h4>
                    <p className="text-xs text-[#596573] mt-0.5">We aggregate base rent + meal plans + electricity policies + maintenance so students see real monthly outlays.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#EBF8F0] text-[#39B86B] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#17202A]">Live Bed Occupancy</h4>
                    <p className="text-xs text-[#596573] mt-0.5">Listers maintain live room and bed counts so you never waste time visiting a fully occupied hostel.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#EBF8F0] text-[#39B86B] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#17202A]">Tamper-Evident Verification Records</h4>
                    <p className="text-xs text-[#596573] mt-0.5">Verification timestamps and cryptographic hash records provide auditable authenticity.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Callout */}
            <div className="campus-card p-8 bg-[#F7F5EF] border border-[#E5E0D8]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E0D8]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#39B86B]" />
                  <span className="font-extrabold text-sm text-[#17202A]">CampusNest Verified Stay</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EBF8F0] text-[#2A8C50] border border-[#39B86B]/30">
                  Audit Passed
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-[#E5E0D8]/60">
                  <span className="text-[#596573]">Effective Monthly Total</span>
                  <span className="font-extrabold text-sm text-[#2A8C50]">₹11,500 / mo</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#E5E0D8]/60">
                  <span className="text-[#596573]">Live Bed Vacancy</span>
                  <span className="font-bold text-[#17202A]">8 of 20 beds available</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#E5E0D8]/60">
                  <span className="text-[#596573]">Distance to NIET / Sharda</span>
                  <span className="font-bold text-[#17202A]">1.2 km (5 min auto)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#596573]">Included Utilities</span>
                  <span className="font-bold text-[#17202A]">Wi-Fi, 3 Meals, AC, Security</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E0D8]">
                <Link
                  href={getDiscoverHref()}
                  className="btn-primary w-full py-2.5 text-xs font-bold text-center"
                >
                  Explore Verified Places
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Smart 5-Factor Matching */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#39B86B] uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" />
            Deterministic Algorithm
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17202A] tracking-tight">
            How our 5-Factor Matching Works
          </h2>
          <p className="text-sm text-[#596573] mt-2">
            No guesswork. CampusNest evaluates properties deterministically across five weighted dimensions tailored to your student profile.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
            <div className="text-2xl font-black text-[#39B86B] mb-2">30%</div>
            <h3 className="font-bold text-sm text-[#17202A] mb-1">Budget Fit</h3>
            <p className="text-xs text-[#596573] leading-relaxed">
              Deviation between true effective monthly cost and your target budget ceiling.
            </p>
          </div>

          <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
            <div className="text-2xl font-black text-[#2A8C50] mb-2">25%</div>
            <h3 className="font-bold text-sm text-[#17202A] mb-1">Distance & Commute</h3>
            <p className="text-xs text-[#596573] leading-relaxed">
              Proximity in kilometers and realistic commute travel times to your campus.
            </p>
          </div>

          <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
            <div className="text-2xl font-black text-[#D49B24] mb-2">20%</div>
            <h3 className="font-bold text-sm text-[#17202A] mb-1">Trust & Verification</h3>
            <p className="text-xs text-[#596573] leading-relaxed">
              Moderator audit status and presence of verified cryptographic records.
            </p>
          </div>

          <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
            <div className="text-2xl font-black text-[#17202A] mb-2">15%</div>
            <h3 className="font-bold text-sm text-[#17202A] mb-1">Facilities Match</h3>
            <p className="text-xs text-[#596573] leading-relaxed">
              Alignment with requested essentials: Wi-Fi speed, meal plans, AC, and study rooms.
            </p>
          </div>

          <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
            <div className="text-2xl font-black text-[#596573] mb-2">10%</div>
            <h3 className="font-bold text-sm text-[#17202A] mb-1">Lifestyle & Locality</h3>
            <p className="text-xs text-[#596573] leading-relaxed">
              Preferred neighborhood matching and accommodation type compatibility.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Featured Properties (Real API Data) */}
      <section className="py-16 bg-white border-y border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#39B86B] uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                Live Properties
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#17202A]">
                Featured Verified Properties
              </h2>
            </div>
            <Link
              href={getDiscoverHref()}
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
              {featuredProperties.map((prop, idx) => (
                <PropertyCard
                  key={prop.id}
                  result={{
                    property: prop,
                    score: prop.matchScore ?? 92 - idx * 4,
                    explanation: "Featured verified student accommodation in Greater Noida.",
                  }}
                  rank={idx + 1}
                />
              ))}
            </div>
          ) : (
            <div className="campus-card p-12 text-center max-w-md mx-auto bg-white border border-[#E5E0D8]">
              <p className="text-sm font-semibold text-[#596573]">
                No accommodation listings found in the active database.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 8. Student & Lister Value Propositions */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Students */}
          <div className="campus-card p-8 bg-white border border-[#E5E0D8] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EBF8F0] text-[#39B86B] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#39B86B] uppercase tracking-wider block mb-1">
                For Students & Parents
              </span>
              <h3 className="text-2xl font-bold text-[#17202A] mb-3">
                Honest student stays with zero hidden costs.
              </h3>
              <p className="text-sm text-[#596573] leading-relaxed mb-6">
                Compare accommodations near your university campus with true total monthly expenses calculated upfront. Filter by Wi-Fi, study spaces, food plans, and safety parameters.
              </p>
              <ul className="space-y-2.5 text-xs text-[#17202A] mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39B86B]" />
                  <span>Transparent cost calculations with all utilities included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39B86B]" />
                  <span>Real-time bed availability before scheduling visits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39B86B]" />
                  <span>Deterministic 5-factor personalized matching</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register?role=STUDENT"
              className="btn-primary py-3 px-5 text-xs font-bold text-center"
            >
              Sign Up as Student
            </Link>
          </div>

          {/* For Property Owners / Listers */}
          <div className="campus-card p-8 bg-white border border-[#E5E0D8] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FFF8E7] text-[#D49B24] flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#D49B24] uppercase tracking-wider block mb-1">
                For PG & Hostel Owners
              </span>
              <h3 className="text-2xl font-bold text-[#17202A] mb-3">
                List verified properties & manage occupancy.
              </h3>
              <p className="text-sm text-[#596573] leading-relaxed mb-6">
                Reach genuine student tenants seeking quality accommodation. Update live vacancies, highlight certified facilities, and receive verified badges from campus administrators.
              </p>
              <ul className="space-y-2.5 text-xs text-[#17202A] mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39B86B]" />
                  <span>Dedicated dashboard to manage property listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39B86B]" />
                  <span>One-click live occupancy and vacant bed updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39B86B]" />
                  <span>Verification submission for trust & higher match ranking</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register?role=LISTER"
              className="btn-secondary py-3 px-5 text-xs font-bold text-center border-slate-300"
            >
              List your Property
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-16 bg-[#17202A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to find your next student home?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            Join students from NIET, Sharda, Galgotias, and Greater Noida campuses discovering verified accommodations on CampusNest.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register?role=STUDENT"
              className="btn-primary text-sm py-3 px-6 font-bold"
            >
              Find your Nest
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              href="/register?role=LISTER"
              className="btn-secondary bg-white text-[#17202A] hover:bg-slate-100 text-sm py-3 px-6 font-bold"
            >
              List your Property
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="mt-auto bg-[#F7F5EF] border-t border-[#E5E0D8] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-[#E5E0D8]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#39B86B] flex items-center justify-center text-white font-bold text-xs">
                CN
              </div>
              <span className="font-extrabold text-base text-[#17202A]">CampusNest</span>
              <span className="text-xs text-[#596573]">· Greater Noida & NCR Student Accommodations</span>
            </div>

            <div className="flex items-center gap-6 text-xs font-semibold text-[#596573]">
              <Link href={getDiscoverHref()} className="hover:text-[#17202A]">Discover</Link>
              <Link href={getSearchHref()} className="hover:text-[#17202A]">Search Stays</Link>
              <Link href={getCompareHref()} className="hover:text-[#17202A]">Compare</Link>
              <Link href="/login" className="hover:text-[#17202A]">Login</Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A96A3]">
            <p>© {new Date().getFullYear()} CampusNest. All rights reserved.</p>
            <p>Verified Listings · Transparent Effective Cost · Tamper-Evident Audit Records</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
