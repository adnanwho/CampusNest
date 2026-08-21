"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Columns, 
  ArrowLeft, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Sparkles,
  ChevronRight,
  TrendingDown,
  Navigation
} from "lucide-react";
import { compareProperties, getRecommendations } from "@/lib/api";
import type { CompareItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { getPropertyCoverImage } from "@/lib/images";

function CompareContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<CompareItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const addId = searchParams.get("add");
    let isMounted = true;
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
          if (isMounted) {
            setError("Select at least 2 properties to compare.");
            setLoading(false);
          }
          return;
        }
        const results = await compareProperties(ids);
        if (isMounted) {
          setItems(results);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load comparison");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-24">
        <div className="w-12 h-12 border-3 border-[#39B86B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-bold text-[#596573]">Generating side-by-side financial and facility comparison matrix...</p>
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 bg-white rounded-3xl border border-[#E5E0D8] p-8 shadow-sm">
        <p className="text-sm font-bold text-red-600 mb-4">{error || "No properties available to compare."}</p>
        <Link href="/student" className="btn-primary text-xs py-2.5 px-5 font-bold inline-block">
          Back to Discover Stays
        </Link>
      </div>
    );
  }

  // Find Best Values for Highlights
  const lowestCost = Math.min(...items.map((it) => it.effectiveMonthlyCost));
  const nearestDistance = Math.min(...items.map((it) => it.distanceKm || 999));

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/student"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#596573] hover:text-[#17202A] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Discover Stays</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-[#17202A] tracking-tight">
            Side-by-Side Accommodation Comparison
          </h1>
          <p className="text-xs text-[#596573] mt-0.5">
            Transparent matrix of effective monthly costs, deposits, campus commute times, and verified facilities.
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => {
          const isBestPrice = item.effectiveMonthlyCost === lowestCost;
          const isNearest = item.distanceKm === nearestDistance;
          const coverImg = getPropertyCoverImage(item.id, "PG");

          return (
            <div
              key={item.id}
              className="campus-card bg-white border border-[#E5E0D8] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              {/* Photo Header */}
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <Image
                  src={coverImg}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Top Highlights */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {isBestPrice && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#39B86B] text-white shadow-sm flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      Lowest Monthly Cost
                    </span>
                  )}
                  {isNearest && !isBestPrice && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-sm flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      Nearest to Campus
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-lg leading-tight truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-white/90">
                    <Star className="w-3.5 h-3.5 text-[#FFC857] fill-[#FFC857]" />
                    <span>{item.rating || 4.5}</span>
                    <span>•</span>
                    <span>{item.distanceKm} km to campus</span>
                  </div>
                </div>
              </div>

              {/* Comparison Metric Rows */}
              <div className="p-5 flex-1 space-y-4 text-xs divide-y divide-[#E5E0D8]">
                {/* Financial Summary */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-bold text-[#8A96A3] uppercase">Effective Total</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#17202A]">
                      {formatCurrency(item.effectiveMonthlyCost)}
                    </span>
                    <span className="text-xs text-[#8A96A3]">/mo</span>
                  </div>
                  <div className="text-[11px] text-[#596573]">
                    Base Rent: {formatCurrency(item.rent)} • Deposit: {formatCurrency(item.deposit)}
                  </div>
                </div>

                {/* Commute & Distance */}
                <div className="pt-3 space-y-1">
                  <div className="text-[10px] font-bold text-[#8A96A3] uppercase">Campus Proximity</div>
                  <div className="font-bold text-[#17202A]">
                    {item.distanceKm} km ({item.commuteTimeMin} min commute)
                  </div>
                </div>

                {/* Capacity & Vacancy */}
                <div className="pt-3 space-y-1">
                  <div className="text-[10px] font-bold text-[#8A96A3] uppercase">Live Vacancy</div>
                  <div className="font-bold text-[#2A8C50]">
                    {item.available} beds available
                  </div>
                </div>

                {/* Verification Status */}
                <div className="pt-3 space-y-1">
                  <div className="text-[10px] font-bold text-[#8A96A3] uppercase">Verification</div>
                  <div className="flex items-center gap-1 font-bold text-[#2A8C50]">
                    <ShieldCheck className="w-4 h-4 text-[#39B86B]" />
                    <span>CampusNest Verified Listing</span>
                  </div>
                </div>

                {/* Facilities List */}
                <div className="pt-3 space-y-2">
                  <div className="text-[10px] font-bold text-[#8A96A3] uppercase">Included Facilities</div>
                  <div className="flex flex-wrap gap-1">
                    {(item.keyFacilities || []).map((fac: string) => (
                      <span
                        key={fac}
                        className="px-2 py-0.5 rounded-md bg-[#F7F5EF] text-[#17202A] text-[10px] font-semibold border border-[#E5E0D8]"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <Link
                  href={`/student/property/${item.id}`}
                  className="btn-primary w-full py-2.5 text-xs font-bold text-center flex items-center justify-center gap-1"
                >
                  <span>View Full Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function StudentComparePage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center">
          <div className="w-10 h-10 border-3 border-[#39B86B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-bold text-[#596573]">Loading comparison matrix...</p>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}