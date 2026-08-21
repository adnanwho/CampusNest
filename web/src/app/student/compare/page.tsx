import StudentLayout from "@/app/student/layout";
import { demoProperties, goldenProfiles } from "@/lib/data";
import { calculateMatchScore, getEffectiveMonthlyCost } from "@/lib/scoring";
import PropertyCard from "@/components/shared/PropertyCard";
import ProfileSelector from "@/components/student/ProfileSelector";

export default function ComparePage() {
  const profile = goldenProfiles[0];
  const results = demoProperties
    .map((p) => calculateMatchScore(p, profile))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Compare Properties</h1>
            <p className="text-slate-600">
              Side-by-side comparison for <span className="font-semibold text-indigo-600">{profile.name}</span>
            </p>
          </div>
          <ProfileSelector />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full glass-card rounded-2xl overflow-hidden">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Feature</th>
                {results.map((result) => (
                  <th key={result.property.id} className="text-left px-6 py-4 min-w-[220px]">
                    <div className="font-semibold text-slate-900 text-sm">{result.property.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{result.property.locality}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Match Score</td>
                {results.map((result) => (
                  <td key={result.property.id} className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold text-indigo-600">{result.score}%</div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Effective Cost</td>
                {results.map((result) => (
                  <td key={result.property.id} className="px-6 py-4 text-sm text-slate-700">
                    ₹{getEffectiveMonthlyCost(result.property).toLocaleString()}/mo
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Base Rent</td>
                {results.map((result) => (
                  <td key={result.property.id} className="px-6 py-4 text-sm text-slate-700">
                    ₹{result.property.rent.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Deposit</td>
                {results.map((result) => (
                  <td key={result.property.id} className="px-6 py-4 text-sm text-slate-700">
                    ₹{result.property.deposit.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Commute</td>
                {results.map((result) => (
                  <td key={result.property.id} className="px-6 py-4 text-sm text-slate-700">
                    {result.property.commuteTimeMin} min ({result.property.commuteMode})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Distance</td>
                {results.map((result) => (
                  <td key={result.property.id} className="px-6 py-4 text-sm text-slate-700">
                    {result.property.distanceKm} km
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Rating</td>
                {results.map((result) => (
                  <td key={result.property.id} className="px-6 py-4 text-sm text-slate-700">
                    ⭐ {result.property.rating}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Availability</td>
                {results.map((result) => (
                  <td key={result.property.id} className="px-6 py-4 text-sm text-slate-700">
                    {result.property.available} / {result.property.capacity} beds
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Verification</td>
                {results.map((result) => (
                  <td key={result.property.id} className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.property.verificationStatus === "VERIFIED"
                        ? "bg-emerald-50 text-emerald-700"
                        : result.property.verificationStatus === "UNDER_REVIEW"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {result.property.verificationStatus.replace("_", " ")}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">Type</td>
                {results.map((result) => (
                  <td key={result.property.id} className="px-6 py-4 text-sm text-slate-700 capitalize">
                    {result.property.type}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </StudentLayout>
  );
}
