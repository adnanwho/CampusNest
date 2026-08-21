"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Save, CheckCircle2, Trash2 } from "lucide-react";
import { getProperty, updateListing } from "@/lib/api";
import type { Property } from "@/lib/types";

const initialForm = {
  name: "",
  type: "PG",
  locality: "",
  address: "",
  description: "",
  rent: "",
  deposit: "",
  foodCost: "",
  electricityCost: "",
  wifiCost: "",
  maintenanceCost: "",
  capacity: "",
  occupied: "0",
  distanceKm: "",
  commuteTimeMin: "",
  commuteMode: "Walk",
  latitude: "",
  longitude: "",
  facilities: [] as string[],
};

const facilityOptions = [
  "Wi-Fi",
  "Meals Included",
  "AC",
  "Security",
  "Power Backup",
  "Study Room",
  "Gym",
  "Parking",
  "Laundry",
  "Shuttle",
  "Rooftop Cafe",
  "Concierge",
];

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProperty(id)
      .then((data) => {
        setProperty(data);
        setForm({
          name: data.name ?? "",
          type: data.type ?? "PG",
          locality: data.locality ?? "",
          address: data.address ?? "",
          description: data.description ?? "",
          rent: data.rent != null ? String(data.rent) : "",
          deposit: data.deposit != null ? String(data.deposit) : "",
          foodCost: data.foodCost != null ? String(data.foodCost) : "",
          electricityCost: data.electricityCost != null ? String(data.electricityCost) : "",
          wifiCost: data.wifiCost != null ? String(data.wifiCost) : "",
          maintenanceCost: data.maintenanceCost != null ? String(data.maintenanceCost) : "",
          capacity: data.capacity != null ? String(data.capacity) : "",
          occupied: data.occupied != null ? String(data.occupied) : "0",
          distanceKm: data.distanceKm != null ? String(data.distanceKm) : "",
          commuteTimeMin: data.commuteTimeMin != null ? String(data.commuteTimeMin) : "",
          commuteMode: data.commuteMode ?? "Walk",
          latitude: data.latitude != null ? String(data.latitude) : "",
          longitude: data.longitude != null ? String(data.longitude) : "",
          facilities: data.facilities ?? [],
        });
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load property"));
  }, [id]);

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

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      const updated = await updateListing(id, {
        ...form,
        rent: Number(form.rent),
        deposit: Number(form.deposit || 0),
        foodCost: Number(form.foodCost || 0),
        electricityCost: Number(form.electricityCost || 0),
        wifiCost: Number(form.wifiCost || 0),
        maintenanceCost: Number(form.maintenanceCost || 0),
        capacity: Number(form.capacity),
        occupied: Number(form.occupied || 0),
        distanceKm: Number(form.distanceKm || 1.0),
        commuteTimeMin: Number(form.commuteTimeMin || 10),
        latitude: Number(form.latitude || 28.4744),
        longitude: Number(form.longitude || 77.504),
      });
      setProperty(updated);
      setMessage("Property details updated successfully!");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update property");
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <p className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</p>
        <Link href="/lister" className="btn-primary text-xs inline-block">Back to My Properties</Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <div className="w-10 h-10 border-3 border-[#39B86B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-[#596573]">Loading property details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] border border-[#FFC857]/40 text-[#D49B24] text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Edit Listing #{property.id}
          </div>
          <h1 className="text-3xl font-extrabold text-[#17202A] tracking-tight">{property.name}</h1>
          <p className="text-sm text-[#596573] mt-1">
            Update pricing breakdown, occupancy counts, or property facilities
          </p>
        </div>
        <Link href="/lister" className="btn-secondary text-xs py-2 px-3.5 font-bold flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
      </div>

      {message && (
        <div className="rounded-2xl bg-[#EBF8F0] border border-[#39B86B]/30 p-4 text-xs font-bold text-[#2A8C50] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#39B86B]" />
          {message}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSave}>
        {/* Section 1: Basic Information */}
        <div className="campus-card p-6 bg-white border border-[#E5E0D8] shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#596573] uppercase tracking-wider">
            1. Property Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Property Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                type="text"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Accommodation Type
              </label>
              <select
                value={form.type}
                onChange={(e) => updateField("type", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none"
              >
                <option value="PG">PG (Paying Guest)</option>
                <option value="HOSTEL">Student Hostel</option>
                <option value="FLAT">Independent Flat</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Locality / Area
              </label>
              <input
                required
                value={form.locality}
                onChange={(e) => updateField("locality", e.target.value)}
                type="text"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Full Physical Address
              </label>
              <input
                required
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                type="text"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing */}
        <div className="campus-card p-6 bg-white border border-[#E5E0D8] shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#596573] uppercase tracking-wider">
            2. Cost Structure
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Base Rent (₹/mo)
              </label>
              <input
                required
                value={form.rent}
                onChange={(e) => updateField("rent", e.target.value)}
                type="number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none no-spinner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Deposit (₹)
              </label>
              <input
                value={form.deposit}
                onChange={(e) => updateField("deposit", e.target.value)}
                type="number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none no-spinner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Food Cost (₹/mo)
              </label>
              <input
                value={form.foodCost}
                onChange={(e) => updateField("foodCost", e.target.value)}
                type="number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none no-spinner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Electricity (₹/mo)
              </label>
              <input
                value={form.electricityCost}
                onChange={(e) => updateField("electricityCost", e.target.value)}
                type="number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none no-spinner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Wi-Fi Cost (₹/mo)
              </label>
              <input
                value={form.wifiCost}
                onChange={(e) => updateField("wifiCost", e.target.value)}
                type="number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none no-spinner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Maintenance (₹/mo)
              </label>
              <input
                value={form.maintenanceCost}
                onChange={(e) => updateField("maintenanceCost", e.target.value)}
                type="number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none no-spinner"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Capacity & Commute */}
        <div className="campus-card p-6 bg-white border border-[#E5E0D8] shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#596573] uppercase tracking-wider">
            3. Capacity & Commute
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Total Capacity (Beds)
              </label>
              <input
                required
                value={form.capacity}
                onChange={(e) => updateField("capacity", e.target.value)}
                type="number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none no-spinner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Occupied Beds
              </label>
              <input
                required
                value={form.occupied}
                onChange={(e) => updateField("occupied", e.target.value)}
                type="number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none no-spinner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Distance (km)
              </label>
              <input
                value={form.distanceKm}
                onChange={(e) => updateField("distanceKm", e.target.value)}
                type="number"
                step="0.1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none no-spinner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Commute Time (min)
              </label>
              <input
                value={form.commuteTimeMin}
                onChange={(e) => updateField("commuteTimeMin", e.target.value)}
                type="number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none no-spinner"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Facilities */}
        <div className="campus-card p-6 bg-white border border-[#E5E0D8] shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-[#596573] uppercase tracking-wider">
            4. Included Facilities
          </h3>
          <div className="flex flex-wrap gap-2">
            {facilityOptions.map((facility) => {
              const active = form.facilities.includes(facility);
              return (
                <button
                  key={facility}
                  type="button"
                  onClick={() => toggleFacility(facility)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    active
                      ? "bg-[#39B86B] text-white border-[#39B86B]"
                      : "bg-[#F7F5EF] text-[#596573] border-[#E5E0D8] hover:border-[#8A96A3]"
                  }`}
                >
                  {facility}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex-1 text-xs py-3 font-bold flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : "Save Property Changes"}
          </button>
          <Link
            href="/lister"
            className="btn-secondary flex-1 text-xs py-3 font-bold text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
