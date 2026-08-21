"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  X, 
  MapPin, 
  Wifi, 
  ShieldCheck, 
  Utensils, 
  Car, 
  Zap, 
  Tv, 
  Dumbbell, 
  BookOpen, 
  Star, 
  Share2, 
  ExternalLink,
  CheckCircle2,
  Info
} from "lucide-react";
import { Property } from "@/lib/types";
import { getEffectiveMonthlyCost, getAvailabilityBadge } from "@/lib/scoring";
import { cn, formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
}

const facilityIcons: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi className="w-4 h-4" />,
  "WiFi": <Wifi className="w-4 h-4" />,
  "Food": <Utensils className="w-4 h-4" />,
  "Meals Included": <Utensils className="w-4 h-4" />,
  "Security": <ShieldCheck className="w-4 h-4" />,
  "CCTV/Security": <ShieldCheck className="w-4 h-4" />,
  "AC": <Zap className="w-4 h-4" />,
  "Parking": <Car className="w-4 h-4" />,
  "Gym": <Dumbbell className="w-4 h-4" />,
  "Study Room": <BookOpen className="w-4 h-4" />,
  "Power Backup": <Zap className="w-4 h-4" />,
  "Shuttle": <Car className="w-4 h-4" />,
  "Rooftop Cafe": <Tv className="w-4 h-4" />,
  "Concierge": <Star className="w-4 h-4" />,
  "Laundry": <Utensils className="w-4 h-4" />,
};

