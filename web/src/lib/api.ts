import type { CompareItem, Property, StudentProfile, User, UserRole, VerificationInfo } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

type AuthResponse = {
    token: string;
    userId: number;
    name: string;
    email: string;
    role: "STUDENT" | "LISTER" | "ADMIN";
};

type ApiError = { error?: string; message?: string };

type BackendPropertySummary = {
    id: number;
    name: string;
    type: string;
    locality: string;
    rent: number;
    effectiveMonthlyCost: number;
    distanceKm: number | null;
    commuteTimeMin: number | null;
    commuteMode: string | null;
    rating: number | null;
    available: number;
    capacity: number;
    availabilityStatus: string;
    verificationStatus: string;
    matchScore?: number;
    aiExplanation?: string;
    facilities: string[];
};

type BackendPropertyDetail = BackendPropertySummary & {
    address: string;
    description: string;
    latitude: number;
    longitude: number;
    deposit: number;
    foodCost: number;
    electricityCost: number;
    wifiCost: number;
    maintenanceCost: number;
    occupied: number;
    verificationHash?: string;
    verificationTimestamp?: string;
    blockchainTx?: string;
    reviews?: {
        id: number;
        rating: number;
        cleanlinessRating: number;
        safetyRating: number;
        foodRating: number;
        wifiRating: number;
        staffRating: number;
        reviewText: string;
        isDemo: boolean;
    }[];
    verification?: {
        recordHash: string;
        timestamp: string;
        blockchainTx: string;
        networkName: string;
        contractAddress: string;
        explorerUrl: string;
    };
};

type BackendCompareItem = {
    id: number;
    name: string;
    matchScore: number;
    rent: number;
    effectiveMonthlyCost: number;
    deposit: number;
    distanceKm: number | null;
    commuteTimeMin: number | null;
    rating: number | null;
    available: number;
    availabilityStatus: string;
    verificationStatus: string;
    keyFacilities: string[];
};

export type ListingRequest = {
    name: string;
    type: string;
    address: string;
    locality: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    rent: number;
    deposit?: number;
    foodCost?: number;
    electricityCost?: number;
    wifiCost?: number;
    maintenanceCost?: number;
    facilities?: string[];
    distanceKm?: number;
    commuteTimeMin?: number;
    commuteMode?: string;
    capacity: number;
    occupied?: number;
};

export type PropertySearchParams = {
    budgetMin?: number;
    budgetMax?: number;
    locality?: string;
    type?: string;
};

function toProperty(summary: BackendPropertySummary | BackendPropertyDetail): Property {
    const detail = summary as BackendPropertyDetail;
    return {
        id: String(summary.id),
        listerId: "",
        name: summary.name,
        type: summary.type,
        address: detail.address ?? summary.locality,
        locality: summary.locality,
        description: detail.description ?? "",
        latitude: detail.latitude ?? 0,
        longitude: detail.longitude ?? 0,
        rent: summary.rent,
        deposit: detail.deposit ?? 0,
        foodCost: detail.foodCost ?? 0,
        electricityCost: detail.electricityCost ?? 0,
        wifiCost: detail.wifiCost ?? 0,
        maintenanceCost: detail.maintenanceCost ?? 0,
        effectiveMonthlyCost: summary.effectiveMonthlyCost,
        facilities: summary.facilities ?? [],
        distanceKm: summary.distanceKm ?? 0,
        commuteTimeMin: summary.commuteTimeMin ?? 0,
        commuteMode: summary.commuteMode ?? "",
        capacity: summary.capacity,
        occupied: detail.occupied ?? summary.capacity - summary.available,
        available: summary.available,
        availabilityStatus: summary.availabilityStatus,
        rating: summary.rating ?? 0,
        verificationStatus: summary.verificationStatus as Property["verificationStatus"],
        matchScore: summary.matchScore,
        aiExplanation: summary.aiExplanation,
        verificationHash: detail.verificationHash,
        verificationTimestamp: detail.verificationTimestamp,
        blockchainTx: detail.blockchainTx,
        reviews: detail.reviews?.map((review) => ({
            id: String(review.id),
            propertyId: String(summary.id),
            rating: review.rating,
            cleanlinessRating: review.cleanlinessRating,
            safetyRating: review.safetyRating,
            foodRating: review.foodRating,
            wifiRating: review.wifiRating,
            staffRating: review.staffRating,
            reviewText: review.reviewText,
            isDemo: review.isDemo,
            createdAt: "",
        })),
        verification: detail.verification,
        createdAt: "",
        updatedAt: "",
    };
}

function toUser(response: AuthResponse): User {
    return {
        id: String(response.userId),
        name: response.name,
        email: response.email,
        role: response.role.toLowerCase() as UserRole,
    };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window === "undefined" ? null : window.localStorage.getItem("campusnest-token");
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, cache: "no-store" });
    if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(body.error ?? body.message ?? `Request failed with status ${response.status}`);
    }
    return response.json() as Promise<T>;
}

export async function login(email: string, password: string): Promise<User> {
    const response = await request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
    window.localStorage.setItem("campusnest-token", response.token);
    window.localStorage.setItem("campusnest-user", JSON.stringify(toUser(response)));
    return toUser(response);
}

