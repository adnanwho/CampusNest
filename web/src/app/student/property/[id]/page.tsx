"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import StudentLayout from "@/app/student/layout";
import { getProperty } from "@/lib/api";
import type { Property } from "@/lib/types";
import { getAvailabilityBadge } from "@/lib/scoring";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Star, ShieldCheck, ExternalLink } from "lucide-react";

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProperty(id)
      .then(setProperty)
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load property"));
  }, [id]);

  if (error) {
    return (
      <StudentLayout>
        <div className="max-w-4xl mx-auto text-center py-16">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/student" className="btn-primary">Back to Discover</Link>
        </div>
      </StudentLayout>
    );
  }

  if (!property) {
    return (
      <StudentLayout>
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading property...</p>
        </div>
      </StudentLayout>
    );
  }

  const badge = getAvailabilityBadge(property);
  const score = property.matchScore ?? 0;

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${property.verificationStatus === "VERIFIED"
                    ? "bg-emerald-50 text-emerald-700"
                    : property.verificationStatus === "UNDER_REVIEW"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-slate-100 text-slate-600"
                    }`}>
                    {property.verificationStatus.replace("_", " ")}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 capitalize">
                    {property.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{property.name}</h1>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{property.address}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-600">{score}%</div>
                <div className="text-sm text-slate-500">match score</div>
              </div>
            </div>

            <p className="text-slate-700 mb-6">{property.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">₹{property.rent.toLocaleString()}</div>
                <div className="text-xs text-slate-500 mt-1">Base Rent</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">
                  ₹{property.effectiveMonthlyCost.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-1">Effective Cost</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{property.distanceKm}km</div>
                <div className="text-xs text-slate-500 mt-1">From Campus</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{property.commuteTimeMin}min</div>
                <div className="text-xs text-slate-500 mt-1">Commute</div>
              </div>
            </div>

            {property.aiExplanation && (
              <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <div className="text-sm font-semibold text-indigo-800 mb-1">Why this match?</div>
                <p className="text-sm text-indigo-700">{property.aiExplanation}</p>
              </div>
            )}

            <div className="mb-6">
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
                  <span className="text-indigo-600">{formatCurrency(property.effectiveMonthlyCost)}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
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

            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {property.facilities.map((facility) => (
                  <span key={facility} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium">
                    {facility}
                  </span>
                ))}
              </div>
            </div>

            {property.verification && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold text-emerald-800">Blockchain Verification Record</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-emerald-700 font-medium">Network: </span>
                    <span className="text-emerald-800">{property.verification.networkName}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-medium">Record Hash: </span>
                    <span className="text-emerald-800 font-mono break-all">{property.verification.recordHash}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-medium">Timestamp: </span>
                    <span className="text-emerald-800">{new Date(property.verification.timestamp).toLocaleString()}</span>
                  </div>
                  {property.verification.explorerUrl && (
                    <a
                      href={property.verification.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 font-medium hover:underline"
                    >
                      View on Explorer
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {property.reviews && property.reviews.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Reviews</h3>
                <div className="space-y-3">
                  {property.reviews.map((review) => (
                    <div key={review.id} className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-slate-900">{review.rating}</span>
                        <span className="text-slate-500 text-sm">/ 5.0</span>
                      </div>
                      <p className="text-sm text-slate-700">{review.reviewText}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-bold text-slate-900">{property.rating}</span>
                <span className="text-slate-500">/ 5.0</span>
              </div>
              <div className="flex gap-3">
                <Link href="/student" className="btn-secondary">Back to Discover</Link>
                <Link href={`/student/compare?add=${property.id}`} className="btn-primary">Compare</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}