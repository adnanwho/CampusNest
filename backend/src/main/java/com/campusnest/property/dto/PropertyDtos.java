package com.campusnest.property.dto;

import com.campusnest.model.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

public class PropertyDtos {

    @Data
    @Builder
    public static class PropertySummaryDto {
        private Long id;
        private String name;
        private PropertyType type;
        private String locality;
        private Integer rent;
        private Integer effectiveMonthlyCost;
        private Double distanceKm;
        private Integer commuteTimeMin;
        private String commuteMode;
        private Double rating;
        private Integer available;
        private Integer capacity;
        private AvailabilityStatus availabilityStatus;
        private VerificationStatus verificationStatus;
        private Integer matchScore;
        private String aiExplanation;
        private List<String> facilities;
    }

    @Data
    @Builder
    public static class PropertyDetailDto {
        private Long id;
        private String name;
        private PropertyType type;
        private String address;
        private String locality;
        private String description;
        private Double latitude;
        private Double longitude;
        private Integer rent;
        private Integer deposit;
        private Integer foodCost;
        private Integer electricityCost;
        private Integer wifiCost;
        private Integer maintenanceCost;
        private Integer effectiveMonthlyCost;
        private List<String> facilities;
        private Double distanceKm;
        private Integer commuteTimeMin;
        private String commuteMode;
        private Integer capacity;
        private Integer occupied;
        private Integer available;
        private AvailabilityStatus availabilityStatus;
        private Double rating;
        private VerificationStatus verificationStatus;
        private String verificationHash;
        private Instant verificationTimestamp;
        private String blockchainTx;
        private List<ReviewDto> reviews;
        private VerificationInfoDto verification;
    }

    @Data
    @Builder
    public static class ReviewDto {
        private Long id;
        private Double rating;
        private Double cleanlinessRating;
        private Double safetyRating;
        private Double foodRating;
        private Double wifiRating;
        private Double staffRating;
        private String reviewText;
        private Boolean isDemo;
    }

    @Data
    @Builder
    public static class VerificationInfoDto {
        private String recordHash;
        private Instant timestamp;
        private String blockchainTx;
        private String networkName;
        private String contractAddress;
        private String explorerUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompareRequest {
        private List<Long> propertyIds;
    }

    @Data
    @Builder
    public static class CompareItemDto {
        private Long id;
        private String name;
        private Integer matchScore;
        private Integer rent;
        private Integer effectiveMonthlyCost;
        private Integer deposit;
        private Double distanceKm;
        private Integer commuteTimeMin;
        private Double rating;
        private Integer available;
        private AvailabilityStatus availabilityStatus;
        private VerificationStatus verificationStatus;
        private List<String> keyFacilities;
    }
}
