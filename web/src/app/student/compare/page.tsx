"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import StudentLayout from "@/app/student/layout";
import { compareProperties, getRecommendations } from "@/lib/api";
import type { CompareItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

function CompareContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<CompareItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const addId = searchParams.get("add");
    (async () => {
      try {
        let ids: string[] = [];
        if (addId) {
          ids = [addId];
          const recommendations = await getRecommendations();
          for (const property of recommendations) {
            if (ids.length >= 3) break;
            if (!ids.includes(property.id)) ids.push(property.id);
          }
        } else {
          const recommendations = await getRecommendations();
          ids = recommendations.slice(0, 3).map((p) => p.id);
        }
        if (ids.length < 2) {
          setError("Select at least 2 properties to compare.");
          return;
        }
        const results = await compareProperties(ids);
        setItems(results);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to load comparison");
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Compare Properties</h1>
          <p className="text-slate-600">
            Side-by-side comparison of top matches
          </p>
        </div>
        <Link href="/student" className="btn-secondary">Back to Discover</Link>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {loading && <p className="text-slate-500">Loading comparison...</p>}

      {!loading && !error && items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full glass-card rounded-2xl overflow-hidden">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Feature</th>
                {items.map((item) => (
                  <th key={item.id} className="text-left px-6 py-4 min-w-[220px]">
                    <div className="font-semibold text-slate-900 text-sm">{item.name}</div>
                    <Link href={`/student/property/${item.id}`} className="text-xs text-indigo-600 hover:underline">
                      View Details
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Match Score</td>
                {items.map((item) => (
                  <td key={item.id} className="px-6 py-4">
                    <div className="text-lg font-bold text-indigo-600">{item.matchScore}%</div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Effective Cost</td>
                {items.map((item) => (
                  <td key={item.id} className="px-6 py-4 text-sm text-slate-700">
                    {formatCurrency(item.effectiveMonthlyCost)}/mo
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Base Rent</td>
                {items.map((item) => (
                  <td key={item.id} className="px-6 py-4 text-sm text-slate-700">
                    {formatCurrency(item.rent)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Deposit</td>
                {items.map((item) => (
                  <td key={item.id} className="px-6 py-4 text-sm text-slate-700">
                    {formatCurrency(item.deposit)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Commute</td>
                {items.map((item) => (
                  <td key={item.id} className="px-6 py-4 text-sm text-slate-700">
                    {item.commuteTimeMin} min
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Distance</td>
                {items.map((item) => (
                  <td key={item.id} className="px-6 py-4 text-sm text-slate-700">
                    {item.distanceKm} km
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Rating</td>
                {items.map((item) => (
                  <td key={item.id} className="px-6 py-4 text-sm text-slate-700">
                    ⭐ {item.rating}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Availability</td>
                {items.map((item) => (
                  <td key={item.id} className="px-6 py-4 text-sm text-slate-700">
                    {item.available} beds
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Verification</td>
                {items.map((item) => (
                  <td key={item.id} className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.verificationStatus === "VERIFIED"
                      ? "bg-emerald-50 text-emerald-700"
                      : item.verificationStatus === "UNDER_REVIEW"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-slate-100 text-slate-600"
                      }`}>
                      {item.verificationStatus.replace("_", " ")}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Key Facilities</td>
                {items.map((item) => (
                  <td key={item.id} className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.keyFacilities.slice(0, 4).map((facility) => (
                        <span key={facility} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <StudentLayout>
      <Suspense fallback={<p className="text-slate-500">Loading comparison...</p>}>
        <CompareContent />
      </Suspense>
    </StudentLayout>
  );
}