"use client";

import ListerLayout from "@/app/lister/layout";
import { getMyListings, submitForVerification, updateAvailability } from "@/lib/api";
import type { Property } from "@/lib/types";
import { useState } from "react";
import { useEffect } from "react";
import PropertyDetailModal from "@/components/shared/PropertyDetailModal";
import Link from "next/link";

export default function ListerPage() {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyListings().then(setMyProperties).catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load listings"));
  }, []);

  async function changeAvailability(property: Property, delta: number) {
    try {
      const updated = await updateAvailability(property.id, Math.max(0, property.occupied + delta));
      setMyProperties((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update availability");
    }
  }

  async function submit(property: Property) {
    try {
      const updated = await submitForVerification(property.id);
      setMyProperties((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to submit listing");
    }
  }

  return (
    <ListerLayout>
      <div className="space-y-6">
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Properties</h1>
            <p className="text-slate-600">Manage your listings and live availability</p>
          </div>
          <Link href="/lister/add" className="btn-primary">Add Property</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProperties.map((property) => {
            const badge = {
              label: property.available > 0 ? `${property.available} beds left` : "Full",
              color: property.available > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
            };

            return (
              <div
                key={property.id}
                className="glass-card rounded-2xl p-6 cursor-pointer"
                onClick={() => setSelectedProperty(property.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{property.name}</h3>
                    <p className="text-sm text-slate-500">{property.locality}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      ₹{property.rent.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500">per month</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">
                      {property.occupied} / {property.capacity}
                    </div>
                    <div className="text-xs text-slate-500">occupied</div>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${(property.occupied / property.capacity) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${property.verificationStatus === "VERIFIED"
                    ? "bg-emerald-50 text-emerald-700"
                    : property.verificationStatus === "UNDER_REVIEW"
                      ? "bg-yellow-50 text-yellow-700"
                      : property.verificationStatus === "SUBMITTED_FOR_VERIFICATION"
<<<<<<< HEAD
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>
=======
                      ? "bg-blue-50 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                  }`}>
>>>>>>> origin/main
                    {property.verificationStatus.replace("_", " ")}
                  </span>
                  <div className="flex items-center gap-3">
                    <button onClick={(event) => { event.stopPropagation(); void changeAvailability(property, -1); }} className="text-sm font-medium text-slate-600">- bed</button>
                    <button onClick={(event) => { event.stopPropagation(); void changeAvailability(property, 1); }} className="text-sm font-medium text-slate-600">+ bed</button>
                    <Link href={`/lister/${property.id}/edit`} onClick={(event) => event.stopPropagation()} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Edit</Link>
                    {property.verificationStatus === "DRAFT" || property.verificationStatus === "REJECTED" ? (
                      <button onClick={(event) => { event.stopPropagation(); void submit(property); }} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Submit</button>
                    ) : <span className="text-sm font-medium text-indigo-600">Manage</span>}
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
    </ListerLayout>
  );
}
