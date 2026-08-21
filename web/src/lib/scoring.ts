import { Property, StudentProfile } from "./types";

export function getEffectiveMonthlyCost(property: Property): number {
  return property.effectiveMonthlyCost;
}

export function getAvailabilityBadge(property: Property): {
  label: string;
  color: string;
} {
  const status = property.availabilityStatus;
  if (status) {
    const map: Record<string, { label: string; color: string }> = {
      AVAILABLE: { label: "Available", color: "bg-green-100 text-green-700" },
      FILLING_FAST: { label: "Filling Fast", color: "bg-yellow-100 text-yellow-700" },
      ALMOST_FULL: { label: "Almost Full", color: "bg-orange-100 text-orange-700" },
      FULL: { label: "Full", color: "bg-red-100 text-red-700" },
    };
    const mapped = map[status.toUpperCase()];
    if (mapped) return mapped;
  }
  const ratio = property.occupied / Math.max(1, property.capacity);
  if (ratio >= 1) return { label: "Full", color: "bg-red-100 text-red-700" };
  if (ratio >= 0.8) return { label: "Almost Full", color: "bg-orange-100 text-orange-700" };
  if (ratio >= 0.5) return { label: "Filling Fast", color: "bg-yellow-100 text-yellow-700" };
  return { label: "Available", color: "bg-green-100 text-green-700" };
}