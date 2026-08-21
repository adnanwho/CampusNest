import ListerLayout from "@/app/lister/layout";

export default function AddPropertyPage() {
  return (
    <ListerLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Add New Property</h1>
        <p className="text-slate-600 mb-8">Create a new listing with all cost details and facilities</p>

        <form className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Property Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="e.g., Sunshine Student PG" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none">
                    <option>PG</option>
                    <option>Hostel</option>
                    <option>Flat</option>
                    <option>Shared Flat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Locality</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="e.g., Knowledge Park III" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="Full address" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Pricing & Costs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Base Rent (₹/month)</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="8500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Deposit (₹)</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="17000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Food Cost (₹/month)</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="3000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Electricity (₹/month)</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">WiFi (₹/month)</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Maintenance (₹/month)</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="500" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Capacity & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Capacity</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Distance from Campus (km)</label>
                  <input type="number" step="0.1" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="1.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Commute Time (min)</label>
                  <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Commute Mode</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none">
                    <option>Walk</option>
                    <option>Auto</option>
                    <option>Bus</option>
                    <option>Metro</option>
                    <option>Shuttle</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {["Wi-Fi", "Food", "Security", "AC", "Parking", "Gym", "Study Room", "Power Backup", "Laundry", "Shuttle", "Rooftop Cafe", "Concierge"].map((facility) => (
                  <label key={facility} className="cursor-pointer">
                    <input type="checkbox" className="peer sr-only" />
                    <span className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-checked:border-indigo-200 transition-colors">
                      {facility}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn-primary flex-1">
              Save as Draft
            </button>
            <button type="submit" className="btn-secondary flex-1">
              Submit for Verification
            </button>
          </div>
        </form>
      </div>
    </ListerLayout>
  );
}
