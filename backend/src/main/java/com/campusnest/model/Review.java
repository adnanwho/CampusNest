package com.campusnest.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "property_id", nullable = false)
    private Long propertyId;

    @Column(nullable = false)
    private Double rating;

    @Column(name = "cleanliness_rating")
    private Double cleanlinessRating;

    @Column(name = "safety_rating")
    private Double safetyRating;

    @Column(name = "food_rating")
    private Double foodRating;

    @Column(name = "wifi_rating")
    private Double wifiRating;

    @Column(name = "staff_rating")
    private Double staffRating;

    @Column(name = "review_text")
    private String reviewText;

    @Column(name = "is_demo", nullable = false)
    private Boolean isDemo;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
        if (isDemo == null) isDemo = true;
    }
}
