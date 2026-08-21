"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProperty } from "@/lib/api";
import type { Property } from "@/lib/types";
import { getAvailabilityBadge, getEffectiveMonthlyCost } from "@/lib/scoring";
import { formatCurrency } from "@/lib/utils";
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  ExternalLink, 
  ArrowLeft, 
  Sparkles, 
  Columns,
  Check
} from "lucide-react";

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getProperty(id)
      .then((data) => {
        if (isMounted) setProperty(data);
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError instanceof Error ? requestError.message : "Unable to load property");
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-sm font-bold text-red-600 mb-4">{error}</p>
        <Link href="/student" className="btn-primary text-xs py-2 px-4 font-bold inline-block">Back to Discover</Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="w-10 h-10 border-3 border-[#39B86B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-[#596573]">Loading accommodation details...</p>
      </div>
    );
  }

  const badge = getAvailabilityBadge(property);
  const score = property.matchScore ?? 0;
  const effectiveCost = getEffectiveMonthlyCost(property);
  const isVerified = property.verificationStatus === "VERIFIED";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back button */}
      <div>
        <Link href="/student" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#596573] hover:text-[#17202A] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Discover Stays
        </Link>
      </div>

      <div className="campus-card bg-white border border-[#E5E0D8] rounded-3xl overflow-hidden shadow-sm">
        {/* Header Strip */}
        <div className="p-6 md:p-8 bg-[#FAF8F5] border-b border-[#E5E0D8]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#E5E0D8] text-[#596573] uppercase tracking-wider">
                  {property.type}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.color}`}>
                  {badge.label}
                </span>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF8F0] text-[#2A8C50] border border-[#39B86B]/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#39B86B]" />
                    CampusNest Verified
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#17202A] tracking-tight mb-1">
                {property.name}
              </h1>
              <p className="text-xs text-[#596573] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8A96A3]" />
                {property.address}
              </p>
            </div>

            {score > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-[#E5E0D8] text-right flex-shrink-0">
                <div className="text-xs font-bold text-[#8A96A3] uppercase tracking-wider">CampusNest Match</div>
                <div className="text-2xl font-black text-[#2A8C50]">{score}%</div>
                <div className="text-[10px] text-[#596573]">5-Factor Profile Fit</div>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          <p className="text-sm text-[#596573] leading-relaxed">{property.description}</p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#F7F5EF] rounded-2xl p-4 text-center border border-[#E5E0D8]/60">
              <div className="text-xl font-black text-[#17202A]">{formatCurrency(property.rent)}</div>
              <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider mt-0.5">Base Rent</div>
            </div>
            <div className="bg-[#EBF8F0] rounded-2xl p-4 text-center border border-[#39B86B]/30">
              <div className="text-xl font-black text-[#2A8C50]">{formatCurrency(effectiveCost)}</div>
              <div className="text-[10px] font-bold text-[#2A8C50] uppercase tracking-wider mt-0.5">Effective Total /mo</div>
            </div>
            <div className="bg-[#F7F5EF] rounded-2xl p-4 text-center border border-[#E5E0D8]/60">
              <div className="text-xl font-black text-[#17202A]">{property.distanceKm} km</div>
              <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider mt-0.5">To Campus</div>
            </div>
            <div className="bg-[#F7F5EF] rounded-2xl p-4 text-center border border-[#E5E0D8]/60">
              <div className="text-xl font-black text-[#17202A]">{property.commuteTimeMin} min</div>
              <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider mt-0.5">Commute ({property.commuteMode})</div>
            </div>
          </div>

          {/* Match Explanation */}
          {property.aiExplanation && (
            <div className="p-4 bg-[#F7F5EF] border border-[#E5E0D8] rounded-2xl">
              <div className="text-xs font-bold text-[#17202A] flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#39B86B]" />
                CampusNest Matching Rationale
              </div>
              <p className="text-xs text-[#596573] leading-relaxed">{property.aiExplanation}</p>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E0D8]">
            <h3 className="text-xs font-bold text-[#596573] uppercase tracking-wider mb-3">
              Transparent Monthly Cost Breakdown
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { label: "Base Monthly Rent", value: property.rent },
                { label: "Food / Meal Plan", value: property.foodCost },
                { label: "Electricity (Estimated)", value: property.electricityCost },
                { label: "High-speed Wi-Fi", value: property.wifiCost },
                { label: "Maintenance & Cleaning", value: property.maintenanceCost },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-[#596573]">
                  <span>{item.label}</span>
                  <span className="font-semibold text-[#17202A]">{formatCurrency(item.value)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-extrabold border-t border-[#E5E0D8] pt-2.5 mt-2 text-[#17202A]">
                <span>Total Effective Monthly Outlay</span>
                <span className="text-[#39B86B] text-base">{formatCurrency(effectiveCost)}</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E0D8]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-[#596573] uppercase tracking-wider">
                Live Occupancy & Bed Vacancy
              </h3>
              <span className="text-xs font-bold text-[#17202A]">
                {property.available} of {property.capacity} beds available
              </span>
            </div>
            <div className="w-full bg-[#E5E0D8] rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#39B86B] h-full rounded-full transition-all duration-500"
                style={{ width: `${(property.occupied / Math.max(1, property.capacity)) * 100}%` }}
              />
            </div>
          </div>

          {/* Facilities */}
          <div>
            <h3 className="text-xs font-bold text-[#596573] uppercase tracking-wider mb-3">
              Included Facilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {property.facilities.map((facility) => (
                <span
                  key={facility}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F5EF] text-[#17202A] text-xs font-semibold border border-[#E5E0D8]"
                >
                  <Check className="w-3.5 h-3.5 text-[#39B86B]" />
                  {facility}
                </span>
              ))}
            </div>
          </div>

          {/* Verification Audit Certificate */}
          {property.verification && (
            <div className="p-5 bg-[#EBF8F0] border border-[#39B86B]/30 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-[#39B86B]" />
                <h3 className="font-extrabold text-[#2A8C50]">Audit Certificate Record</h3>
              </div>
              <div className="space-y-1.5 text-[#2A8C50]">
                <div>
                  <span className="font-semibold">Network: </span>
                  <span>{property.verification.networkName}</span>
                </div>
                <div>
                  <span className="font-semibold">SHA-256 Record Hash: </span>
                  <span className="font-mono text-[11px] break-all bg-white/70 px-2 py-0.5 rounded border border-[#39B86B]/20">{property.verification.recordHash}</span>
                </div>
                <div>
                  <span className="font-semibold">Verified Timestamp: </span>
                  <span>{new Date(property.verification.timestamp).toLocaleString()}</span>
                </div>
                {property.verification.explorerUrl && (
                  <a
                    href={property.verification.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#2A8C50] font-bold hover:underline pt-1"
                  >
                    View on Blockchain Explorer
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E5E0D8]">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#FFC857] fill-[#FFC857]" />
              <span className="font-extrabold text-sm text-[#17202A]">{property.rating || 4.5}</span>
              <span className="text-xs text-[#8A96A3]">/ 5.0</span>
            </div>
            <div className="flex gap-3">
              <Link href="/student" className="btn-secondary text-xs py-2 px-3.5 font-bold">
                Back to Discover
              </Link>
              <Link href={`/student/compare?add=${property.id}`} className="btn-primary text-xs py-2 px-4 font-bold flex items-center gap-1.5">
                <Columns className="w-3.5 h-3.5" />
                Add to Compare
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}