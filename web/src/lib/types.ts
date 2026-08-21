export type UserRole = "STUDENT" | "LISTER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  college: string;
  budgetMin: number;
  budgetMax: number;
  moveInDate: string;
  localityPref: string;
  accommodationType: string;
  lifestyleTags: string[];
  goldenProfileKey?: string;
}

export interface Property {
  id: string;
  listerId: string;
  name: string;
  type: "PG" | "HOSTEL" | "FLAT" | "SHARED_ACCOMMODATION";
  address: string;
  locality: string;
  description: string;
  latitude: number;
  longitude: number;
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
  available: number;
  availabilityStatus: "AVAILABLE" | "FILLING_FAST" | "ALMOST_FULL" | "FULL";
  rating: number;
  verificationStatus: "DRAFT" | "SUBMITTED_FOR_VERIFICATION" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
  verificationHash?: string;
  verificationTimestamp?: string;
  blockchainTx?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  rating: number;
  cleanlinessRating: number;
  safetyRating: number;
  foodRating: number;
  wifiRating: number;
  staffRating: number;
  reviewText: string;
  isDemo: boolean;
  createdAt: string;
}

export interface VerificationRecord {
  id: string;
  propertyId: string;
  listerId: string;
  verificationStatus: string;
  recordHash: string;
  timestamp: string;
  blockchainTx?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface MatchResult {
  property: Property;
  score: number;
  budgetScore: number;
  distanceScore: number;
  trustScore: number;
  facilitiesScore: number;
  lifestyleScore: number;
  explanation: string;
  compareItem?: {
    id: string;
    name: string;
    matchScore: number;
    rent: number;
    effectiveMonthlyCost: number;
    deposit: number;
    distanceKm: number;
    commuteTimeMin: number;
    rating: number;
    available: number;
    availabilityStatus: string;
    verificationStatus: string;
    keyFacilities: string[];
  };
}
