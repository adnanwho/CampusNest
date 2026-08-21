package com.campusnest.admin.dto;

import com.campusnest.model.PropertyType;
import com.campusnest.model.UserRole;
import com.campusnest.model.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class AdminDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminDashboardDto {
        private long totalStudents;
        private long totalListers;
        private long totalAdmins;
        private long totalProperties;
        private long verifiedProperties;
        private long pendingVerifications;
        private long underReviewVerifications;
        private long rejectedProperties;
        private int totalCapacity;
        private int totalOccupied;
        private int totalAvailable;
        private List<AdminAuditLogDto> recentActivities;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminUserDto {
        private Long id;
        private String name;
        private String maskedEmail;
        private UserRole role;
        private Instant createdAt;
        private Map<String, Object> details;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminPropertyDto {
        private Long id;
        private String name;
        private PropertyType type;
        private String address;
        private String locality;
        private Integer rent;
        private Integer deposit;
        private Integer effectiveMonthlyCost;
        private Integer capacity;
        private Integer occupied;
        private Integer available;
        private Double rating;
        private VerificationStatus verificationStatus;
        private String verificationHash;
        private Instant verificationTimestamp;
        private String blockchainTx;
        private String rejectionReason;
        private Long listerId;
        private String listerName;
        private List<String> facilities;
        private Instant createdAt;
        private Instant updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminAuditLogDto {
        private String id;
        private String actor;
        private String action;
        private String target;
        private Instant timestamp;
        private String result;
        private String details;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminConsentDto {
        private String id;
        private Long userId;
        private String userName;
        private String userRole;
        private String dataCategory;
        private String purpose;
        private String status;
        private Instant timestamp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminPrivacyDto {
        private List<PrivacyCategoryDto> categories;
        private List<AdminConsentDto> activeConsents;
        private List<AdminUserDto> users;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrivacyCategoryDto {
        private String categoryName;
        private String classification; // PUBLIC DATA, PRIVATE DATA, SYSTEM DATA, CONSENTED DATA
        private String description;
        private List<String> sampleFields;
        private String protectionMethod;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminReportsDto {
        private long totalProperties;
        private double verificationRatePercent;
        private double averageRent;
        private double averageEffectiveCost;
        private double occupancyRatePercent;
        private List<LocalityMetric> localityBreakdown;
        private List<TypeMetric> typeBreakdown;
        private List<StatusMetric> statusBreakdown;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocalityMetric {
        private String locality;
        private long propertyCount;
        private double averageRent;
        private double averageEffectiveCost;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TypeMetric {
        private String type;
        private long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusMetric {
        private String status;
        private long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminSystemHealthDto {
        private String backendStatus;
        private String databaseStatus;
        private String authenticationStatus;
        private String blockchainStatus;
        private String environment;
        private long databaseLatencyMs;
        private Instant timestamp;
        private long totalUsers;
        private long totalProperties;
        private long totalVerificationRecords;
    }
}
