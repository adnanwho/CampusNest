"use client";

import Link from "next/link";
import { 
  MapPin, 
  ShieldCheck, 
  Wifi, 
  Utensils, 
  Zap, 
  Dumbbell, 
  BookOpen, 
  Star, 
  ChevronRight,
  Sparkles,
  Building,
  Clock,
  CheckCircle
} from "lucide-react";
import { MatchResult } from "@/lib/types";
import { getAvailabilityBadge, getEffectiveMonthlyCost } from "@/lib/scoring";
import { cn, formatCurrency } from "@/lib/utils";

interface PropertyCardProps {
  result: MatchResult;
  rank: number;
}

const facilityIcons: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi className="w-3.5 h-3.5" />,
  "WiFi": <Wifi className="w-3.5 h-3.5" />,
  "Food": <Utensils className="w-3.5 h-3.5" />,
  "Meals Included": <Utensils className="w-3.5 h-3.5" />,
  "Security": <ShieldCheck className="w-3.5 h-3.5" />,
  "CCTV/Security": <ShieldCheck className="w-3.5 h-3.5" />,
  "AC": <Zap className="w-3.5 h-3.5" />,
  "Gym": <Dumbbell className="w-3.5 h-3.5" />,
  "Study Room": <BookOpen className="w-3.5 h-3.5" />,
  "Power Backup": <Zap className="w-3.5 h-3.5" />,
};

export default function PropertyCard({ result, rank }: PropertyCardProps) {
  const { property, score, explanation } = result;
  const badge = getAvailabilityBadge(property);
  const effectiveCost = getEffectiveMonthlyCost(property);

  const scoreBadgeColor = 
    score >= 80 
      ? "bg-[#EBF8F0] text-[#2A8C50] border-[#39B86B]/30" 
      : score >= 60 
        ? "bg-[#FFF8E7] text-[#D49B24] border-[#FFC857]/40" 
        : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <div className="campus-card overflow-hidden flex flex-col justify-between group border border-[#E5E0D8] bg-white">
      {/* Top Media / Header strip */}
      <div className="relative bg-[#FAF8F5] p-5 pb-4 border-b border-[#E5E0D8]">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-[#17202A] text-white">
              #{rank}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#E5E0D8] text-[#596573] uppercase tracking-wider">
              {property.type}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border", badge.color)}>
              {badge.label}
            </span>
          </div>
        </div>

        <h3 className="font-bold text-[#17202A] text-lg leading-snug group-hover:text-[#39B86B] transition-colors mb-1 line-clamp-1">
          {property.name}
        </h3>

        <div className="flex items-center gap-1 text-[#596573] text-xs">
          <MapPin className="w-3.5 h-3.5 text-[#8A96A3] flex-shrink-0" />
          <span className="truncate">{property.locality} · {property.distanceKm} km ({property.commuteTimeMin} min {property.commuteMode.toLowerCase()})</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Match score & explanation */}
        <div className="rounded-xl p-3 bg-[#F7F5EF] border border-[#E5E0D8]/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#17202A] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#39B86B]" />
              CampusNest Match
            </span>
            <span className={cn("text-xs font-black px-2 py-0.5 rounded-full border", scoreBadgeColor)}>
              {score}% Match
            </span>
          </div>
          <p className="text-xs text-[#596573] leading-relaxed line-clamp-2">
            {explanation}
          </p>
        </div>

        {/* Facilities Chips */}
        <div className="flex flex-wrap gap-1.5">
          {property.facilities.slice(0, 4).map((facility) => (
            <span
              key={facility}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100/80 text-[#596573] text-[11px] font-medium"
            >
              {facilityIcons[facility] || <CheckCircle className="w-3 h-3 text-[#39B86B]" />}
              {facility}
            </span>
          ))}
          {property.facilities.length > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100/80 text-[#8A96A3] text-[11px] font-medium">
              +{property.facilities.length - 4} more
            </span>
          )}
        </div>

        {/* Pricing & Bed vacancy */}
        <div className="pt-3 border-t border-[#E5E0D8] flex items-baseline justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#8A96A3] uppercase tracking-wider">
              Effective Cost
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-[#17202A]">
                {formatCurrency(effectiveCost)}
              </span>
              <span className="text-xs text-[#8A96A3]">/mo</span>
            </div>
            <div className="text-[11px] text-[#596573]">
              Base Rent: {formatCurrency(property.rent)}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-xs font-bold text-[#17202A] mb-0.5">
              <Star className="w-3.5 h-3.5 text-[#FFC857] fill-[#FFC857]" />
              <span>{property.rating}</span>
              <span className="text-[#8A96A3] font-normal">/ 5.0</span>
            </div>
            <div className="text-[11px] text-[#596573]">
              {property.available} {property.available === 1 ? "bed" : "beds"} available
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            href={`/student/property/${property.id}`}
            className="btn-primary flex-1 py-2 text-xs font-bold shadow-none"
          >
            View Details
          </Link>
          <Link
            href={`/student/compare?add=${property.id}`}
            className="btn-secondary py-2 px-3 text-xs font-bold"
            title="Compare with other properties"
          >
            Compare
          </Link>
        </div>
      </div>

      {/* Verification footer tag */}
      {property.verificationStatus === "VERIFIED" && (
        <div className="px-5 py-2 bg-[#EBF8F0] border-t border-[#39B86B]/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#2A8C50] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#39B86B]" />
            <span>CampusNest Verified</span>
          </div>
          {property.blockchainTx ? (
            <span className="text-[10px] text-[#596573] font-medium">
              Audit Record Stamped
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}