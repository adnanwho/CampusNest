export type PropertyType = "PG" | "HOSTEL" | "FLAT" | "SHARED_ACCOMMODATION";
export type VerificationStatus = "DRAFT" | "SUBMITTED_FOR_VERIFICATION" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
export type AvailabilityStatus = "AVAILABLE" | "FILLING_FAST" | "ALMOST_FULL" | "FULL";

export type StudentPreferences = {
  budgetMin?: number;
  budgetMax?: number;
  locality?: string;
  accommodationType?: PropertyType;
  lifestyleTags?: string[];
};

export type Property = {
  id: string;
  name: string;
  type: PropertyType;
  address: string;
  locality: string;
  description: string;
  rent: number;
  deposit: number;
  foodCost: number;
  electricityCost: number;
  wifiCost: number;
  maintenanceCost: number;
  facilities: string[];
  distanceKm: number;
  commuteTimeMin: number;
  commuteMode: string;
  capacity: number;
  occupied: number;
  rating: number;
  verificationStatus: VerificationStatus;
};

export type PropertySummary = Property & {
  effectiveMonthlyCost: number;
  available: number;
  availabilityStatus: AvailabilityStatus;
  matchScore: number;
  explanation: string;
};

const properties: Property[] = [
  {
    id: "shree-balaji-boys-pg",
    name: "Shree Balaji Boys PG",
    type: "PG",
    address: "Knowledge Park III, Greater Noida",
    locality: "Knowledge Park III",
    description: "Verified student PG near NIET with meals and a quiet study-friendly environment.",
    rent: 7000,
    deposit: 10000,
    foodCost: 900,
    electricityCost: 250,
    wifiCost: 400,
    maintenanceCost: 250,
    facilities: ["WiFi", "Meals Included", "CCTV/Security", "Power Backup", "Housekeeping"],
    distanceKm: 1,
    commuteTimeMin: 5,
    commuteMode: "Walk",
    capacity: 20,
    occupied: 18,
    rating: 4.8,
    verificationStatus: "VERIFIED",
  },
  {
    id: "campus-haven-girls-pg",
    name: "Campus Haven Girls PG",
    type: "PG",
    address: "Knowledge Park III, Greater Noida",
    locality: "Knowledge Park III",
    description: "Girls PG near Sharda with safety, cleanliness, and quiet environment.",
    rent: 6800,
    deposit: 10000,
    foodCost: 900,
    electricityCost: 250,
    wifiCost: 400,
    maintenanceCost: 250,
    facilities: ["WiFi", "Meals Included", "CCTV/Security", "Housekeeping"],
    distanceKm: 1.2,
    commuteTimeMin: 6,
    commuteMode: "Walk",
    capacity: 24,
    occupied: 17,
    rating: 4.7,
    verificationStatus: "VERIFIED",
  },
  {
    id: "scholar-nest-pg",
    name: "Scholar Nest PG for Boys",
    type: "PG",
    address: "Alpha 1, Greater Noida",
    locality: "Alpha 1",
    description: "Budget PG near NIET with Wi-Fi and quiet study-friendly rooms.",
    rent: 7200,
    deposit: 10000,
    foodCost: 900,
    electricityCost: 250,
    wifiCost: 400,
    maintenanceCost: 250,
    facilities: ["WiFi", "Meals Included", "CCTV/Security", "Power Backup"],
    distanceKm: 2.1,
    commuteTimeMin: 10,
    commuteMode: "Walk",
    capacity: 20,
    occupied: 14,
    rating: 4.2,
    verificationStatus: "VERIFIED",
  },
];

export function effectiveMonthlyCost(property: Property): number {
  return property.rent + property.foodCost + property.electricityCost + property.wifiCost + property.maintenanceCost;
}

export function availability(property: Property): { available: number; status: AvailabilityStatus } {
  const available = Math.max(0, property.capacity - property.occupied);
  if (available === 0 || property.capacity <= 0) return { available, status: "FULL" };
  const ratio = available / property.capacity;
  if (ratio > 0.5) return { available, status: "AVAILABLE" };
  if (ratio > 0.25) return { available, status: "FILLING_FAST" };
  return { available, status: "ALMOST_FULL" };
}

function distanceScore(distanceKm: number): number {
  if (distanceKm <= 1.5) return 100;
  if (distanceKm <= 3) return 85;
  if (distanceKm <= 6) return 65;
  if (distanceKm <= 10) return 45;
  return 25;
}

function budgetScore(property: Property, preferences: StudentPreferences): number {
  const cost = effectiveMonthlyCost(property);
  if (preferences.budgetMin === undefined || preferences.budgetMax === undefined) return 70;
  if (cost >= preferences.budgetMin && cost <= preferences.budgetMax) return 100;
  const nearest = cost < preferences.budgetMin ? preferences.budgetMin : preferences.budgetMax;
  return Math.max(0, 100 - (Math.abs(cost - nearest) / Math.max(1, nearest)) * 160);
}

export function matchScore(property: Property, preferences: StudentPreferences): number {
  const wanted = (preferences.lifestyleTags ?? []).map((tag) => tag.toLowerCase());
  const searchable = `${property.facilities.join(",")},${property.description},${property.locality}`.toLowerCase();
  const lifestyle = wanted.length === 0 ? 65 : (wanted.filter((tag) => searchable.includes(tag)).length / wanted.length) * 100;
  const facilities = Math.min(100, 35 + property.facilities.length * 10);
  const trust = property.verificationStatus === "VERIFIED" ? 100 : 40;
  const weighted = budgetScore(property, preferences) * 0.3 + distanceScore(property.distanceKm) * 0.25 + trust * 0.2 + facilities * 0.15 + lifestyle * 0.1;
  return Math.max(0, Math.min(100, Math.round(weighted)));
}

export function summarize(property: Property, preferences: StudentPreferences = {}): PropertySummary {
  const propertyAvailability = availability(property);
  const score = matchScore(property, preferences);
  return {
    ...property,
    effectiveMonthlyCost: effectiveMonthlyCost(property),
    available: propertyAvailability.available,
    availabilityStatus: propertyAvailability.status,
    matchScore: score,
    explanation: `${property.name} matches your preferences with a ${score}% fit, a monthly effective cost of Rs ${effectiveMonthlyCost(property)}, and a ${property.distanceKm} km commute.`,
  };
}

export function searchProperties(preferences: StudentPreferences = {}): PropertySummary[] {
  return properties
    .filter((property) => property.verificationStatus === "VERIFIED" && availability(property).available > 0)
    .filter((property) => !preferences.locality || property.locality.toLowerCase().includes(preferences.locality.toLowerCase()))
    .filter((property) => !preferences.accommodationType || property.type === preferences.accommodationType)
    .filter((property) => preferences.budgetMin === undefined || effectiveMonthlyCost(property) >= preferences.budgetMin)
    .filter((property) => preferences.budgetMax === undefined || effectiveMonthlyCost(property) <= preferences.budgetMax)
    .map((property) => summarize(property, preferences))
    .sort((left, right) => right.matchScore - left.matchScore);
}

export function findProperty(id: string): PropertySummary | undefined {
  const property = properties.find((candidate) => candidate.id === id);
  return property ? summarize(property) : undefined;
}
