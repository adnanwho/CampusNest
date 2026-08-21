import StudentLayout from "@/app/student/layout";
import { goldenProfiles } from "@/lib/data";

export default function ProfilePage() {
  const profile = goldenProfiles[0];

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Your Profile</h1>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm text-slate-500 mb-1">Budget Range</div>
              <div className="text-lg font-bold text-slate-900">
                ₹{profile.budgetMin.toLocaleString()} - ₹{profile.budgetMax.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm text-slate-500 mb-1">Move-in Date</div>
              <div className="text-lg font-bold text-slate-900">
                {new Date(profile.moveInDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm text-slate-500 mb-1">Preferred Locality</div>
              <div className="text-lg font-bold text-slate-900">{profile.localityPref}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm text-slate-500 mb-1">Accommodation Type</div>
              <div className="text-lg font-bold text-slate-900 capitalize">{profile.accommodationType}</div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Lifestyle Preferences</h3>
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
        </div>

        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <p className="text-sm text-indigo-800">
            Demo Profile — Switch profiles from the Discover page to see different AI recommendations.
          </p>
        </div>
      </div>
    </StudentLayout>
  );
}
