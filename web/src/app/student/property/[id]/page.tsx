import { notFound } from "next/navigation";
import StudentLayout from "@/app/student/layout";
import { demoProperties, goldenProfiles } from "@/lib/data";
import { calculateMatchScore } from "@/lib/scoring";
import PropertyDetailModal from "@/components/shared/PropertyDetailModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = demoProperties.find((p) => p.id === id);
  if (!property) return notFound();

  const profile = goldenProfiles[0];
  const result = calculateMatchScore(property, profile);

  return (
    <StudentLayout>
      <PropertyDetailModal property={property} onClose={() => {}} />
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.verificationStatus === "VERIFIED"
                      ? "bg-emerald-50 text-emerald-700"
                      : property.verificationStatus === "UNDER_REVIEW"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {property.verificationStatus.replace("_", " ")}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 capitalize">
                    {property.type}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{property.name}</h1>
                <div className="flex items-center gap-2 text-slate-600">
                  <span>{property.address}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-600">{result.score}%</div>
                <div className="text-sm text-slate-500">match score</div>
              </div>
            </div>

            <p className="text-slate-700 mb-6">{property.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">₹{property.rent.toLocaleString()}</div>
                <div className="text-xs text-slate-500 mt-1">Base Rent</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">
                  ₹{(property.rent + property.foodCost + property.electricityCost + property.wifiCost + property.maintenanceCost).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-1">Effective Cost</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{property.distanceKm}km</div>
                <div className="text-xs text-slate-500 mt-1">From Campus</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{property.commuteTimeMin}min</div>
                <div className="text-xs text-slate-500 mt-1">Commute</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {property.facilities.map((facility) => (
                  <span key={facility} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium">
                    {facility}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-xl">★</span>
                <span className="font-bold text-slate-900">{property.rating}</span>
                <span className="text-slate-500">/ 5.0</span>
              </div>
              <div className="flex gap-3">
                <a href="/student" className="btn-secondary">Back to Discover</a>
                <a href="/student/compare" className="btn-primary">Compare</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
