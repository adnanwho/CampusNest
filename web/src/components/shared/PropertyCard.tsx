"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  ShieldCheck, 
  Wifi, 
  Utensils, 
  Zap, 
  Dumbbell, 
  BookOpen, 
  Star, 
  Sparkles, 
  Heart,
  Columns,
  ChevronRight
} from "lucide-react";
import type { MatchResult } from "@/lib/types";
import { getAvailabilityBadge, getEffectiveMonthlyCost } from "@/lib/scoring";
import { cn, formatCurrency } from "@/lib/utils";
import { getPropertyCoverImage } from "@/lib/images";

interface PropertyCardProps {
  result: MatchResult;
  rank?: number;
}

const facilityIcons: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi className="w-3 h-3" />,
  "WiFi": <Wifi className="w-3 h-3" />,
  "Food": <Utensils className="w-3 h-3" />,
  "Meals Included": <Utensils className="w-3 h-3" />,
  "Security": <ShieldCheck className="w-3 h-3" />,
  "CCTV/Security": <ShieldCheck className="w-3 h-3" />,
  "AC": <Zap className="w-3 h-3" />,
  "Gym": <Dumbbell className="w-3 h-3" />,
  "Study Room": <BookOpen className="w-3 h-3" />,
  "Power Backup": <Zap className="w-3 h-3" />,
};

export default function PropertyCard({ result, rank }: PropertyCardProps) {
  const { property, score, explanation } = result;
  const [isLiked, setIsLiked] = useState(false);
  const badge = getAvailabilityBadge(property);
  const effectiveCost = getEffectiveMonthlyCost(property);
  const coverImage = getPropertyCoverImage(property.id, property.type);

  const scoreBadgeColor = 
    score >= 80 
      ? "bg-[#EBF8F0] text-[#2A8C50] border-[#39B86B]/30" 
      : score >= 60 
        ? "bg-[#FFF8E7] text-[#D49B24] border-[#FFC857]/40" 
        : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <div className="group rounded-3xl bg-white border border-[#E5E0D8] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-[#D1CAC0] hover:-translate-y-1">
      {/* Visual Image Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={coverImage}
          alt={property.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {rank != null && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#17202A]/90 text-white backdrop-blur-md shadow-sm">
                #{rank} Match
              </span>
            )}
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/90 text-[#17202A] backdrop-blur-md border border-white/40 shadow-sm uppercase tracking-wider">
              {property.type}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {property.verificationStatus === "VERIFIED" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#39B86B]/90 text-white text-[10px] font-extrabold backdrop-blur-md shadow-sm">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#17202A] hover:scale-110 transition-transform shadow-sm"
              title="Save to favorites"
            >
              <Heart className={cn("w-4 h-4 transition-colors", isLiked ? "text-rose-500 fill-rose-500" : "text-[#17202A]")} />
            </button>
          </div>
        </div>

        {/* Bottom Image Overlay Strip */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white pointer-events-none">
          <div className="flex items-center gap-1 text-[11px] font-medium drop-shadow-md">
            <MapPin className="w-3 h-3 text-[#39B86B]" />
            <span className="truncate max-w-[200px]">{property.locality} · {property.distanceKm} km to campus</span>
          </div>

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold">
            <Star className="w-3 h-3 text-[#FFC857] fill-[#FFC857]" />
            <span>{property.rating || 4.5}</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        {/* Title & Vacancy */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link href={`/student/property/${property.id}`} className="block flex-1">
              <h3 className="font-extrabold text-[#17202A] text-base leading-snug group-hover:text-[#39B86B] transition-colors line-clamp-1">
                {property.name}
              </h3>
            </Link>
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-extrabold border flex-shrink-0", badge.color)}>
              {badge.label}
            </span>
          </div>

          <p className="text-xs text-[#596573] mt-0.5 line-clamp-1">
            {property.address}
          </p>
        </div>

        {/* Deterministic AI Score Match Banner */}
        {score > 0 && (
          <div className="rounded-2xl p-2.5 bg-[#FAF8F5] border border-[#E5E0D8]/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#17202A] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#39B86B]" />
                Student Fit Match
              </span>
              <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full border", scoreBadgeColor)}>
                {score}% Fit
              </span>
            </div>
            {explanation && (
              <p className="text-[11px] text-[#596573] leading-relaxed line-clamp-2">
                {explanation}
              </p>
            )}
          </div>
        )}

        {/* Facilities Amenities Chips */}
        <div className="flex flex-wrap gap-1">
          {property.facilities?.slice(0, 3).map((facility) => (
            <span
              key={facility}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F7F5EF] text-[#596573] text-[10px] font-medium border border-[#E5E0D8]"
            >
              {facilityIcons[facility] || null}
              {facility}
            </span>
          ))}
          {property.facilities && property.facilities.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md bg-[#F7F5EF] text-[#8A96A3] text-[10px] font-medium border border-[#E5E0D8]">
              +{property.facilities.length - 3}
            </span>
          )}
        </div>

        {/* Price & All-Inclusive Transparent Cost */}
        <div className="pt-3 border-t border-[#E5E0D8] flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-[#17202A]">
                {formatCurrency(property.rent)}
              </span>
              <span className="text-xs text-[#8A96A3]">/mo</span>
            </div>
            <div className="text-[11px] font-bold text-[#2A8C50]">
              Total: {formatCurrency(effectiveCost)}/mo (all-inclusive)
            </div>
          </div>

          <div className="text-right text-[11px] text-[#596573] font-medium">
            {property.available} of {property.capacity} beds left
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            href={`/student/property/${property.id}`}
            className="btn-primary flex-1 py-2 text-xs font-bold text-center flex items-center justify-center gap-1"
          >
            <span>View Stay</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/student/compare?add=${property.id}`}
            className="btn-secondary py-2 px-3 text-xs font-bold flex items-center gap-1 text-[#596573] hover:text-[#17202A]"
            title="Add to comparison"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Compare</span>
          </Link>
        </div>
      </div>
    </div>
  );
}