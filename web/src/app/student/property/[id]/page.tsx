"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProperty } from "@/lib/api";
import type { Property } from "@/lib/types";
import { getAvailabilityBadge, getEffectiveMonthlyCost } from "@/lib/scoring";
import { formatCurrency, cn } from "@/lib/utils";
import { getPropertyCoverImage, getPropertyGallery } from "@/lib/images";
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles, 
  Columns,
  Check,
  Wifi,
  Utensils,
  Zap,
  Dumbbell,
  BookOpen,
  Car,
  Heart,
  Share2,
  Calendar,
  Phone,
  Building,
  CheckCircle2,
  Lock,
  ChevronRight,
  Info
} from "lucide-react";

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [visitScheduled, setVisitScheduled] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

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
      <div className="max-w-4xl mx-auto text-center py-20 bg-white rounded-3xl border border-[#E5E0D8] p-8 shadow-sm">
        <p className="text-sm font-bold text-red-600 mb-4">{error}</p>
        <Link href="/student" className="btn-primary text-xs py-2.5 px-5 font-bold inline-block">
          Back to Discover Stays
        </Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-5xl mx-auto text-center py-24">
        <div className="w-12 h-12 border-3 border-[#39B86B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-bold text-[#596573]">Loading complete property details & verification record...</p>
      </div>
    );
  }

  const badge = getAvailabilityBadge(property);
  const score = property.matchScore ?? 0;
  const effectiveCost = getEffectiveMonthlyCost(property);
  const isVerified = property.verificationStatus === "VERIFIED";
  const gallery = getPropertyGallery(property.id);

  const facilityIconMap: Record<string, React.ReactNode> = {
    "Wi-Fi": <Wifi className="w-4 h-4 text-[#39B86B]" />,
    "WiFi": <Wifi className="w-4 h-4 text-[#39B86B]" />,
    "Food": <Utensils className="w-4 h-4 text-[#39B86B]" />,
    "Meals Included": <Utensils className="w-4 h-4 text-[#39B86B]" />,
    "Security": <ShieldCheck className="w-4 h-4 text-[#39B86B]" />,
    "CCTV/Security": <ShieldCheck className="w-4 h-4 text-[#39B86B]" />,
    "AC": <Zap className="w-4 h-4 text-[#39B86B]" />,
    "Gym": <Dumbbell className="w-4 h-4 text-[#39B86B]" />,
    "Study Room": <BookOpen className="w-4 h-4 text-[#39B86B]" />,
    "Power Backup": <Zap className="w-4 h-4 text-[#39B86B]" />,
    "Parking": <Car className="w-4 h-4 text-[#39B86B]" />,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Top Breadcrumbs & Actions */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/student"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#596573] hover:text-[#17202A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Discover</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="btn-secondary text-xs py-1.5 px-3 font-bold flex items-center gap-1.5"
          >
            <Heart className={cn("w-3.5 h-3.5", isLiked ? "text-rose-500 fill-rose-500" : "text-[#17202A]")} />
            <span>{isLiked ? "Saved" : "Save"}</span>
          </button>
          <Link
            href={`/student/compare?add=${property.id}`}
            className="btn-secondary text-xs py-1.5 px-3 font-bold flex items-center gap-1.5"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Compare</span>
          </Link>
        </div>
      </div>

      {/* Property Title & Header Bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#17202A] text-white uppercase tracking-wider">
            {property.type}
          </span>
          <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", badge.color)}>
            {badge.label}
          </span>
          {isVerified && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EBF8F0] border border-[#39B86B]/30 text-[#2A8C50] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              CampusNest Verified
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17202A] tracking-tight">
          {property.name}
        </h1>

        <div className="flex items-center gap-4 text-xs text-[#596573] flex-wrap">
          <div className="flex items-center gap-1 font-bold text-[#17202A]">
            <Star className="w-4 h-4 text-[#FFC857] fill-[#FFC857]" />
            <span>{property.rating || 4.8}</span>
            <span className="text-[#8A96A3] font-normal">(Verified student reviews)</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#39B86B]" />
            <span>{property.address} ({property.locality})</span>
          </div>
          <span>•</span>
          <span>{property.distanceKm} km from campus ({property.commuteTimeMin} min {property.commuteMode?.toLowerCase() || "commute"})</span>
        </div>
      </div>

      {/* Airbnb-style Photo Gallery Mosaic */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden h-[340px] sm:h-[420px]">
        {/* Large Hero Image */}
        <div className="relative md:col-span-2 h-full bg-slate-100 group">
          <Image
            src={gallery[0] || getPropertyCoverImage(property.id, property.type)}
            alt={property.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* 2nd & 3rd Photo Column */}
        <div className="hidden md:flex flex-col gap-3 h-full">
          <div className="relative flex-1 bg-slate-100 overflow-hidden group">
            <Image
              src={gallery[1] || getPropertyCoverImage(property.id + 1, property.type)}
              alt="Room view"
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="relative flex-1 bg-slate-100 overflow-hidden group">
            <Image
              src={gallery[2] || getPropertyCoverImage(property.id + 2, property.type)}
              alt="Study area"
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* 4th & 5th Photo Column */}
        <div className="hidden md:flex flex-col gap-3 h-full">
          <div className="relative flex-1 bg-slate-100 overflow-hidden group">
            <Image
              src={gallery[3] || getPropertyCoverImage(property.id + 3, property.type)}
              alt="Facilities"
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="relative flex-1 bg-slate-100 overflow-hidden group">
            <Image
              src={gallery[4] || getPropertyCoverImage(property.id + 4, property.type)}
              alt="Common area"
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Property Details & Features */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview Stats */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5E0D8] shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]/60 text-center">
              <div className="text-[10px] font-bold text-[#8A96A3] uppercase">Total Capacity</div>
              <div className="text-xl font-black text-[#17202A] mt-1">{property.capacity} Beds</div>
              <div className="text-[10px] text-[#596573]">Student capacity</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EBF8F0] border border-[#39B86B]/30 text-center">
              <div className="text-[10px] font-bold text-[#2A8C50] uppercase">Available Now</div>
              <div className="text-xl font-black text-[#2A8C50] mt-1">{property.available} Beds</div>
              <div className="text-[10px] text-[#2A8C50]/80">Immediate vacancy</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]/60 text-center">
              <div className="text-[10px] font-bold text-[#8A96A3] uppercase">Occupancy</div>
              <div className="text-xl font-black text-[#17202A] mt-1">{property.occupied} Beds</div>
              <div className="text-[10px] text-[#596573]">Active residents</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]/60 text-center">
              <div className="text-[10px] font-bold text-[#8A96A3] uppercase">Campus Distance</div>
              <div className="text-xl font-black text-[#17202A] mt-1">{property.distanceKm} km</div>
              <div className="text-[10px] text-[#596573]">{property.commuteTimeMin} min commute</div>
            </div>
          </div>

          {/* 5-Factor Student Fit Match Breakdown */}
          {score > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E0D8] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#39B86B]" />
                  <h2 className="text-base font-extrabold text-[#17202A]">Deterministic Fit Match</h2>
                </div>
                <span className="text-sm font-black px-3 py-1 rounded-full bg-[#EBF8F0] text-[#2A8C50] border border-[#39B86B]/30">
                  {score}% Fit Match
                </span>
              </div>

              <p className="text-xs text-[#596573] leading-relaxed">
                {property.aiExplanation ||
                  "This accommodation scored high based on your budget alignment, university proximity, verified amenities, and lifestyle preferences."}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <span className="font-bold text-[#17202A] block">Budget Alignment</span>
                  <span className="text-[#2A8C50] text-[11px] font-semibold">
                    {formatCurrency(effectiveCost)}/mo fits profile
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <span className="font-bold text-[#17202A] block">Commute Viability</span>
                  <span className="text-[#2A8C50] text-[11px] font-semibold">
                    {property.distanceKm} km ({property.commuteMode})
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <span className="font-bold text-[#17202A] block">Trust & Verification</span>
                  <span className="text-[#2A8C50] text-[11px] font-semibold">
                    {isVerified ? "100% Cryptographic Trust" : "Pending Audit"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Amenities & Facilities */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E0D8] shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#17202A]">What this stay offers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(property.facilities || []).map((facility) => (
                <div
                  key={facility}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#F7F5EF] border border-[#E5E0D8] text-xs font-bold text-[#17202A]"
                >
                  {facilityIconMap[facility] || <CheckCircle2 className="w-4 h-4 text-[#39B86B]" />}
                  <span>{facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Trust & Verification Certificate */}
          {isVerified && (
            <div className="bg-[#EBF8F0] rounded-3xl p-6 sm:p-7 border border-[#39B86B]/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#2A8C50]" />
                  <h2 className="text-base font-extrabold text-[#2A8C50]">Cryptographic Verification Certificate</h2>
                </div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#39B86B] text-white">
                  Audited
                </span>
              </div>

              <p className="text-xs text-[#2A8C50]/90 leading-relaxed">
                This accommodation has undergone physical on-site inspection. Price transparency, bed capacity, fire safety, and listed amenities are permanently stamped with a SHA-256 cryptographic proof.
              </p>

              {property.verificationHash && (
                <div className="p-3.5 rounded-2xl bg-white/80 border border-[#39B86B]/20 font-mono text-[11px] space-y-1">
                  <div className="text-[10px] font-bold text-[#8A96A3] uppercase">Verification Hash:</div>
                  <div className="text-[#17202A] break-all">{property.verificationHash}</div>
                  {property.blockchainTx && (
                    <div className="text-[10px] text-[#596573] pt-1">
                      Tx Proof: <span className="text-[#17202A]">{property.blockchainTx}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Pricing & Reservation Card */}
        <div className="sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E0D8] shadow-lg space-y-5">
            {/* Price Header */}
            <div className="border-b border-[#E5E0D8] pb-4">
              <div className="text-[11px] font-bold text-[#8A96A3] uppercase tracking-wider">
                Effective Monthly Total
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-[#17202A]">
                  {formatCurrency(effectiveCost)}
                </span>
                <span className="text-xs text-[#596573] font-semibold">/ month</span>
              </div>
              <div className="text-xs text-[#2A8C50] font-bold mt-1">
                ✓ No hidden charges. All utilities itemized.
              </div>
            </div>

            {/* Itemized Cost Breakdown Table */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#596573]">
                <span>Base Room Rent</span>
                <span className="font-bold text-[#17202A]">{formatCurrency(property.rent)}</span>
              </div>
              {property.foodCost > 0 && (
                <div className="flex justify-between text-[#596573]">
                  <span>Daily Meal Plan</span>
                  <span className="font-bold text-[#17202A]">{formatCurrency(property.foodCost)}</span>
                </div>
              )}
              {property.electricityCost > 0 && (
                <div className="flex justify-between text-[#596573]">
                  <span>Electricity & Power Backup</span>
                  <span className="font-bold text-[#17202A]">{formatCurrency(property.electricityCost)}</span>
                </div>
              )}
              {property.wifiCost > 0 && (
                <div className="flex justify-between text-[#596573]">
                  <span>High-Speed Wi-Fi</span>
                  <span className="font-bold text-[#17202A]">{formatCurrency(property.wifiCost)}</span>
                </div>
              )}
              {property.maintenanceCost > 0 && (
                <div className="flex justify-between text-[#596573]">
                  <span>Housekeeping & Maintenance</span>
                  <span className="font-bold text-[#17202A]">{formatCurrency(property.maintenanceCost)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#E5E0D8] flex justify-between font-extrabold text-sm text-[#17202A]">
                <span>All-Inclusive Total</span>
                <span className="text-[#2A8C50]">{formatCurrency(effectiveCost)}/mo</span>
              </div>
              {property.deposit > 0 && (
                <div className="flex justify-between text-[11px] text-[#8A96A3] pt-1">
                  <span>Security Deposit (Refundable)</span>
                  <span className="font-bold text-[#596573]">{formatCurrency(property.deposit)}</span>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setVisitScheduled(true)}
                className="btn-primary w-full py-3 text-xs font-extrabold shadow-md flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{visitScheduled ? "Visit Scheduled ✓" : "Schedule Property Visit"}</span>
              </button>

              <button
                onClick={() => setShowContactModal(true)}
                className="btn-secondary w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Verified Lister</span>
              </button>
            </div>

            <div className="text-[11px] text-center text-[#8A96A3] pt-2">
              Instant booking confirmation • Zero broker commission
            </div>
          </div>
        </div>
      </div>

      {/* Contact Lister Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E5E0D8] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <h3 className="text-lg font-extrabold text-[#17202A]">Lister Contact Details</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-xs font-bold text-[#8A96A3] hover:text-[#17202A]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#F7F5EF] space-y-1">
                <span className="text-[10px] font-bold text-[#8A96A3] uppercase">Property Manager:</span>
                <div className="font-bold text-sm text-[#17202A]">{property.name} Management</div>
                <div className="text-[#596573]">Verified Lister on CampusNest</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EBF8F0] border border-[#39B86B]/30 space-y-1">
                <span className="text-[10px] font-bold text-[#2A8C50] uppercase">Direct Helpline:</span>
                <div className="font-bold text-sm text-[#2A8C50]">+91 98765 43210</div>
                <div className="text-xs text-[#2A8C50]/80">Available 9:00 AM – 8:00 PM IST</div>
              </div>
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="btn-primary w-full py-2.5 text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}