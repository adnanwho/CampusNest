"use client";

import { useEffect, useState } from "react";
import StudentLayout from "@/app/student/layout";
import { getProperties } from "@/lib/api";
import type { Property } from "@/lib/types";
import PropertyCard from "@/components/shared/PropertyCard";
import type { MatchResult } from "@/lib/types";

export default function SearchPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    locality: "",
    budgetMin: "",
    budgetMax: "",
    type: "",
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

  const results: MatchResult[] = properties.map((property) => ({
    property,
    score: property.matchScore ?? 0,
    explanation: property.aiExplanation ?? "Search result from your filters.",
  }));

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Search Properties</h1>
          <p className="text-slate-600">Filter verified accommodations by location, budget, and type</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Locality</label>
              <input
                type="text"
                value={filters.locality}
                onChange={(event) => updateFilter("locality", event.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner"
                placeholder="e.g., Knowledge Park"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Min Budget (₹)</label>
              <input
                type="number"
                value={filters.budgetMin}
                onChange={(event) => updateFilter("budgetMin", event.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Budget (₹)</label>
              <input
                type="number"
                value={filters.budgetMax}
                onChange={(event) => updateFilter("budgetMax", event.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner"
                placeholder="15000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(event) => updateFilter("type", event.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner"
              >
                <option value="">All Types</option>
                <option value="PG">PG</option>
                <option value="HOSTEL">Hostel</option>
                <option value="FLAT">Flat</option>
                <option value="SHARED_ACCOMMODATION">Shared Flat</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={loadProperties} className="btn-primary">
              Apply Filters
            </button>
          </div>
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading && <p className="text-slate-500">Loading properties...</p>}
        {!loading && results.length === 0 && !error && (
          <p className="text-slate-500 text-center py-12">No properties match your filters.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result, idx) => (
            <PropertyCard
              key={result.property.id}
              result={result}
              rank={idx + 1}
            />
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}
