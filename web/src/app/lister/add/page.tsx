"use client";

import ListerLayout from "@/app/lister/layout";
import { createListing, submitForVerification } from "@/lib/api";
import { useState } from "react";

const initialForm = {
  name: "", type: "PG", locality: "", address: "", description: "", rent: "", deposit: "",
  foodCost: "", electricityCost: "", wifiCost: "", maintenanceCost: "", capacity: "", occupied: "0",
  distanceKm: "", commuteTimeMin: "", commuteMode: "Walk", latitude: "", longitude: "", facilities: [] as string[],
};

export default function AddPropertyPage() {
  const [form, setForm] = useState(initialForm);
  const [submitMode, setSubmitMode] = useState<"draft" | "verify">("draft");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleFacility(facility: string) {
    setForm((current) => ({
      ...current,
      facilities: current.facilities.includes(facility)
        ? current.facilities.filter((item) => item !== facility)
        : [...current.facilities, facility],
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const listing = await createListing({
        ...form,
        rent: Number(form.rent), deposit: Number(form.deposit), foodCost: Number(form.foodCost),
        electricityCost: Number(form.electricityCost), wifiCost: Number(form.wifiCost), maintenanceCost: Number(form.maintenanceCost),
        capacity: Number(form.capacity), occupied: Number(form.occupied), distanceKm: Number(form.distanceKm),
        commuteTimeMin: Number(form.commuteTimeMin), latitude: Number(form.latitude), longitude: Number(form.longitude),
      });
      if (submitMode === "verify") await submitForVerification(listing.id);
      setMessage(submitMode === "verify" ? "Listing submitted for verification." : "Listing saved as draft.");
      setForm(initialForm);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save listing");
    }
  }
  return (
    <ListerLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Add New Property</h1>
        <p className="text-slate-600 mb-8">Create a new listing with all cost details and facilities</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Property Name</label>
                  <input required value={form.name} onChange={(event) => updateField("name", event.target.value)} type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="e.g., Sunshine Student PG" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select value={form.type} onChange={(event) => updateField("type", event.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none">
                    <option value="PG">PG</option>
                    <option value="HOSTEL">Hostel</option>
                    <option value="FLAT">Flat</option>
                    <option value="SHARED_ACCOMMODATION">Shared Flat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Locality</label>
                  <input required value={form.locality} onChange={(event) => updateField("locality", event.target.value)} type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="e.g., Knowledge Park III" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input required value={form.address} onChange={(event) => updateField("address", event.target.value)} type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="Full address" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Pricing & Costs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Base Rent (₹/month)</label>
                  <input required value={form.rent} onChange={(event) => updateField("rent", event.target.value)} type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner" placeholder="8500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Deposit (₹)</label>
                  <input value={form.deposit} onChange={(event) => updateField("deposit", event.target.value)} type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner" placeholder="17000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Food Cost (₹/month)</label>
                  <input value={form.foodCost} onChange={(event) => updateField("foodCost", event.target.value)} type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner" placeholder="3000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Electricity (₹/month)</label>
                  <input value={form.electricityCost} onChange={(event) => updateField("electricityCost", event.target.value)} type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner" placeholder="500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">WiFi (₹/month)</label>
                  <input value={form.wifiCost} onChange={(event) => updateField("wifiCost", event.target.value)} type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner" placeholder="500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Maintenance (₹/month)</label>
                  <input value={form.maintenanceCost} onChange={(event) => updateField("maintenanceCost", event.target.value)} type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner" placeholder="500" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Capacity & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Capacity</label>
                  <input required value={form.capacity} onChange={(event) => updateField("capacity", event.target.value)} type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner" placeholder="20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Distance from Campus (km)</label>
                  <input value={form.distanceKm} onChange={(event) => updateField("distanceKm", event.target.value)} type="number" step="0.1" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner" placeholder="1.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Commute Time (min)</label>
                  <input value={form.commuteTimeMin} onChange={(event) => updateField("commuteTimeMin", event.target.value)} type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner" placeholder="10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Commute Mode</label>
                  <select value={form.commuteMode} onChange={(event) => updateField("commuteMode", event.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none">
                    <option>Walk</option>
                    <option>Auto</option>
                    <option>Bus</option>
                    <option>Metro</option>
                    <option>Shuttle</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {["Wi-Fi", "Food", "Security", "AC", "Parking", "Gym", "Study Room", "Power Backup", "Laundry", "Shuttle", "Rooftop Cafe", "Concierge"].map((facility) => (
                  <label key={facility} className="cursor-pointer">
                    <input type="checkbox" checked={form.facilities.includes(facility)} onChange={() => toggleFacility(facility)} className="peer sr-only" />
                    <span className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-checked:border-indigo-200 transition-colors">
                      {facility}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
          <div className="flex gap-4">
            <button type="submit" onClick={() => setSubmitMode("draft")} className="btn-primary flex-1">
              Save as Draft
            </button>
            <button type="submit" onClick={() => setSubmitMode("verify")} className="btn-secondary flex-1">
              Submit for Verification
            </button>
          </div>
        </form>
      </div>
    </ListerLayout>
  );
}
