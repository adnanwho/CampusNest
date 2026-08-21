"use client";

import { useEffect, useState } from "react";
import { Check, X, Shield } from "lucide-react";
import { approveVerification, getPendingVerifications, rejectVerification } from "@/lib/api";
import type { Property } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getPendingVerifications().then(setProperties).catch(() => setProperties([]));
  }, []);

  const pendingProperties = properties.filter(
    (p) => p.verificationStatus === "UNDER_REVIEW" || p.verificationStatus === "SUBMITTED_FOR_VERIFICATION"
  );

  const handleApprove = async (propertyId: string) => {
    await approveVerification(propertyId);
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReject = async (propertyId: string) => {
    await rejectVerification(propertyId, "Does not meet verification criteria.");
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Verification Portal</h1>
        <p className="text-slate-600">Review and approve property verification requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-6">
          <div className="text-3xl font-bold text-slate-900">{pendingProperties.length}</div>
          <div className="text-sm text-slate-500 mt-1">Pending Reviews</div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="text-3xl font-bold text-emerald-600">
            {properties.filter((p) => p.verificationStatus === "VERIFIED").length}
          </div>
          <div className="text-sm text-slate-500 mt-1">Verified Properties</div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="text-3xl font-bold text-slate-900">{properties.length}</div>
          <div className="text-sm text-slate-500 mt-1">Total Properties</div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Verification Queue</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {pendingProperties.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No pending verification requests</p>
            </div>
          ) : (
            pendingProperties.map((property) => (
              <div key={property.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-slate-900">{property.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${property.verificationStatus === "VERIFIED"
                        ? "bg-emerald-50 text-emerald-700"
                        : property.verificationStatus === "UNDER_REVIEW"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-blue-50 text-blue-700"
                        }`}>
                        {property.verificationStatus.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{property.address}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                      <span>₹{property.rent.toLocaleString()}/mo</span>
                      <span>{property.type}</span>
                      <span>{property.locality}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => void handleApprove(property.id)}
                      className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      title="Approve"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => void handleReject(property.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Reject"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50"
            >
              <Check className="w-5 h-5" />
              Property verified successfully!
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
