"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, RotateCcw, Building2, MapPin, IndianRupee } from "lucide-react";
import { getProperties } from "@/lib/api";
import type { Property, MatchResult } from "@/lib/types";
import PropertyCard from "@/components/shared/PropertyCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    locality: searchParams.get("locality") || "",
    budgetMin: searchParams.get("budgetMin") || "",
    budgetMax: searchParams.get("budgetMax") || "",
    type: searchParams.get("type") || "",
  });

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    setLoading(true);
    setError(null);
    try {
      const params: { locality?: string; budgetMin?: number; budgetMax?: number; type?: string } = {};
      if (filters.locality) params.locality = filters.locality;
      if (filters.budgetMin) params.budgetMin = Number(filters.budgetMin);
      if (filters.budgetMax) params.budgetMax = Number(filters.budgetMax);
      if (filters.type) params.type = filters.type;
      const data = await getProperties(params);
      setProperties(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load properties");
    } finally {
      setLoading(false);
    }
  }

  function updateFilter(field: keyof typeof filters, value: string) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function resetFilters() {
    setFilters({ locality: "", budgetMin: "", budgetMax: "", type: "" });
    getProperties({}).then(setProperties).catch(() => setProperties([]));
  }

  const results: MatchResult[] = properties.map((property) => ({
    property,
    score: property.matchScore ?? 0,
    explanation: property.aiExplanation ?? "Verified property matching your search filters.",
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF8F0] border border-[#39B86B]/30 text-[#2A8C50] text-xs font-bold uppercase tracking-wider mb-2">
          <Filter className="w-3.5 h-3.5" />
          Filter & Explore
        </div>
        <h1 className="text-3xl font-extrabold text-[#17202A] tracking-tight">
          Search Student Stays
        </h1>
        <p className="text-sm text-[#596573] mt-1">
          Filter verified student accommodations across Greater Noida & NCR campuses
        </p>
      </div>

      {/* Filter Box */}
      <div className="campus-card p-6 bg-white border border-[#E5E0D8] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
              Locality / Area
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#8A96A3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.locality}
                onChange={(event) => updateFilter("locality", event.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] placeholder:text-[#8A96A3] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all"
                placeholder="Knowledge Park, Pari Chowk..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
              Min Budget (₹/mo)
            </label>
            <input
              type="number"
              value={filters.budgetMin}
              onChange={(event) => updateFilter("budgetMin", event.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] placeholder:text-[#8A96A3] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all no-spinner"
              placeholder="e.g. 5000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
              Max Budget (₹/mo)
            </label>
            <input
              type="number"
              value={filters.budgetMax}
              onChange={(event) => updateFilter("budgetMax", event.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] placeholder:text-[#8A96A3] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all no-spinner"
              placeholder="e.g. 15000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
              Property Type
            </label>
            <select
              value={filters.type}
              onChange={(event) => updateFilter("type", event.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none transition-all"
            >
              <option value="">All Accommodation Types</option>
              <option value="PG">PG (Paying Guest)</option>
              <option value="HOSTEL">Student Hostel</option>
              <option value="FLAT">Independent Flat</option>
            </select>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-[#E5E0D8] flex items-center justify-between">
          <button
            onClick={resetFilters}
            type="button"
            className="text-xs font-bold text-[#596573] hover:text-[#17202A] flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
          <button
            onClick={loadProperties}
            className="btn-primary text-xs py-2 px-5 font-bold"
          >
            <Search className="w-3.5 h-3.5" />
            Apply Search
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-bold text-[#596573] px-1">
        <span>
          Showing {results.length} verified {results.length === 1 ? "stay" : "stays"}
        </span>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="campus-card h-80 animate-pulse bg-white/60 border border-[#E5E0D8]" />
          ))}
        </div>
      )}

      {!loading && results.length === 0 && !error && (
        <div className="campus-card p-12 text-center max-w-md mx-auto bg-white border border-[#E5E0D8]">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F5EF] flex items-center justify-center text-[#596573] mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#17202A] mb-1">No matching properties</h3>
          <p className="text-xs text-[#596573] mb-6">
            We couldn&apos;t find verified stays matching those exact criteria. Try broadening your budget or location.
          </p>
          <button onClick={resetFilters} className="btn-secondary text-xs py-2 px-4">
            Clear all filters
          </button>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result, idx) => (
            <PropertyCard
              key={result.property.id}
              result={result}
              rank={idx + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Loading search portal...</p>}>
      <SearchContent />
    </Suspense>
  );
}
