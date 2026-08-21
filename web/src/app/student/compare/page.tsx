"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Columns, 
  ArrowLeft, 
  ShieldCheck, 
  Star, 
  Clock, 
  MapPin, 
  Sparkles, 
  Building2,
  CheckCircle2
} from "lucide-react";
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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-[#E5E0D8] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF8F0] border border-[#39B86B]/30 text-[#2A8C50] text-xs font-bold uppercase tracking-wider mb-2">
            <Columns className="w-3.5 h-3.5" />
            Side-by-Side Evaluation
          </div>
          <h1 className="text-3xl font-extrabold text-[#17202A] tracking-tight">
            Compare Student Stays
          </h1>
          <p className="text-sm text-[#596573] mt-1">
            Compare true monthly cost, commute, and facilities side-by-side
          </p>
        </div>
        <Link href="/student" className="btn-secondary text-xs py-2 px-3.5 font-bold flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Discover
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="campus-card p-12 text-center bg-white border border-[#E5E0D8]">
          <div className="w-10 h-10 border-3 border-[#39B86B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-[#596573]">Generating comparison matrix...</p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="overflow-x-auto rounded-3xl border border-[#E5E0D8] bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E5E0D8]">
                <th className="p-5 text-xs font-bold text-[#8A96A3] uppercase tracking-wider w-48">
                  Feature / Stay
                </th>
                {items.map((item, idx) => (
                  <th key={item.id} className="p-5 min-w-[240px] border-l border-[#E5E0D8]">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#17202A] text-white">
                        Stay #{idx + 1}
                      </span>
                      <span className="text-xs font-black text-[#2A8C50] bg-[#EBF8F0] px-2.5 py-0.5 rounded-full border border-[#39B86B]/20">
                        {item.matchScore}% Match
                      </span>
                    </div>
                    <div className="font-extrabold text-base text-[#17202A] line-clamp-1">{item.name}</div>
                    <Link
                      href={`/student/property/${item.id}`}
                      className="text-xs font-bold text-[#39B86B] hover:text-[#2A8C50] hover:underline inline-block mt-1"
                    >
                      View Details →
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8] text-sm">
              {/* Effective Monthly Cost */}
              <tr className="bg-[#EBF8F0]/30">
                <td className="p-5 font-bold text-[#17202A]">Effective Total Outlay</td>
                {items.map((item) => (
                  <td key={item.id} className="p-5 border-l border-[#E5E0D8]">
                    <div className="text-lg font-black text-[#2A8C50]">
                      {formatCurrency(item.effectiveMonthlyCost)}
                      <span className="text-xs font-normal text-[#596573]"> /mo</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Base Rent */}
              <tr>
                <td className="p-5 font-semibold text-[#596573]">Base Monthly Rent</td>
                {items.map((item) => (
                  <td key={item.id} className="p-5 border-l border-[#E5E0D8] font-bold text-[#17202A]">
                    {formatCurrency(item.rent)}
                  </td>
                ))}
              </tr>

              {/* Deposit */}
              <tr>
                <td className="p-5 font-semibold text-[#596573]">Security Deposit</td>
                {items.map((item) => (
                  <td key={item.id} className="p-5 border-l border-[#E5E0D8] text-[#596573]">
                    {formatCurrency(item.deposit)}
                  </td>
                ))}
              </tr>

              {/* Commute */}
              <tr>
                <td className="p-5 font-semibold text-[#596573]">Commute & Distance</td>
                {items.map((item) => (
                  <td key={item.id} className="p-5 border-l border-[#E5E0D8] text-[#17202A]">
                    <span className="font-bold">{item.commuteTimeMin} min</span>
                    <span className="text-[#596573] text-xs"> ({item.distanceKm} km)</span>
                  </td>
                ))}
              </tr>

              {/* Live Availability */}
              <tr>
                <td className="p-5 font-semibold text-[#596573]">Live Bed Vacancy</td>
                {items.map((item) => (
                  <td key={item.id} className="p-5 border-l border-[#E5E0D8]">
                    <span className="font-bold text-[#17202A]">{item.available}</span>
                    <span className="text-xs text-[#596573]"> beds available</span>
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="p-5 font-semibold text-[#596573]">Student Rating</td>
                {items.map((item) => (
                  <td key={item.id} className="p-5 border-l border-[#E5E0D8]">
                    <div className="flex items-center gap-1 font-bold text-[#17202A]">
                      <Star className="w-4 h-4 text-[#FFC857] fill-[#FFC857]" />
                      <span>{item.rating}</span>
                      <span className="text-xs text-[#8A96A3] font-normal">/ 5.0</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Verification Status */}
              <tr>
                <td className="p-5 font-semibold text-[#596573]">Verification Status</td>
                {items.map((item) => (
                  <td key={item.id} className="p-5 border-l border-[#E5E0D8]">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EBF8F0] text-[#2A8C50] border border-[#39B86B]/30">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#39B86B]" />
                      CampusNest Verified
                    </span>
                  </td>
                ))}
              </tr>

              {/* Key Facilities */}
              <tr>
                <td className="p-5 font-semibold text-[#596573]">Included Facilities</td>
                {items.map((item) => (
                  <td key={item.id} className="p-5 border-l border-[#E5E0D8]">
                    <div className="flex flex-wrap gap-1.5">
                      {item.keyFacilities.map((facility) => (
                        <span
                          key={facility}
                          className="px-2.5 py-1 rounded-lg bg-[#F7F5EF] text-[#17202A] text-xs font-medium border border-[#E5E0D8]"
                        >
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
    <Suspense fallback={<p className="text-slate-500">Loading comparison...</p>}>
      <CompareContent />
    </Suspense>
  );
}