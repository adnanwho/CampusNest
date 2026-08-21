export type UserRole = "STUDENT" | "LISTER" | "ADMIN";

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
  effectiveMonthlyCost?: number;
  facilities: string[];
  distanceKm: number;
  commuteTimeMin: number;
  commuteMode: string;
  capacity: number;
  occupied: number;
  available: number;
  availabilityStatus: AvailabilityStatus | string;
  rating: number;
  verificationStatus: VerificationStatus | string;
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
  budgetScore?: number;
  distanceScore?: number;
  trustScore?: number;
  facilitiesScore?: number;
  lifestyleScore?: number;
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
  verificationStatus: VerificationStatus | string;
  keyFacilities: string[];
}

export interface AdminDashboardData {
  totalStudents: number;
  totalListers: number;
  totalAdmins: number;
  totalProperties: number;
  verifiedProperties: number;
  pendingVerifications: number;
  underReviewVerifications: number;
  rejectedProperties: number;
  totalCapacity: number;
  totalOccupied: number;
  totalAvailable: number;
  recentActivities: AdminAuditLogData[];
}

export interface AdminUserData {
  id: number;
  name: string;
  maskedEmail: string;
  role: UserRole;
  createdAt: string;
  details?: Record<string, unknown>;
}

export interface AdminPropertyData {
  id: number;
  name: string;
  type: string;
  address: string;
  locality: string;
  rent: number;
  deposit: number;
  effectiveMonthlyCost: number;
  capacity: number;
  occupied: number;
  available: number;
  rating: number;
  verificationStatus: VerificationStatus | string;
  verificationHash?: string;
  verificationTimestamp?: string;
  blockchainTx?: string;
  rejectionReason?: string;
  listerId: number;
  listerName: string;
  facilities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuditLogData {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  result: string;
  details: string;
}

export interface AdminConsentData {
  id: string;
  userId: number;
  userName: string;
  userRole: string;
  dataCategory: string;
  purpose: string;
  status: string;
  timestamp: string;
}

export interface PrivacyCategory {
  categoryName: string;
  classification: string;
  description: string;
  sampleFields: string[];
  protectionMethod: string;
}

export interface AdminPrivacyData {
  categories: PrivacyCategory[];
  activeConsents: AdminConsentData[];
  users: AdminUserData[];
}

export interface AdminReportsData {
  totalProperties: number;
  verificationRatePercent: number;
  averageRent: number;
  averageEffectiveCost: number;
  occupancyRatePercent: number;
  localityBreakdown: {
    locality: string;
    propertyCount: number;
    averageRent: number;
    averageEffectiveCost: number;
  }[];
  typeBreakdown: {
    type: string;
    count: number;
  }[];
  statusBreakdown: {
    status: string;
    count: number;
  }[];
}

export interface AdminSystemHealthData {
  backendStatus: string;
  databaseStatus: string;
  authenticationStatus: string;
  blockchainStatus: string;
  environment: string;
  databaseLatencyMs: number;
  timestamp: string;
  totalUsers: number;
  totalProperties: number;
  totalVerificationRecords: number;
}