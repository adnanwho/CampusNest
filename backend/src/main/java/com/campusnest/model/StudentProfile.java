package com.campusnest.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    private String college;

    @Column(name = "budget_min")
    private Integer budgetMin;

    @Column(name = "budget_max")
    private Integer budgetMax;

    @Column(name = "move_in_date")
    private LocalDate moveInDate;

    @Column(name = "locality_pref")
    private String localityPref;

    @Enumerated(EnumType.STRING)
    @Column(name = "accommodation_type")
    private AccommodationType accommodationType;

    @Column(name = "lifestyle_tags")
    private String lifestyleTags;

    @Column(name = "golden_profile_key")
    private String goldenProfileKey;
}