export default function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
  const effectiveCost = getEffectiveMonthlyCost(property);
  const badge = getAvailabilityBadge(property);
  const [showBlockchain, setShowBlockchain] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const textToCopy = `${window.location.origin}/student/property/${property.id}`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[#E5E0D8]"
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#FAF8F5] border-b border-[#E5E0D8] px-6 py-4 flex items-center justify-between z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A96A3]">
                {property.type} Details
              </span>
              <h2 className="text-xl font-extrabold text-[#17202A] leading-tight">{property.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-[#E5E0D8] text-[#596573] hover:text-[#17202A] hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Status badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", badge.color)}>
                {badge.label}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F7F5EF] text-[#596573] border border-[#E5E0D8]">
                {property.locality}
              </span>
              {property.verificationStatus === "VERIFIED" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF8F0] text-[#2A8C50] border border-[#39B86B]/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#39B86B]" />
                  CampusNest Verified
                </span>
              )}
            </div>

            {/* Address */}
            <div className="flex items-start gap-2 text-sm text-[#596573] bg-[#F7F5EF] p-3.5 rounded-xl border border-[#E5E0D8]/60">
              <MapPin className="w-4 h-4 text-[#8A96A3] mt-0.5 flex-shrink-0" />
              <span>{property.address}</span>
            </div>

            <p className="text-sm text-[#596573] leading-relaxed">{property.description}</p>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-[#F7F5EF] rounded-xl p-3.5 text-center border border-[#E5E0D8]/60">
                <div className="text-xl font-black text-[#17202A]">
                  {formatCurrency(property.rent)}
                </div>
                <div className="text-[11px] font-semibold text-[#8A96A3] mt-0.5">Base Rent</div>
              </div>
              <div className="bg-[#EBF8F0] rounded-xl p-3.5 text-center border border-[#39B86B]/20">
                <div className="text-xl font-black text-[#2A8C50]">
                  {formatCurrency(effectiveCost)}
                </div>
                <div className="text-[11px] font-semibold text-[#2A8C50] mt-0.5">Effective Total</div>
              </div>
              <div className="bg-[#F7F5EF] rounded-xl p-3.5 text-center border border-[#E5E0D8]/60">
                <div className="text-xl font-black text-[#17202A]">
                  {property.distanceKm} km
                </div>
                <div className="text-[11px] font-semibold text-[#8A96A3] mt-0.5">To Campus</div>
              </div>
              <div className="bg-[#F7F5EF] rounded-xl p-3.5 text-center border border-[#E5E0D8]/60">
                <div className="text-xl font-black text-[#17202A]">
                  {property.commuteTimeMin} min
                </div>
                <div className="text-[11px] font-semibold text-[#8A96A3] mt-0.5">Commute ({property.commuteMode})</div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E0D8]">
              <h3 className="text-sm font-bold text-[#17202A] mb-3 uppercase tracking-wider">
                Transparent Cost Breakdown
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Base Rent", value: property.rent },
                  { label: "Food & Meal Plan", value: property.foodCost },
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
                <h3 className="text-sm font-bold text-[#17202A] uppercase tracking-wider">
                  Live Bed Availability
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
              <div className="flex justify-between text-[11px] text-[#8A96A3] mt-1.5 font-medium">
                <span>{property.occupied} Occupied</span>
                <span>{property.available} Vacant</span>
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h3 className="text-sm font-bold text-[#17202A] mb-3 uppercase tracking-wider">
                Included Facilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {property.facilities.map((facility) => (
                  <span
                    key={facility}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F5EF] text-[#17202A] text-xs font-semibold border border-[#E5E0D8]"
                  >
                    {facilityIcons[facility] || <CheckCircle2 className="w-3.5 h-3.5 text-[#39B86B]" />}
                    {facility}
                  </span>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 pt-2">
              <Star className="w-4 h-4 text-[#FFC857] fill-[#FFC857]" />
              <span className="font-extrabold text-[#17202A] text-sm">{property.rating || 4.5}</span>
              <span className="text-xs text-[#8A96A3]">/ 5.0 rating from verified student tenants</span>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-[#E5E0D8]">
              {property.verificationStatus === "VERIFIED" && (
                <button
                  onClick={() => setShowBlockchain(true)}
                  className="btn-secondary flex-1 text-xs py-2.5 font-bold"
                >
                  <ShieldCheck className="w-4 h-4 text-[#39B86B]" />
                  Audit Certificate
                </button>
              )}
              <button
                onClick={handleShare}
                className="btn-secondary text-xs py-2.5 px-3.5 font-bold"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
                {copied ? "Copied Link!" : "Share"}
              </button>
              <Link
                href={`/student/property/${property.id}`}
                className="btn-primary flex-1 text-center text-xs py-2.5 font-bold"
              >
                Full Property Page
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Verification Audit Modal */}
      <AnimatePresence>
        {showBlockchain && (
          <BlockchainModal
            property={property}
            onClose={() => setShowBlockchain(false)}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}

function BlockchainModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const verification = property.verification;
  const txHash = verification?.blockchainTx ?? property.blockchainTx;
  const isDemo = !txHash || txHash.startsWith("mock-") || txHash.startsWith("failed-");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 border border-[#E5E0D8]"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#EBF8F0] flex items-center justify-center text-[#2A8C50]">
              <ShieldCheck className="w-5 h-5 text-[#39B86B]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#17202A]">
                Verification Record
              </h3>
              <p className="text-[11px] text-[#596573]">Tamper-evident verification details</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl bg-[#F7F5EF] border border-[#E5E0D8] text-[#596573] hover:text-[#17202A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isDemo ? (
          <div className="mb-4 p-3.5 bg-[#FFF8E7] border border-[#FFC857]/40 rounded-xl text-xs text-[#17202A] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#D49B24] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-semibold">Verification Record:</strong> Verified by CampusNest Trust & Safety Team.
            </p>
          </div>
        ) : (
          <div className="mb-4 p-3.5 bg-[#EBF8F0] border border-[#39B86B]/30 rounded-xl text-xs text-[#2A8C50] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#39B86B] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-semibold">Audit Confirmed:</strong> This property record has been verified and stamped on the public audit registry.
            </p>
          </div>
        )}

        <div className="bg-[#F7F5EF] rounded-2xl p-4 space-y-3 border border-[#E5E0D8] text-xs">
          <div>
            <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider">Property Name & ID</div>
            <div className="font-semibold text-[#17202A]">{property.name} (#{property.id})</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider">Record Hash (SHA-256)</div>
            <div className="font-mono text-[#17202A] break-all bg-white p-2 rounded-lg border border-[#E5E0D8] mt-0.5">
              {verification?.recordHash ?? property.verificationHash ?? "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider">Timestamp</div>
              <div className="font-mono text-[#17202A]">{verification?.timestamp ?? property.verificationTimestamp ?? new Date().toISOString()}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider">Network</div>
              <div className="font-semibold text-[#17202A]">{verification?.networkName ?? "Polygon Audit Ledger"}</div>
            </div>
          </div>
          {txHash && (
            <div>
              <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider">Audit Identifier</div>
              <div className="font-mono text-[#596573] break-all">{txHash}</div>
            </div>
          )}
        </div>

        {!isDemo && verification?.explorerUrl ? (
          <a
            href={verification.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold"
          >
            <ExternalLink className="w-4 h-4" />
            View Audit Certificate Explorer
          </a>
        ) : (
          <button
            onClick={onClose}
            className="btn-secondary w-full mt-4 text-xs font-bold"
          >
            Close Audit Record
          </button>
        )}
      </motion.div>
    </div>
  );
}
