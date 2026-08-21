"use client";

import { useEffect, useState } from "react";
import { getStudentProfile } from "@/lib/api";
import type { StudentProfile } from "@/lib/types";

interface ProfileSelectorProps {
  selectedId?: string;
}

export default function ProfileSelector({ selectedId }: ProfileSelectorProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    getStudentProfile()
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [selectedId]);

  if (!profile) return null;

  return (
    <div className="glass-card px-4 py-3 rounded-xl flex items-center gap-3 min-w-[280px]">
      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
        {profile.name.split(" ").map((n) => n[0]).join("")}
      </div>
      <div className="text-left flex-1">
        <div className="text-sm font-semibold text-slate-900">{profile.name}</div>
        <div className="text-xs text-slate-500">
          ₹{profile.budgetMin?.toLocaleString() ?? "0"} - ₹{profile.budgetMax?.toLocaleString() ?? "0"} • {profile.college}
        </div>
      </div>
    </div>
  );
}