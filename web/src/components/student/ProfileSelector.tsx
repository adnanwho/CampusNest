"use client";

import { useState } from "react";
import { goldenProfiles } from "@/lib/data";
import type { StudentProfile } from "@/lib/types";

interface ProfileSelectorProps {
  selectedId?: string;
  onSelect?: (profile: StudentProfile) => void;
}

export default function ProfileSelector({ selectedId, onSelect }: ProfileSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = goldenProfiles.find((p) => p.id === selectedId) || goldenProfiles[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card px-4 py-3 rounded-xl flex items-center gap-3 min-w-[280px] cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
          {selected.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="text-left flex-1">
          <div className="text-sm font-semibold text-slate-900">{selected.name}</div>
          <div className="text-xs text-slate-500">
            ₹{selected.budgetMin.toLocaleString()} - ₹{selected.budgetMax.toLocaleString()} • {selected.college}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 glass-card rounded-xl shadow-xl z-20 overflow-hidden">
            <div className="p-2">
              {goldenProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => {
                    onSelect?.(profile);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selected.id === profile.id
                      ? "bg-indigo-50 border border-indigo-200"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                      {profile.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{profile.name}</div>
                      <div className="text-xs text-slate-500">
                        {profile.college} • ₹{profile.budgetMin.toLocaleString()}-₹{profile.budgetMax.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
