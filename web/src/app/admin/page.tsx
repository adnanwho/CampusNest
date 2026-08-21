"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Check, 
  X, 
  Eye, 
  Clock, 
  MapPin, 
  CheckCircle2
} from "lucide-react";
import { approveVerification, getPendingVerifications, rejectVerification } from "@/lib/api";
import type { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { getEffectiveMonthlyCost } from "@/lib/scoring";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminVerificationPortal() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPendingVerifications()
      .then((data) => {
        if (isMounted) setProperties(data);
      })
      .catch(() => {
        if (isMounted) setProperties([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const pendingProperties = properties.filter(
    (p) => p.verificationStatus === "UNDER_REVIEW" || p.verificationStatus === "SUBMITTED_FOR_VERIFICATION"
  );
  const verifiedProperties = properties.filter((p) => p.verificationStatus === "VERIFIED");

  const handleApprove = async (propertyId: string) => {
    try {
      await approveVerification(propertyId);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      setSelectedProperty(null);
      setToastMessage("Property approved & cryptographic record stamped!");
      setTimeout(() => setToastMessage(null), 4000);
    } catch {
      // fallback
    }
  };

  const handleReject = async (propertyId: string) => {
    try {
      await rejectVerification(propertyId, "Listing does not satisfy CampusNest student housing standards.");
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      setSelectedProperty(null);
      setToastMessage("Property verification request rejected.");
      setTimeout(() => setToastMessage(null), 4000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#E5E0D8] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF8F0] border border-[#39B86B]/30 text-[#2A8C50] text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Trust & Verification Office
        </div>
        <h1 className="text-3xl font-extrabold text-[#17202A] tracking-tight">
          Admin Verification Queue
        </h1>
        <p className="text-sm text-[#596573] mt-1">
          Review accommodation claims, verify transparent pricing schedules, and stamp audit records.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="campus-card p-5 bg-[#FFF8E7] border border-[#FFC857]/40">
          <div className="text-[11px] font-bold text-[#D49B24] uppercase tracking-wider mb-1">
            Pending In Queue
          </div>
          <div className="text-3xl font-black text-[#17202A]">{pendingProperties.length}</div>
          <div className="text-[11px] text-[#596573] mt-0.5">Awaiting physical / document audit</div>
        </div>

        <div className="campus-card p-5 bg-[#EBF8F0] border border-[#39B86B]/30">
          <div className="text-[11px] font-bold text-[#2A8C50] uppercase tracking-wider mb-1">
            Verified Listings
          </div>
          <div className="text-3xl font-black text-[#2A8C50]">{verifiedProperties.length}</div>
          <div className="text-[11px] text-[#2A8C50]/80 mt-0.5">Active on student discover</div>
        </div>

        <div className="campus-card p-5 bg-white border border-[#E5E0D8] shadow-sm">
          <div className="text-[11px] font-bold text-[#8A96A3] uppercase tracking-wider mb-1">
            Total In System
          </div>
          <div className="text-3xl font-black text-[#17202A]">{properties.length}</div>
          <div className="text-[11px] text-[#596573] mt-0.5">Under management</div>
        </div>
      </div>

      {/* Verification Queue List */}
      <div className="campus-card overflow-hidden bg-white border border-[#E5E0D8] shadow-sm">
        <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#E5E0D8] flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#17202A] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#8A96A3]" />
            Submissions Awaiting Verification ({pendingProperties.length})
          </h2>
        </div>

        <div className="divide-y divide-[#E5E0D8]">
          {loading && (
            <div className="p-12 text-center text-xs font-bold text-[#596573]">
              Loading verification submissions...
            </div>
          )}

          {!loading && pendingProperties.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF8F0] flex items-center justify-center text-[#2A8C50] mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-[#39B86B]" />
              </div>
              <h3 className="text-base font-bold text-[#17202A]">Queue is completely clear</h3>
              <p className="text-xs text-[#596573] mt-1">
                No pending property listings require administrator review right now.
              </p>
            </div>
          )}

          {!loading &&
            pendingProperties.map((property) => {
              const effectiveCost = getEffectiveMonthlyCost(property);

              return (
                <div
                  key={property.id}
                  className="p-6 hover:bg-[#F7F5EF]/40 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#17202A] text-white">
                        #{property.id}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#E5E0D8] text-[#596573]">
                        {property.type}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF8E7] text-[#D49B24] border border-[#FFC857]/40">
                        {property.verificationStatus.replace(/_/g, " ")}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#17202A] leading-snug">{property.name}</h3>

                    <div className="flex items-center gap-1 text-xs text-[#596573]">
                      <MapPin className="w-3.5 h-3.5 text-[#8A96A3]" />
                      <span>{property.address}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                      <span className="font-bold text-[#17202A]">
                        Base: {formatCurrency(property.rent)}
                      </span>
                      <span className="font-extrabold text-[#2A8C50]">
                        Effective: {formatCurrency(effectiveCost)}/mo
                      </span>
                      <span className="text-[#596573]">
                        Capacity: {property.capacity} beds ({property.occupied} filled)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#E5E0D8]">
                    <button
                      onClick={() => setSelectedProperty(property)}
                      className="btn-secondary text-xs py-2 px-3.5 font-bold flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect & Audit
                    </button>
                    <button
                      onClick={() => handleApprove(property.id)}
                      className="btn-primary text-xs py-2 px-3.5 font-bold flex items-center gap-1.5"
                      title="Approve verification"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(property.id)}
                      className="text-xs font-bold text-[#E63946] hover:bg-red-50 p-2 rounded-xl border border-red-200 transition-colors"
                      title="Reject listing"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Inspect / Review Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-[#E5E0D8] space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider">
                    Listing Audit Inspector
                  </span>
                  <h3 className="text-xl font-extrabold text-[#17202A]">{selectedProperty.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-1.5 rounded-xl bg-[#F7F5EF] border border-[#E5E0D8] text-[#596573] hover:text-[#17202A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Inspector Content */}
              <div className="space-y-4 text-xs">
                <div className="bg-[#F7F5EF] p-4 rounded-2xl border border-[#E5E0D8] space-y-2">
                  <div>
                    <span className="font-bold text-[#596573]">Locality & Address:</span>
                    <p className="text-[#17202A] font-semibold mt-0.5">{selectedProperty.address} ({selectedProperty.locality})</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#596573]">Description:</span>
                    <p className="text-[#596573] mt-0.5">{selectedProperty.description || "No custom description provided."}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-[#E5E0D8] text-center">
                    <div className="font-bold text-[#8A96A3] text-[10px] uppercase">Base Rent</div>
                    <div className="font-extrabold text-sm text-[#17202A] mt-0.5">{formatCurrency(selectedProperty.rent)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#EBF8F0] border border-[#39B86B]/30 text-center">
                    <div className="font-bold text-[#2A8C50] text-[10px] uppercase">Effective Total</div>
                    <div className="font-extrabold text-sm text-[#2A8C50] mt-0.5">{formatCurrency(getEffectiveMonthlyCost(selectedProperty))}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E5E0D8] text-center">
                    <div className="font-bold text-[#8A96A3] text-[10px] uppercase">Capacity</div>
                    <div className="font-extrabold text-sm text-[#17202A] mt-0.5">{selectedProperty.capacity} Beds</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E5E0D8] text-center">
                    <div className="font-bold text-[#8A96A3] text-[10px] uppercase">Deposit</div>
                    <div className="font-extrabold text-sm text-[#17202A] mt-0.5">{formatCurrency(selectedProperty.deposit)}</div>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-[#596573] block mb-2">Claimed Facilities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProperty.facilities.map((fac) => (
                      <span key={fac} className="px-2.5 py-1 rounded-lg bg-[#F7F5EF] text-[#17202A] font-semibold border border-[#E5E0D8]">
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#E5E0D8]">
                <button
                  onClick={() => handleApprove(selectedProperty.id)}
                  className="btn-primary flex-1 text-xs py-3 font-bold flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Approve & Issue Certificate
                </button>
                <button
                  onClick={() => handleReject(selectedProperty.id)}
                  className="btn-secondary flex-1 text-xs py-3 font-bold text-[#E63946] flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  Reject Submission
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Success Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-[#17202A] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 z-50 text-xs font-bold border border-[#39B86B]/40"
          >
            <CheckCircle2 className="w-4 h-4 text-[#39B86B]" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
