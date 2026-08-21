"use client";

import { useState } from "react";
import Link from "next/link";
import { X, MapPin, IndianRupee, Wifi, Shield, Utensils, Car, Zap, Tv, Dumbbell, BookOpen, Star, Share2, ShieldCheck, ExternalLink } from "lucide-react";
import { Property } from "@/lib/types";
import { getEffectiveMonthlyCost, getAvailabilityBadge } from "@/lib/scoring";
import { cn, formatCurrency, generateSHA256 } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
}

const facilityIcons: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi className="w-4 h-4" />,
  "Food": <Utensils className="w-4 h-4" />,
  "Security": <Shield className="w-4 h-4" />,
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
    const demoHash = await generateSHA256(
      `${property.id}-${property.name}-${property.address}-${property.capacity}-demo-hash`
    );
    await navigator.clipboard.writeText(demoHash);
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
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{property.name}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={cn("px-3 py-1 rounded-full text-sm font-medium", badge.color)}>
                {badge.label}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 capitalize">
                {property.type}
              </span>
              {property.verificationStatus === "VERIFIED" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse-glow">
                  <ShieldCheck className="w-4 h-4" />
                  Blockchain Verified
                </span>
              )}
            </div>

            <div className="flex items-start gap-2 text-slate-600">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{property.address}</span>
            </div>

            <p className="text-slate-700">{property.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">
                  <IndianRupee className="w-5 h-5 inline" />
                  {formatCurrency(property.rent)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Base Rent</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">
                  <IndianRupee className="w-5 h-5 inline" />
                  {formatCurrency(effectiveCost)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Effective Monthly</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {property.distanceKm}km
                </div>
                <div className="text-xs text-slate-500 mt-1">From Campus</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {property.commuteTimeMin}min
                </div>
                <div className="text-xs text-slate-500 mt-1">Commute</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Cost Breakdown</h3>
              <div className="space-y-2">
                {[
                  { label: "Rent", value: property.rent },
                  { label: "Food", value: property.foodCost },
                  { label: "Electricity", value: property.electricityCost },
                  { label: "WiFi", value: property.wifiCost },
                  { label: "Maintenance", value: property.maintenanceCost },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-medium text-slate-900">{formatCurrency(item.value)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-2 mt-2">
                  <span className="text-slate-900">Total Effective</span>
                  <span className="text-indigo-600">{formatCurrency(effectiveCost)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Availability</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(property.occupied / property.capacity) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {property.available} / {property.capacity} beds available
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {property.facilities.map((facility) => (
                  <span
                    key={facility}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium"
                  >
                    {facilityIcons[facility]}
                    {facility}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-900">{property.rating}</span>
              <span className="text-slate-500">/ 5.0 rating</span>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              {property.verificationStatus === "VERIFIED" && (
                <button
                  onClick={() => setShowBlockchain(true)}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  View Blockchain Record
                </button>
              )}
              <button
                onClick={handleShare}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                {copied ? "Copied!" : "Copy Demo Hash"}
              </button>
              <Link
                href={`/student/compare?add=${property.id}`}
                className="btn-primary flex-1 text-center"
              >
                Add to Compare
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

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
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop:blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              {isDemo ? "Demo Verification Record" : "Blockchain Verification Record"}
            </h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {isDemo && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              Blockchain is currently in demo mode. The hash below is a local verification signature, not a real on-chain transaction.
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Property ID</div>
                <div className="text-sm font-mono text-slate-900">{property.id}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Record Hash (SHA-256)</div>
                <div className="text-sm font-mono text-slate-900 break-all">{verification?.recordHash ?? property.verificationHash}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</div>
                <div className="text-sm font-mono text-slate-900">{verification?.timestamp ?? property.verificationTimestamp}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Transaction Hash</div>
                <div className="text-sm font-mono text-slate-900 break-all">{txHash ?? "Not available"}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Network</div>
                <div className="text-sm font-medium text-slate-900">{verification?.networkName ?? "Polygon Amoy"}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Contract Address</div>
                <div className="text-sm font-mono text-slate-900 break-all">{verification?.contractAddress ?? "Not available"}</div>
              </div>
            </div>

            {!isDemo && verification?.explorerUrl && (
              <a
                href={verification.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
