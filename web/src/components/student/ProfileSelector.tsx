"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, ArrowUpRight } from "lucide-react";
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

  const initials = profile.name ? profile.name.split(" ").map((n) => n[0]).join("") : "S";

  return (
    <div className="campus-card px-4 py-3 bg-white border border-[#E5E0D8] rounded-2xl flex items-center justify-between gap-4 min-w-[300px] shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#EBF8F0] border border-[#39B86B]/30 flex items-center justify-center text-[#2A8C50] font-extrabold text-sm">
          {initials}
        </div>
        <div className="text-left">
          <div className="text-xs font-bold text-[#17202A] leading-tight">{profile.name}</div>
          <div className="text-[11px] text-[#596573] mt-0.5">
            Budget: ₹{profile.budgetMin?.toLocaleString() ?? "0"} - ₹{profile.budgetMax?.toLocaleString() ?? "0"}
          </div>
          <div className="text-[10px] text-[#8A96A3] truncate max-w-[170px]">
            {profile.college || "Greater Noida Campuses"}
          </div>
        </div>
      </div>

      <Link
        href="/student/profile"
        className="text-xs font-bold text-[#39B86B] hover:text-[#2A8C50] flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg hover:bg-[#EBF8F0] transition-colors"
        title="Edit your matching preferences"
      >
        <span>Edit</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}