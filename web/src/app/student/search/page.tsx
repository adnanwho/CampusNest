"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  Filter, 
  RotateCcw, 
  MapPin, 
  SlidersHorizontal,
  Home,
  Building,
  CheckCircle2,
  X
} from "lucide-react";
import { getProperties } from "@/lib/api";
import type { Property, MatchResult } from "@/lib/types";
import PropertyCard from "@/components/shared/PropertyCard";
import { cn } from "@/lib/utils";

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

  const [selectedAmenity, setSelectedAmenity] = useState<string>("ALL");

  useEffect(() => {
    let isMounted = true;
    const params: { locality?: string; budgetMin?: number; budgetMax?: number; type?: string } = {};
    if (filters.locality) params.locality = filters.locality;
    if (filters.budgetMin) params.budgetMin = Number(filters.budgetMin);
    if (filters.budgetMax) params.budgetMax = Number(filters.budgetMax);
    if (filters.type) params.type = filters.type;

    getProperties(params)
      .then((data) => {
        if (isMounted) {
          setProperties(data);
          setError(null);
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load properties");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const updateFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      locality: "",
      budgetMin: "",
      budgetMax: "",
      type: "",
    });
    setSelectedAmenity("ALL");
  };

  const localities = [
    "All Localities",
    "Knowledge Park III",
    "Knowledge Park II",
    "Pari Chowk",
    "Alpha 1",
    "Alpha 2",
    "Beta 1",
    "Gamma 1",
    "Sector 62",
  ];

  const accommodationTypes = [
    { value: "", label: "All Types" },
    { value: "PG", label: "Student PG" },
    { value: "HOSTEL", label: "Hostel" },
    { value: "FLAT", label: "Flat / Apartment" },
    { value: "SHARED_ACCOMMODATION", label: "Shared Stay" },
  ];

  const amenities = [
    { id: "ALL", label: "All Amenities" },
    { id: "WiFi", label: "High Speed Wi-Fi" },
    { id: "Food", label: "Meals Included" },
    { id: "AC", label: "Air Conditioned" },
    { id: "Security", label: "24/7 Security" },
    { id: "Gym", label: "Fitness Gym" },
  ];

  const filteredProperties = useMemo(() => {
    if (selectedAmenity === "ALL") return properties;
    return properties.filter((p) =>
      (p.facilities || []).some((f) =>
        f.toLowerCase().includes(selectedAmenity.toLowerCase())
      )
    );
  }, [properties, selectedAmenity]);

  const hasActiveFilters =
    Boolean(filters.locality) ||
    Boolean(filters.type) ||
    Boolean(filters.budgetMin) ||
    Boolean(filters.budgetMax) ||
    selectedAmenity !== "ALL";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Search Controls Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E0D8] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF8F0] border border-[#39B86B]/30 text-[#2A8C50] text-xs font-extrabold uppercase tracking-wider mb-1">
              <Search className="w-3.5 h-3.5" />
              Comprehensive Search & Discovery
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17202A] tracking-tight">
              Explore Verified Accommodations
            </h1>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-[#E63946] hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Locality Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#8A96A3] uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#39B86B]" />
              Locality / Area
            </label>
            <select
              value={filters.locality}
              onChange={(e) => updateFilter("locality", e.target.value === "All Localities" ? "" : e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF]/70 border border-[#E5E0D8] text-xs font-bold text-[#17202A] outline-none focus:border-[#39B86B] focus:bg-white"
            >
              {localities.map((loc) => (
                <option key={loc} value={loc === "All Localities" ? "" : loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Accommodation Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#8A96A3] uppercase tracking-wider flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-[#39B86B]" />
              Stay Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => updateFilter("type", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF]/70 border border-[#E5E0D8] text-xs font-bold text-[#17202A] outline-none focus:border-[#39B86B] focus:bg-white"
            >
              {accommodationTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Min */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#8A96A3] uppercase tracking-wider">
              Min Effective Budget
            </label>
            <input
              type="number"
              value={filters.budgetMin}
              onChange={(e) => updateFilter("budgetMin", e.target.value)}
              placeholder="e.g. 5000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF]/70 border border-[#E5E0D8] text-xs font-bold text-[#17202A] outline-none focus:border-[#39B86B] focus:bg-white"
            />
          </div>

          {/* Budget Max */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#8A96A3] uppercase tracking-wider">
              Max Effective Budget
            </label>
            <input
              type="number"
              value={filters.budgetMax}
              onChange={(e) => updateFilter("budgetMax", e.target.value)}
              placeholder="e.g. 15000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5EF]/70 border border-[#E5E0D8] text-xs font-bold text-[#17202A] outline-none focus:border-[#39B86B] focus:bg-white"
            />
          </div>
        </div>

        {/* Amenity Filter Chips */}
        <div className="pt-2 border-t border-[#E5E0D8] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-[#8A96A3] uppercase tracking-wider mr-1 flex-shrink-0">
            Amenities:
          </span>
          {amenities.map((amenity) => {
            const isSelected = selectedAmenity === amenity.id;
            return (
              <button
                key={amenity.id}
                onClick={() => setSelectedAmenity(amenity.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
                  isSelected
                    ? "bg-[#17202A] text-white"
                    : "bg-[#F7F5EF] text-[#596573] hover:text-[#17202A] hover:bg-[#E5E0D8]"
                )}
              >
                {amenity.label}
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

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#596573]">
        <span className="font-bold text-[#17202A]">
          Found {filteredProperties.length} verified stays
        </span>
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

      {/* Property Cards Grid */}
      {!loading && filteredProperties.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop, idx) => (
            <PropertyCard
              key={prop.id}
              result={{
                property: prop,
                score: prop.matchScore ?? 0,
                explanation: prop.aiExplanation ?? "Verified student stay matching your search parameters.",
              }}
              rank={idx + 1}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProperties.length === 0 && !error && (
        <div className="campus-card p-12 text-center max-w-md mx-auto bg-white border border-[#E5E0D8]">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F5EF] flex items-center justify-center text-[#596573] mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#17202A] mb-1">No stays match your criteria</h3>
          <p className="text-xs text-[#596573] mb-6">
            Try adjusting your budget range, changing the locality, or resetting active amenity filters.
          </p>
          <button
            onClick={resetFilters}
            className="btn-primary text-xs py-2 px-4 font-bold"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function StudentSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center">
          <div className="w-10 h-10 border-3 border-[#39B86B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-bold text-[#596573]">Loading search portal...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
