"use client";

import { useEffect, useState } from "react";
import { User, Sparkles, Check, Edit3, Save, X, Building2, MapPin, Calendar, Wallet } from "lucide-react";
import { getStudentProfile, updateStudentProfile } from "@/lib/api";
import type { StudentProfile, PropertyType } from "@/lib/types";

const availableLifestyleOptions = [
  "Wi-Fi",
  "Meals Included",
  "AC",
  "Security",
  "Quiet Study",
  "Attached Washroom",
  "Gym",
  "Power Backup",
  "Laundry",
  "Parking",
];

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    college: "",
    budgetMin: "",
    budgetMax: "",
    moveInDate: "",
    localityPref: "",
    accommodationType: "",
    lifestyleTags: [] as string[],
  });

  useEffect(() => {
    getStudentProfile()
      .then((data) => {
        setProfile(data);
        const tags = Array.isArray(data.lifestyleTags)
          ? data.lifestyleTags
          : data.lifestyleTags
            ? (data.lifestyleTags as string).split(",").map((t) => t.trim())
            : [];
        setForm({
          college: data.college ?? "",
          budgetMin: data.budgetMin != null ? String(data.budgetMin) : "",
          budgetMax: data.budgetMax != null ? String(data.budgetMax) : "",
          moveInDate: data.moveInDate ?? "",
          localityPref: data.localityPref ?? "",
          accommodationType: data.accommodationType ?? "",
          lifestyleTags: tags,
        });
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load profile"));
  }, []);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleTag(tag: string) {
    setForm((current) => ({
      ...current,
      lifestyleTags: current.lifestyleTags.includes(tag)
        ? current.lifestyleTags.filter((t) => t !== tag)
        : [...current.lifestyleTags, tag],
    }));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      const updated = await updateStudentProfile({
        college: form.college,
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        moveInDate: form.moveInDate || undefined,
        localityPref: form.localityPref || undefined,
        accommodationType: (form.accommodationType as PropertyType) || undefined,
        lifestyleTags: form.lifestyleTags,
      });
      setProfile(updated);
      setEditing(false);
      setMessage("Preferences saved! Your recommendations have been recalculated.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-10 h-10 border-3 border-[#39B86B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-[#596573]">Loading your profile...</p>
      </div>
    );
  }

  const initials = profile.name ? profile.name.split(" ").map((n) => n[0]).join("") : "S";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF8F0] border border-[#39B86B]/30 text-[#2A8C50] text-xs font-bold uppercase tracking-wider mb-2">
            <User className="w-3.5 h-3.5" />
            Matching Profile
          </div>
          <h1 className="text-3xl font-extrabold text-[#17202A] tracking-tight">Student Profile</h1>
          <p className="text-sm text-[#596573] mt-1">
            Manage your college details, budget ceiling, and lifestyle preferences
          </p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-primary text-xs py-2 px-4 font-bold flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5" />
            Edit Preferences
          </button>
        )}
      </div>

      {message && (
        <div className="rounded-2xl bg-[#EBF8F0] border border-[#39B86B]/30 p-4 text-xs font-bold text-[#2A8C50] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#39B86B]" />
          {message}
        </div>
      )}

      {/* Main Profile Card */}
      <div className="campus-card p-6 bg-white border border-[#E5E0D8] shadow-sm">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E5E0D8]">
          <div className="w-16 h-16 rounded-2xl bg-[#EBF8F0] border border-[#39B86B]/30 flex items-center justify-center text-[#2A8C50] font-black text-2xl">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#17202A]">{profile.name}</h2>
            <p className="text-xs text-[#596573] flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-[#8A96A3]" />
              {profile.college || "Campus not specified"}
            </p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Enrolled College / University
              </label>
              <input
                type="text"
                required
                value={form.college}
                onChange={(e) => updateField("college", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none"
                placeholder="e.g. Sharda University, Galgotias University"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                  Min Budget (₹/month)
                </label>
                <input
                  type="number"
                  required
                  value={form.budgetMin}
                  onChange={(e) => updateField("budgetMin", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none no-spinner"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                  Max Budget (₹/month)
                </label>
                <input
                  type="number"
                  required
                  value={form.budgetMax}
                  onChange={(e) => updateField("budgetMax", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none no-spinner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                  Target Move-in Date
                </label>
                <input
                  type="date"
                  value={form.moveInDate}
                  onChange={(e) => updateField("moveInDate", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                  Preferred Locality
                </label>
                <input
                  type="text"
                  value={form.localityPref}
                  onChange={(e) => updateField("localityPref", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none"
                  placeholder="e.g. Knowledge Park III"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-1.5">
                Preferred Accommodation Type
              </label>
              <select
                value={form.accommodationType}
                onChange={(e) => updateField("accommodationType", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-sm font-medium text-[#17202A] focus:border-[#39B86B] focus:ring-2 focus:ring-[#39B86B]/20 outline-none"
              >
                <option value="">Any Accommodation Type</option>
                <option value="PG">PG (Paying Guest)</option>
                <option value="HOSTEL">Student Hostel</option>
                <option value="FLAT">Independent Flat</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#596573] uppercase tracking-wider mb-2">
                Lifestyle & Amenities Priorities
              </label>
              <div className="flex flex-wrap gap-2">
                {availableLifestyleOptions.map((tag) => {
                  const active = form.lifestyleTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                        active
                          ? "bg-[#39B86B] text-white border-[#39B86B]"
                          : "bg-[#F7F5EF] text-[#596573] border-[#E5E0D8] hover:border-[#8A96A3]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

            <div className="flex gap-3 pt-3">
              <button type="submit" disabled={saving} className="btn-primary flex-1 text-xs py-2.5 font-bold disabled:opacity-50">
                {saving ? "Saving Preferences..." : "Save Preferences"}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1 text-xs py-2.5 font-bold">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#F7F5EF] rounded-xl p-4 border border-[#E5E0D8]/60">
              <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider mb-1">
                Monthly Budget Window
              </div>
              <div className="text-base font-extrabold text-[#17202A]">
                ₹{profile.budgetMin?.toLocaleString() ?? "0"} - ₹{profile.budgetMax?.toLocaleString() ?? "0"}
                <span className="text-xs font-normal text-[#596573]"> /mo</span>
              </div>
            </div>

            <div className="bg-[#F7F5EF] rounded-xl p-4 border border-[#E5E0D8]/60">
              <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider mb-1">
                Target Move-in Date
              </div>
              <div className="text-base font-extrabold text-[#17202A]">
                {profile.moveInDate
                  ? new Date(profile.moveInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                  : "Immediate / Flexible"}
              </div>
            </div>

            <div className="bg-[#F7F5EF] rounded-xl p-4 border border-[#E5E0D8]/60">
              <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider mb-1">
                Preferred Locality
              </div>
              <div className="text-base font-extrabold text-[#17202A]">
                {profile.localityPref || "Greater Noida Campus Belt"}
              </div>
            </div>

            <div className="bg-[#F7F5EF] rounded-xl p-4 border border-[#E5E0D8]/60">
              <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider mb-1">
                Accommodation Type
              </div>
              <div className="text-base font-extrabold text-[#17202A] uppercase tracking-wide">
                {profile.accommodationType || "Any Type"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Lifestyle Tags */}
      {!editing && (
        <div className="campus-card p-6 bg-white border border-[#E5E0D8] shadow-sm">
          <h3 className="text-xs font-bold text-[#596573] uppercase tracking-wider mb-3">
            Active Lifestyle Priorities
          </h3>
          {profile.lifestyleTags && profile.lifestyleTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(profile.lifestyleTags)
                ? profile.lifestyleTags
                : (profile.lifestyleTags as string).split(",")
              ).map((tag) => (
                <span
                  key={tag.trim()}
                  className="px-3.5 py-1.5 rounded-full bg-[#EBF8F0] text-[#2A8C50] text-xs font-bold border border-[#39B86B]/30 flex items-center gap-1.5"
                >
                  <Check className="w-3 h-3 text-[#39B86B]" />
                  {tag.trim()}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8A96A3]">No lifestyle priorities selected yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
