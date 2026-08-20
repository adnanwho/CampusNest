package com.campusnest.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "verification_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "property_id", nullable = false)
    private Long propertyId;

    @Column(name = "lister_id", nullable = false)
    private Long listerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    private VerificationStatus verificationStatus;

    @Column(name = "record_hash", nullable = false)
    private String recordHash;

    @Column(nullable = false)
    private Instant timestamp;

    @Column(name = "blockchain_tx")
    private String blockchainTx;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "rejection_reason")
    private String rejectionReason;
}
