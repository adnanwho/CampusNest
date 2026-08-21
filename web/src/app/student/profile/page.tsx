"use client";

import { useEffect, useState } from "react";
import StudentLayout from "@/app/student/layout";
import { getStudentProfile, updateStudentProfile } from "@/lib/api";
import type { StudentProfile } from "@/lib/types";
import type { PropertyType } from "@/lib/types";

export default function ProfilePage() {
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
    lifestyleTags: "",
  });

  useEffect(() => {
    getStudentProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          college: data.college ?? "",
          budgetMin: data.budgetMin != null ? String(data.budgetMin) : "",
          budgetMax: data.budgetMax != null ? String(data.budgetMax) : "",
          moveInDate: data.moveInDate ?? "",
          localityPref: data.localityPref ?? "",
          accommodationType: data.accommodationType ?? "",
          lifestyleTags: Array.isArray(data.lifestyleTags) ? data.lifestyleTags.join(", ") : (data.lifestyleTags ?? ""),
        });
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load profile"));
  }, []);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
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
        lifestyleTags: form.lifestyleTags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });
      setProfile(updated);
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="max-w-2xl mx-auto">
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        </div>
      </StudentLayout>
    );
  }

  if (!profile) {
    return (
      <StudentLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Your Profile</h1>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-secondary">
              Edit Profile
            </button>
          )}
        </div>

        {message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 mb-6">{message}</p>}

        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
              {profile.name.split(" ").map((n) => n[0]).join("")}
            </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
                <p className="text-slate-600">{profile.college}</p>
              </div>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">College</label>
                <input
                  type="text"
                  required
                  value={form.college}
                  onChange={(event) => updateField("college", event.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Budget Min (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.budgetMin}
                    onChange={(event) => updateField("budgetMin", event.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Budget Max (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.budgetMax}
                    onChange={(event) => updateField("budgetMax", event.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none no-spinner"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Move-in Date</label>
                <input
                  type="date"
                  value={form.moveInDate}
                  onChange={(event) => updateField("moveInDate", event.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Locality</label>
                <input
                  type="text"
                  value={form.localityPref}
                  onChange={(event) => updateField("localityPref", event.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Accommodation Type</label>
                <select
                  value={form.accommodationType}
                  onChange={(event) => updateField("accommodationType", event.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                >
                  <option value="">Select type</option>
                  <option value="PG">PG</option>
                  <option value="HOSTEL">Hostel</option>
                  <option value="FLAT">Flat</option>
                  <option value="SHARED_ACCOMMODATION">Shared Flat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lifestyle Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.lifestyleTags}
                  onChange={(event) => updateField("lifestyleTags", event.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="Wi-Fi, Food, Safety"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Budget Range</div>
                <div className="text-lg font-bold text-slate-900">
                  ₹{profile.budgetMin?.toLocaleString() ?? "0"} - ₹{profile.budgetMax?.toLocaleString() ?? "0"}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Move-in Date</div>
                <div className="text-lg font-bold text-slate-900">
                  {profile.moveInDate ? new Date(profile.moveInDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Not set"}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Preferred Locality</div>
                <div className="text-lg font-bold text-slate-900">{profile.localityPref || "Not set"}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">Accommodation Type</div>
                <div className="text-lg font-bold text-slate-900 capitalize">{profile.accommodationType || "Not set"}</div>
              </div>
            </div>
          )}
        </div>

        {!editing && (
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Lifestyle Preferences</h3>
            {profile.lifestyleTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.lifestyleTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No lifestyle preferences set.</p>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
