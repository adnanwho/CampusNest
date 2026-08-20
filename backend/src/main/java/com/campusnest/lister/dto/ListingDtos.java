package com.campusnest.lister.dto;

import com.campusnest.model.PropertyType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

public class ListingDtos {

    @Data
    public static class ListingRequest {
        @NotBlank
        private String name;

        @NotNull
        private PropertyType type;

        @NotBlank
        private String address;

        @NotBlank
        private String locality;

        private String description;
        private Double latitude;
        private Double longitude;

        @NotNull
        @Min(0)
        private Integer rent;

        @Min(0)
        private Integer deposit;

        @Min(0)
        private Integer foodCost;

        @Min(0)
        private Integer electricityCost;

        @Min(0)
        private Integer wifiCost;

        @Min(0)
        private Integer maintenanceCost;

        private List<String> facilities;

        @Min(0)
        private Double distanceKm;

        @Min(0)
        private Integer commuteTimeMin;

        private String commuteMode;

        @NotNull
        @Min(1)
        private Integer capacity;

        @Min(0)
        private Integer occupied;
    }

    @Data
    public static class AvailabilityUpdateRequest {
        @NotNull
        @Min(0)
        private Integer occupied;
    }

    @Data
    public static class RejectRequest {
        @NotBlank
        private String reason;
    }
}
