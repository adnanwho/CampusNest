export type UserRole = "student" | "lister" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type PropertyType = "PG" | "HOSTEL" | "FLAT" | "SHARED_ACCOMMODATION";

export type AvailabilityStatus = "AVAILABLE" | "FILLING_FAST" | "ALMOST_FULL" | "FULL";

export type VerificationStatus =
  | "DRAFT"
  | "SUBMITTED_FOR_VERIFICATION"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED";

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  college: string;
  budgetMin: number;
  budgetMax: number;
  moveInDate: string;
  localityPref: string;
  accommodationType: PropertyType | string;
  lifestyleTags: string[];
  goldenProfileKey?: string;
}

export interface VerificationInfo {
  recordHash: string;
  timestamp: string;
  blockchainTx: string;
  networkName: string;
  contractAddress: string;
  explorerUrl: string;
}

export interface Property {
  id: string;
  listerId: string;
  name: string;
  type: PropertyType | string;
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
  effectiveMonthlyCost: number;
  facilities: string[];
  distanceKm: number;
  commuteTimeMin: number;
  commuteMode: string;
  capacity: number;
  occupied: number;
  available: number;
  availabilityStatus: AvailabilityStatus | string;
  rating: number;
  verificationStatus: VerificationStatus;
  verificationHash?: string;
  verificationTimestamp?: string;
  blockchainTx?: string;
  rejectionReason?: string;
  reviews?: Review[];
  verification?: VerificationInfo;
  matchScore?: number;
  aiExplanation?: string;
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
  explanation: string;
}

export interface CompareItem {
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
  availabilityStatus: AvailabilityStatus | string;
  verificationStatus: VerificationStatus;
  keyFacilities: string[];
}