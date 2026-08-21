"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  Columns, 
  SlidersHorizontal,
  Home,
  Building,
  GraduationCap,
  ArrowUpDown,
  CheckCircle2,
  MapPin
} from "lucide-react";
import { getRecommendations, getStudentProfile } from "@/lib/api";
import type { MatchResult, StudentProfile } from "@/lib/types";
import PropertyCard from "@/components/shared/PropertyCard";
import ProfileSelector from "@/components/student/ProfileSelector";
import { getEffectiveMonthlyCost } from "@/lib/scoring";
import { cn } from "@/lib/utils";

type SortOption = "match" | "price" | "distance" | "rating";

export default function StudentDiscoverPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("match");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    Promise.all([getStudentProfile().catch(() => null), getRecommendations().catch(() => [])])
      .then(([student, properties]) => {
        if (!isMounted) return;
        if (student) setProfile(student);
        const mapped: MatchResult[] = properties.map((property) => ({
          property,
          score: property.matchScore ?? 0,
          explanation: property.aiExplanation ?? "Matched to your saved student preferences.",
        }));
        setResults(mapped);
      })
      .catch((requestError) => {
        if (!isMounted) return;
        setError(requestError instanceof Error ? requestError.message : "Unable to load recommendations");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { id: "ALL", label: "All Stays", icon: <Home className="w-3.5 h-3.5" /> },
    { id: "PG", label: "Student PGs", icon: <Building className="w-3.5 h-3.5" /> },
    { id: "HOSTEL", label: "Hostels", icon: <Building className="w-3.5 h-3.5" /> },
    { id: "FLAT", label: "Flats & Apartments", icon: <Home className="w-3.5 h-3.5" /> },
    { id: "MEALS", label: "Meals Included", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: "UNDER_10K", label: "Under ₹10,000", icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  const filteredAndSortedResults = useMemo(() => {
    return results
      .filter((res) => {
        const p = res.property;
        // Search query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.locality.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q) ||
            (p.facilities || []).some((f) => f.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Category filter
        if (activeCategory === "ALL") return true;
        if (activeCategory === "PG") return p.type.toUpperCase() === "PG";
        if (activeCategory === "HOSTEL") return p.type.toUpperCase().includes("HOSTEL");
        if (activeCategory === "FLAT") return p.type.toUpperCase().includes("FLAT");
        if (activeCategory === "MEALS") {
          return (p.facilities || []).some((f) => f.toLowerCase().includes("food") || f.toLowerCase().includes("meal")) || p.foodCost > 0;
        }
        if (activeCategory === "UNDER_10K") {
          return getEffectiveMonthlyCost(p) <= 10000;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "match") return b.score - a.score;
        if (sortBy === "price") {
          return getEffectiveMonthlyCost(a.property) - getEffectiveMonthlyCost(b.property);
        }
        if (sortBy === "distance") {
          return (a.property.distanceKm || 0) - (b.property.distanceKm || 0);
        }
        if (sortBy === "rating") {
          return (b.property.rating || 0) - (a.property.rating || 0);
        }
        return 0;
      });
  }, [results, activeCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Hero Discovery Banner */}
      <div className="relative rounded-3xl bg-white border border-[#E5E0D8] p-6 sm:p-8 shadow-sm overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF8F0] border border-[#39B86B]/30 text-[#2A8C50] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Deterministic 5-Factor Match Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17202A] tracking-tight">
            Find your ideal student stay
          </h1>
          <p className="text-sm text-[#596573] leading-relaxed">
            Personalized accommodation scored by rent fit, campus distance, verified facilities, and student lifestyle matching for{" "}
            <span className="font-bold text-[#17202A]">{profile?.name ?? "you"}</span>.
          </p>
        </div>

        {/* Profile Switcher */}
        {profile && (
          <div className="w-full md:w-auto flex-shrink-0">
            <ProfileSelector selectedId={profile.id} />
          </div>
        )}
      </div>

      {/* Interactive Search & Category Filter Bar */}
      <div className="space-y-4">
        {/* Search Input and Controls Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E5E0D8] shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8A96A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Quick search by locality, stay name, or facility (e.g. Knowledge Park, AC, Wi-Fi)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F5EF]/60 text-xs font-medium text-[#17202A] outline-none focus:bg-white focus:border-[#39B86B] border border-transparent transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#F7F5EF] px-3 py-1.5 rounded-xl border border-[#E5E0D8]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8A96A3]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-xs font-bold text-[#17202A] outline-none cursor-pointer"
              >
                <option value="match">Best Fit Match</option>
                <option value="price">Lowest Effective Cost</option>
                <option value="distance">Nearest to Campus</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <Link
              href="/student/search"
              className="btn-secondary text-xs py-2 px-3.5 font-bold flex items-center gap-1.5 flex-shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </Link>

            <Link
              href="/student/compare"
              className="btn-primary text-xs py-2 px-3.5 font-bold flex items-center gap-1.5 flex-shrink-0"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Compare</span>
            </Link>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
                  isActive
                    ? "bg-[#17202A] text-white shadow-sm"
                    : "bg-white text-[#596573] hover:text-[#17202A] hover:bg-[#FAF8F5] border border-[#E5E0D8]"
                )}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-[#596573]">
        <span className="font-bold text-[#17202A]">
          Showing {filteredAndSortedResults.length} verified stays
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-[#39B86B] font-bold hover:underline"
          >
            Clear search filter
          </button>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-3xl h-96 animate-pulse bg-white border border-[#E5E0D8] p-4 flex flex-col justify-between"
            >
              <div className="aspect-[16/10] bg-slate-100 rounded-2xl w-full" />
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
              <div className="h-8 bg-slate-100 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Airbnb-style Property Cards Grid */}
      {!loading && filteredAndSortedResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedResults.map((result, idx) => (
            <PropertyCard
              key={result.property.id}
              result={result}
              rank={idx + 1}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAndSortedResults.length === 0 && !error && (
        <div className="campus-card p-12 text-center max-w-md mx-auto bg-white border border-[#E5E0D8]">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F5EF] flex items-center justify-center text-[#596573] mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#17202A] mb-1">No matching stays found</h3>
          <p className="text-xs text-[#596573] mb-6">
            Try loosening your search terms, changing the category filter, or updating your budget in your student profile.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("ALL");
              }}
              className="btn-secondary text-xs py-2 px-4 font-bold"
            >
              Reset Filters
            </button>
            <Link href="/student/profile" className="btn-primary text-xs py-2 px-4 font-bold">
              Adjust Profile Preferences
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
