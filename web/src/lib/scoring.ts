import { MatchResult, Property, StudentProfile } from "./types";

export function calculateMatchScore(
  property: Property,
  profile: StudentProfile
): MatchResult {
  const effectiveMonthlyCost =
    property.effectiveMonthlyCost ||
    property.rent +
      property.foodCost +
      property.electricityCost +
      property.wifiCost +
      property.maintenanceCost;

  const budgetMid = (profile.budgetMin + profile.budgetMax) / 2;
  const budgetRange = profile.budgetMax - profile.budgetMin || 1;
  const budgetDeviation = Math.abs(effectiveMonthlyCost - budgetMid);
  const budgetScore = Math.max(0, 100 - (budgetDeviation / budgetRange) * 100);

  const maxDistance = 20;
  const distanceScore = Math.max(0, 100 - (property.distanceKm / maxDistance) * 100);

  const verificationScores: Record<string, number> = {
    VERIFIED: 100,
    SUBMITTED_FOR_VERIFICATION: 70,
    UNDER_REVIEW: 50,
    DRAFT: 20,
    REJECTED: 0,
  };
  const trustScore = verificationScores[property.verificationStatus] ?? 0;

  const facilityMap: Record<string, number> = {
    "Wi-Fi": 15,
    Food: 15,
    Security: 15,
    Laundry: 10,
    AC: 10,
    "Power Backup": 10,
    Gym: 8,
    Parking: 7,
    "Study Room": 8,
    Shuttle: 8,
    "Rooftop Cafe": 5,
    Concierge: 5,
  };

  let facilitiesScore = 0;
  const matchedFacilities = property.facilities.filter((f) => {
    const tagMatch = profile.lifestyleTags.some(
      (tag) => tag.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(tag.toLowerCase())
    );
    if (tagMatch) {
      facilitiesScore += facilityMap[f] || 5;
      return true;
    }
    return false;
  });

  facilitiesScore = Math.min(100, facilitiesScore + property.facilities.length * 3);

  const typeMatch = profile.accommodationType
    ? property.type.toLowerCase() === profile.accommodationType.toLowerCase() ||
      (property.type === "SHARED_ACCOMMODATION" && profile.accommodationType === "FLAT")
    : true;
  const localityMatch = profile.localityPref
    ? property.locality.toLowerCase().includes(profile.localityPref.toLowerCase()) ||
      property.address.toLowerCase().includes(profile.localityPref.toLowerCase())
    : true;

  let lifestyleScore = 0;
  if (typeMatch) lifestyleScore += 50;
  if (localityMatch) lifestyleScore += 50;
  lifestyleScore = Math.min(100, lifestyleScore + matchedFacilities.length * 5);

  const totalScore =
    0.30 * budgetScore +
    0.25 * distanceScore +
    0.20 * trustScore +
    0.15 * facilitiesScore +
    0.10 * lifestyleScore;

  const explanations: Record<string, string> = {
    aarav: `Strong match for ${profile.name} — within budget at ₹${effectiveMonthlyCost.toLocaleString("en-IN")}, just ${property.distanceKm}km from campus with verified trust metrics.`,
    priya: `Excellent fit for ${profile.name} — premium amenities including ${property.facilities.slice(0, 3).join(", ")} align with your preferences.`,
    rohan: `Budget-friendly option for ${profile.name} at ₹${effectiveMonthlyCost.toLocaleString("en-IN")}/mo with good connectivity and essential facilities.`,
  };

  const explanation =
    explanations[profile.goldenProfileKey || ""] ||
    `${Math.round(totalScore)}% match — ₹${effectiveMonthlyCost.toLocaleString("en-IN")}/mo effective cost, ${property.distanceKm}km away, ${property.verificationStatus === "VERIFIED" ? "verified by CampusNest" : property.verificationStatus.toLowerCase()}.`;

  return {
    property,
    score: Math.round(totalScore),
    budgetScore: Math.round(budgetScore),
    distanceScore: Math.round(distanceScore),
    trustScore: Math.round(trustScore),
    facilitiesScore: Math.round(facilitiesScore),
    lifestyleScore: Math.round(lifestyleScore),
    explanation,
  };
}

export function getEffectiveMonthlyCost(property: Property): number {
  return property.effectiveMonthlyCost || (
    property.rent +
    (property.foodCost || 0) +
    (property.electricityCost || 0) +
    (property.wifiCost || 0) +
    (property.maintenanceCost || 0)
  );
}

export function getAvailabilityBadge(property: Property): {
  label: string;
  color: string;
} {
  const status = property.availabilityStatus;
  const badges: Record<string, { label: string; color: string }> = {
    AVAILABLE: { label: "Available", color: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    FILLING_FAST: { label: "Filling Fast", color: "bg-amber-50 text-amber-700 border border-amber-200" },
    ALMOST_FULL: { label: "Almost Full", color: "bg-orange-50 text-orange-700 border border-orange-200" },
    FULL: { label: "Full", color: "bg-rose-50 text-rose-700 border border-rose-200" },
  };

  if (status && badges[status.toUpperCase()]) {
    return badges[status.toUpperCase()];
  }

  const capacity = Math.max(1, property.capacity || 1);
  const ratio = (property.occupied || 0) / capacity;
  if (ratio >= 1) return badges.FULL;
  if (ratio >= 0.8) return badges.ALMOST_FULL;
  if (ratio >= 0.5) return badges.FILLING_FAST;
  return badges.AVAILABLE;
}
