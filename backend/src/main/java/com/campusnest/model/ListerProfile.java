package com.campusnest.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lister_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "organization_name")
    private String organizationName;

    private String phone;
}
