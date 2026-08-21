"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Plus, 
  BedDouble, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  MapPin, 
  IndianRupee, 
  Edit3, 
  Send,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getMyListings, submitForVerification, updateAvailability } from "@/lib/api";
import type { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import PropertyDetailModal from "@/components/shared/PropertyDetailModal";

export default function ListerDashboardPage() {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    setLoading(true);
    try {
      const data = await getMyListings();
      setMyProperties(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load listings");
    } finally {
      setLoading(false);
    }
  }

  async function changeAvailability(property: Property, delta: number) {
    try {
      const newOccupied = Math.max(0, Math.min(property.capacity, property.occupied + delta));
      const updated = await updateAvailability(property.id, newOccupied);
      setMyProperties((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setActionSuccess(`Updated occupancy for ${property.name} (${updated.occupied}/${updated.capacity} occupied)`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update availability");
    }
  }

  async function submit(property: Property) {
    try {
      const updated = await submitForVerification(property.id);
      setMyProperties((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setActionSuccess(`Submitted "${property.name}" to Admin Verification Queue!`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to submit listing");
    }
  }

  // Aggregate portfolio stats
  const totalCapacity = myProperties.reduce((acc, p) => acc + (p.capacity || 0), 0);
  const totalOccupied = myProperties.reduce((acc, p) => acc + (p.occupied || 0), 0);
  const totalAvailable = totalCapacity - totalOccupied;
  const verifiedCount = myProperties.filter((p) => p.verificationStatus === "VERIFIED").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-[#E5E0D8] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] border border-[#FFC857]/40 text-[#D49B24] text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Lister & Property Manager Portal
          </div>
          <h1 className="text-3xl font-extrabold text-[#17202A] tracking-tight">
            My Properties & Occupancy
          </h1>
          <p className="text-sm text-[#596573] mt-1">
            Manage your student housing portfolio, update live vacancy counts, and submit listings for verification.
          </p>
        </div>
        <Link href="/lister/add" className="btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          Add New Listing
        </Link>
      </div>

      {/* Action success alert */}
      {actionSuccess && (
        <div className="rounded-2xl bg-[#EBF8F0] border border-[#39B86B]/30 p-4 text-xs font-bold text-[#2A8C50] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#39B86B]" />
          {actionSuccess}
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="campus-card p-5 bg-white border border-[#E5E0D8] shadow-sm">
          <div className="text-[11px] font-bold text-[#8A96A3] uppercase tracking-wider mb-1">
            Active Properties
          </div>
          <div className="text-2xl font-black text-[#17202A]">{myProperties.length}</div>
          <div className="text-[11px] text-[#596573] mt-0.5">{verifiedCount} verified</div>
        </div>

        <div className="campus-card p-5 bg-white border border-[#E5E0D8] shadow-sm">
          <div className="text-[11px] font-bold text-[#8A96A3] uppercase tracking-wider mb-1">
            Total Beds
          </div>
          <div className="text-2xl font-black text-[#17202A]">{totalCapacity}</div>
          <div className="text-[11px] text-[#596573] mt-0.5">Across listings</div>
        </div>

        <div className="campus-card p-5 bg-[#EBF8F0] border border-[#39B86B]/30">
          <div className="text-[11px] font-bold text-[#2A8C50] uppercase tracking-wider mb-1">
            Available Beds
          </div>
          <div className="text-2xl font-black text-[#2A8C50]">{totalAvailable}</div>
          <div className="text-[11px] text-[#2A8C50]/80 mt-0.5">Open for booking</div>
        </div>

        <div className="campus-card p-5 bg-[#FFF8E7] border border-[#FFC857]/40">
          <div className="text-[11px] font-bold text-[#D49B24] uppercase tracking-wider mb-1">
            Live Occupancy
          </div>
          <div className="text-2xl font-black text-[#17202A]">
            {totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0}%
          </div>
          <div className="text-[11px] text-[#596573] mt-0.5">{totalOccupied} beds filled</div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myProperties.map((property) => {
          const occupancyRate = (property.occupied / Math.max(1, property.capacity)) * 100;
          const isVerified = property.verificationStatus === "VERIFIED";
          const isUnderReview = property.verificationStatus === "UNDER_REVIEW" || property.verificationStatus === "SUBMITTED_FOR_VERIFICATION";
          const isDraft = property.verificationStatus === "DRAFT" || property.verificationStatus === "REJECTED";

          return (
            <div
              key={property.id}
              className="campus-card overflow-hidden bg-white border border-[#E5E0D8] shadow-sm flex flex-col justify-between"
            >
              {/* Top info */}
              <div className="p-5 pb-4 bg-[#FAF8F5] border-b border-[#E5E0D8]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-[#E5E0D8] text-[#596573]">
                    {property.type}
                  </span>

                  {isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF8F0] text-[#2A8C50] border border-[#39B86B]/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                  {isUnderReview && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFF8E7] text-[#D49B24] border border-[#FFC857]/40">
                      <Clock className="w-3.5 h-3.5" />
                      In Review
                    </span>
                  )}
                  {isDraft && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-[#596573] border border-slate-300">
                      Draft
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-[#17202A] text-lg leading-snug line-clamp-1">
                  {property.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-[#596573] mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8A96A3]" />
                  <span>{property.locality}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                {/* Rent & Occupancy Meter */}
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider">Base Monthly Rent</div>
                      <div className="text-xl font-black text-[#17202A]">
                        {formatCurrency(property.rent)}
                        <span className="text-xs font-normal text-[#8A96A3]">/mo</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider">Live Vacancy</div>
                      <div className="text-sm font-extrabold text-[#2A8C50]">
                        {property.available} beds left
                      </div>
                    </div>
                  </div>

                  {/* Occupancy bar */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#596573] mb-1">
                      <span>Occupancy: {property.occupied} / {property.capacity} beds</span>
                      <span>{Math.round(occupancyRate)}%</span>
                    </div>
                    <div className="w-full bg-[#E5E0D8] rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#39B86B] h-full rounded-full transition-all duration-300"
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Live +/- Bed Adjuster Bar */}
                <div className="bg-[#F7F5EF] p-3 rounded-2xl border border-[#E5E0D8] flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#17202A]">Quick Occupancy:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => changeAvailability(property, -1)}
                      disabled={property.occupied <= 0}
                      className="px-2.5 py-1 rounded-xl bg-white border border-[#E5E0D8] text-xs font-extrabold text-[#17202A] hover:bg-slate-50 disabled:opacity-40 transition-colors"
                      title="Mark 1 bed as vacated (-1 occupied)"
                    >
                      -1 Bed
                    </button>
                    <span className="text-xs font-black text-[#17202A] px-1">
                      {property.occupied}
                    </span>
                    <button
                      onClick={() => changeAvailability(property, 1)}
                      disabled={property.occupied >= property.capacity}
                      className="px-2.5 py-1 rounded-xl bg-white border border-[#E5E0D8] text-xs font-extrabold text-[#17202A] hover:bg-slate-50 disabled:opacity-40 transition-colors"
                      title="Mark 1 bed as occupied (+1 occupied)"
                    >
                      +1 Bed
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedProperty(property.id)}
                    className="text-xs font-bold text-[#596573] hover:text-[#17202A]"
                  >
                    View Details
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/lister/${property.id}/edit`}
                      className="btn-secondary text-xs py-1.5 px-3 font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </Link>

                    {isDraft && (
                      <button
                        onClick={() => submit(property)}
                        className="btn-primary text-xs py-1.5 px-3 font-bold flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProperty && (
        <PropertyDetailModal
          property={myProperties.find((p) => p.id === selectedProperty)!}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}
