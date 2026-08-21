import StudentLayout from "@/app/student/layout";
import { goldenProfiles, demoProperties } from "@/lib/data";
import { calculateMatchScore } from "@/lib/scoring";
import PropertyCard from "@/components/shared/PropertyCard";
import ProfileSelector from "@/components/student/ProfileSelector";

export default function StudentPage() {
  const profile = goldenProfiles[0];
  const results = demoProperties
    .map((p) => calculateMatchScore(p, profile))
    .sort((a, b) => b.score - a.score);

  return (
    <StudentLayout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Discover Properties
            </h1>
            <p className="text-slate-600">
              AI-powered recommendations for <span className="font-semibold text-indigo-600">{profile.name}</span>
            </p>
          </div>
          <ProfileSelector />
        </div>

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
