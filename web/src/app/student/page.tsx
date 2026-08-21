"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  Columns
} from "lucide-react";
import { getRecommendations, getStudentProfile } from "@/lib/api";
import type { MatchResult, StudentProfile } from "@/lib/types";
import PropertyCard from "@/components/shared/PropertyCard";
import ProfileSelector from "@/components/student/ProfileSelector";
import { getEffectiveMonthlyCost } from "@/lib/scoring";

export default function StudentDiscoverPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"match" | "price" | "distance">("match");

  useEffect(() => {
    let isMounted = true;
    Promise.all([getStudentProfile(), getRecommendations()])
      .then(([student, properties]) => {
        if (!isMounted) return;
        setProfile(student);
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

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "match") return b.score - a.score;
    if (sortBy === "price") {
      return getEffectiveMonthlyCost(a.property) - getEffectiveMonthlyCost(b.property);
    }
    if (sortBy === "distance") {
      return a.property.distanceKm - b.property.distanceKm;
    }
    return 0;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner with Student Info */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-between border-b border-[#E5E0D8] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF8F0] border border-[#39B86B]/30 text-[#2A8C50] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Deterministic 5-Factor Match
          </div>
          <h1 className="text-3xl font-extrabold text-[#17202A] tracking-tight">
            Discover Student Stays
          </h1>
          <p className="text-sm text-[#596573] mt-1">
            Personalized accommodation recommendations for{" "}
            <span className="font-bold text-[#17202A]">{profile?.name ?? "your student profile"}</span>
          </p>
        </div>

        {profile && <ProfileSelector selectedId={profile.id} />}
      </div>

      {/* Sorting & Filter controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5E0D8] shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#8A96A3] uppercase tracking-wider mr-1">
            Sort by:
          </span>
          <button
            onClick={() => setSortBy("match")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sortBy === "match"
                ? "bg-[#17202A] text-white shadow-sm"
                : "bg-[#F7F5EF] text-[#596573] hover:text-[#17202A]"
            }`}
          >
            Highest Match
          </button>
          <button
            onClick={() => setSortBy("price")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sortBy === "price"
                ? "bg-[#17202A] text-white shadow-sm"
                : "bg-[#F7F5EF] text-[#596573] hover:text-[#17202A]"
            }`}
          >
            Lowest Effective Cost
          </button>
          <button
            onClick={() => setSortBy("distance")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sortBy === "distance"
                ? "bg-[#17202A] text-white shadow-sm"
                : "bg-[#F7F5EF] text-[#596573] hover:text-[#17202A]"
            }`}
          >
            Nearest to Campus
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/student/search"
            className="btn-secondary text-xs py-1.5 px-3 font-bold flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            Custom Search & Filters
          </Link>
          <Link
            href="/student/compare"
            className="btn-primary text-xs py-1.5 px-3 font-bold flex items-center gap-1.5"
          >
            <Columns className="w-3.5 h-3.5" />
            Side-by-Side Compare
          </Link>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="campus-card h-80 animate-pulse bg-white/60 border border-[#E5E0D8]"
            />
          ))}
        </div>
      )}

      {/* Property Cards Grid */}
      {!loading && sortedResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedResults.map((result, idx) => (
            <PropertyCard
              key={result.property.id}
              result={result}
              rank={idx + 1}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && sortedResults.length === 0 && !error && (
        <div className="campus-card p-12 text-center max-w-md mx-auto bg-white border border-[#E5E0D8]">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F5EF] flex items-center justify-center text-[#596573] mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#17202A] mb-1">No matches found</h3>
          <p className="text-xs text-[#596573] mb-6">
            Try adjusting your profile budget, preferred locality, or exploring custom search filters.
          </p>
          <Link href="/student/profile" className="btn-primary text-xs py-2 px-4 font-bold">
            Adjust Profile Preferences
          </Link>
        </div>
      )}
    </div>
  );
}
