package com.campusnest.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lister_id", nullable = false)
    private Long listerId;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyType type;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String locality;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    private Integer rent;

    @Column(nullable = false)
    private Integer deposit;

    @Column(name = "food_cost", nullable = false)
    private Integer foodCost;

    @Column(name = "electricity_cost", nullable = false)
    private Integer electricityCost;

    @Column(name = "wifi_cost", nullable = false)
    private Integer wifiCost;

    @Column(name = "maintenance_cost", nullable = false)
    private Integer maintenanceCost;

    @Column(columnDefinition = "TEXT")
    private String facilities;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "commute_time_min")
    private Integer commuteTimeMin;

    @Column(name = "commute_mode")
    private String commuteMode;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Integer occupied;

    @Column(nullable = false)
    private Integer available;

    private Double rating;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    private VerificationStatus verificationStatus;

    @Column(name = "verification_hash")
    private String verificationHash;

    @Column(name = "verification_timestamp")
    private Instant verificationTimestamp;

    @Column(name = "blockchain_tx")
    private String blockchainTx;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (verificationStatus == null) verificationStatus = VerificationStatus.DRAFT;
        if (deposit == null) deposit = 0;
        if (foodCost == null) foodCost = 0;
        if (electricityCost == null) electricityCost = 0;
        if (wifiCost == null) wifiCost = 0;
        if (maintenanceCost == null) maintenanceCost = 0;
        if (occupied == null) occupied = 0;
        if (available == null && capacity != null) available = capacity - occupied;
        if (rating == null) rating = 0.0;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
        if (capacity != null && occupied != null) {
            available = Math.max(0, capacity - occupied);
        }
    }
}