export async function register(name: string, email: string, password: string, role: "STUDENT" | "LISTER" | "ADMIN"): Promise<User> {
    const response = await request<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
    });
    window.localStorage.setItem("campusnest-token", response.token);
    window.localStorage.setItem("campusnest-user", JSON.stringify(toUser(response)));
    return toUser(response);
}

export function getStoredUser(): User | null {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem("campusnest-user");
    return stored ? (JSON.parse(stored) as User) : null;
}

export function logout(): void {
    window.localStorage.removeItem("campusnest-token");
    window.localStorage.removeItem("campusnest-user");
}

export async function getStudentProfile(): Promise<StudentProfile> {
    const response = await request<StudentProfile>("/students/me");
    return {
        ...response,
        id: String(response.userId),
        userId: String(response.userId),
        moveInDate: response.moveInDate ?? "",
        localityPref: response.localityPref ?? "",
        lifestyleTags: response.lifestyleTags ?? [],
    };
}

export async function updateStudentProfile(profile: {
    college: string;
    budgetMin: number;
    budgetMax: number;
    moveInDate?: string;
    localityPref?: string;
    accommodationType?: string;
    lifestyleTags?: string[];
}): Promise<StudentProfile> {
    const response = await request<StudentProfile>("/students/me", {
        method: "PUT",
        body: JSON.stringify(profile),
    });
    return {
        ...response,
        id: String(response.userId),
        userId: String(response.userId),
        moveInDate: response.moveInDate ?? "",
        localityPref: response.localityPref ?? "",
        lifestyleTags: response.lifestyleTags ?? [],
    };
}

export async function getRecommendations(): Promise<Property[]> {
    const response = await request<BackendPropertySummary[]>("/recommendations");
    return response.map(toProperty);
}

export async function getProperties(params: PropertySearchParams = {}): Promise<Property[]> {
    const query = new URLSearchParams();
    if (params.budgetMin != null) query.set("budgetMin", String(params.budgetMin));
    if (params.budgetMax != null) query.set("budgetMax", String(params.budgetMax));
    if (params.locality) query.set("locality", params.locality);
    if (params.type) query.set("type", params.type);
    const qs = query.toString();
    const response = await request<BackendPropertySummary[]>(`/properties${qs ? `?${qs}` : ""}`);
    return response.map(toProperty);
}

export async function getProperty(id: string): Promise<Property> {
    const response = await request<BackendPropertyDetail>(`/properties/${id}`);
    return toProperty(response);
}

export async function compareProperties(propertyIds: string[]): Promise<CompareItem[]> {
    const response = await request<BackendCompareItem[]>("/properties/compare", {
        method: "POST",
        body: JSON.stringify({ propertyIds: propertyIds.map(Number) }),
    });
    return response.map((item) => ({
        id: String(item.id),
        name: item.name,
        matchScore: item.matchScore,
        rent: item.rent,
        effectiveMonthlyCost: item.effectiveMonthlyCost,
        deposit: item.deposit,
        distanceKm: item.distanceKm ?? 0,
        commuteTimeMin: item.commuteTimeMin ?? 0,
        rating: item.rating ?? 0,
        available: item.available,
        availabilityStatus: item.availabilityStatus,
        verificationStatus: item.verificationStatus as Property["verificationStatus"],
        keyFacilities: item.keyFacilities,
    }));
}

export async function getVerificationRecord(propertyId: string): Promise<VerificationInfo> {
    return request<VerificationInfo>(`/verification/${propertyId}`);
}

export async function getMyListings(): Promise<Property[]> {
    const response = await request<BackendPropertySummary[]>("/listings/mine");
    return response.map(toProperty);
}

export async function createListing(listing: ListingRequest): Promise<Property> {
    const response = await request<BackendPropertySummary>("/listings", {
        method: "POST",
        body: JSON.stringify(listing),
    });
    return toProperty(response);
}

export async function updateListing(id: string, listing: ListingRequest): Promise<Property> {
    const response = await request<BackendPropertySummary>(`/listings/${id}`, {
        method: "PUT",
        body: JSON.stringify(listing),
    });
    return toProperty(response);
}

export async function updateAvailability(id: string, occupied: number): Promise<Property> {
    const response = await request<BackendPropertySummary>(`/listings/${id}/availability`, {
        method: "PUT",
        body: JSON.stringify({ occupied }),
    });
    return toProperty(response);
}

export async function submitForVerification(id: string): Promise<Property> {
    const response = await request<BackendPropertySummary>(`/listings/${id}/verify`, { method: "POST" });
    return toProperty(response);
}

export async function getPendingVerifications(): Promise<Property[]> {
    const response = await request<BackendPropertySummary[]>("/admin/verifications/pending");
    return response.map(toProperty);
}

export async function reviewVerification(id: string): Promise<Property> {
    const response = await request<BackendPropertySummary>(`/admin/verifications/${id}/review`, { method: "POST" });
    return toProperty(response);
}

export async function approveVerification(id: string): Promise<Property> {
    const response = await request<BackendPropertySummary>(`/admin/verifications/${id}/approve`, { method: "POST" });
    return toProperty(response);
}

export async function rejectVerification(id: string, reason: string): Promise<Property> {
    const response = await request<BackendPropertySummary>(`/admin/verifications/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason }),
    });
    return toProperty(response);
}