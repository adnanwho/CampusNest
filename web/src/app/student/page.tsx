"use client";

import StudentLayout from "@/app/student/layout";
import { getRecommendations, getStudentProfile } from "@/lib/api";
import type { MatchResult, StudentProfile } from "@/lib/types";
import { useEffect, useState } from "react";
import PropertyCard from "@/components/shared/PropertyCard";
import ProfileSelector from "@/components/student/ProfileSelector";

export default function StudentPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getStudentProfile(), getRecommendations()])
      .then(([student, properties]) => {
        setProfile(student);
        setResults(properties.map((property) => ({
          property,
          score: property.matchScore ?? 0,
          explanation: property.aiExplanation ?? "Recommendation from your saved preferences.",
        })));
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load recommendations"));
  }, []);

  return (
    <StudentLayout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Discover Properties
            </h1>
            <p className="text-slate-600">
              Smart recommendations for <span className="font-semibold text-indigo-600">{profile?.name ?? "your profile"}</span>
            </p>
          </div>
          {profile && <ProfileSelector selectedId={profile.id} />}
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {!error && results.length === 0 && <p className="text-slate-500">Loading recommendations...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result, idx) => (
            <PropertyCard
              key={result.property.id}
              result={result}
              rank={idx + 1}
            />
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}
