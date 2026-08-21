"use client";

import Link from "next/link";
import { MapPin, IndianRupee, Wifi, Shield, Utensils, Car, Zap, Dumbbell, BookOpen, Star, ChevronRight } from "lucide-react";
import { MatchResult } from "@/lib/types";
import { getAvailabilityBadge } from "@/lib/scoring";
import { cn, formatCurrency } from "@/lib/utils";

interface PropertyCardProps {
  result: MatchResult;
  rank: number;
}

const facilityIcons: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi className="w-3.5 h-3.5" />,
  "Food": <Utensils className="w-3.5 h-3.5" />,
  "Security": <Shield className="w-3.5 h-3.5" />,
  "AC": <Zap className="w-3.5 h-3.5" />,
  "Parking": <Car className="w-3.5 h-3.5" />,
  "Gym": <Dumbbell className="w-3.5 h-3.5" />,
  "Study Room": <BookOpen className="w-3.5 h-3.5" />,
  "Power Backup": <Zap className="w-3.5 h-3.5" />,
};

export default function PropertyCard({ result, rank }: PropertyCardProps) {
  const { property, score, explanation } = result;
  const badge = getAvailabilityBadge(property);
  const effectiveCost = property.rent + property.foodCost + property.electricityCost + property.wifiCost + property.maintenanceCost;

  const circumference = 2 * Math.PI * 34;
  const dashOffset = circumference - (score / 100) * circumference;

  const scoreColor = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div
      className="glass-card rounded-2xl overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                #{rank}
              </span>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", badge.color)}>
                {badge.label}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">
              {property.name}
            </h3>
            <div className="flex items-center gap-1 text-slate-500 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {property.locality}
            </div>
          </div>

          <div className="score-ring flex-shrink-0">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle className="score-ring-bg" cx="40" cy="40" r="34" />
              <circle
                className="score-ring-fill"
                cx="40"
                cy="40"
                r="34"
                stroke={scoreColor}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-slate-900">{score}%</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {explanation}
        </p>

        <div className="flex items-baseline gap-1 mb-4">
          <IndianRupee className="w-4 h-4 text-slate-700" />
          <span className="text-xl font-bold text-slate-900">
            {formatCurrency(effectiveCost)}
          </span>
          <span className="text-sm text-slate-500">/month effective</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {property.facilities.slice(0, 5).map((facility) => (
            <span
              key={facility}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
            >
              {facilityIcons[facility]}
              {facility}
            </span>
          ))}
          {property.facilities.length > 5 && (
            <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-xs font-medium">
              +{property.facilities.length - 5} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-slate-900">{property.rating}</span>
            <span className="text-sm text-slate-500">rating</span>
          </div>
          <Link
            href={`/student/property/${property.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group/link"
          >
            View Details
            <ChevronRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {property.verificationStatus === "VERIFIED" && (
        <div className="px-6 py-3 bg-emerald-50 border-t border-emerald-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">
            Verified on Blockchain
          </span>
        </div>
      )}
    </div>
  );
}
