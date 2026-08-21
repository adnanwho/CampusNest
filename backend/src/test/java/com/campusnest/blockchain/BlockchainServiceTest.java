package com.campusnest.blockchain;

import com.campusnest.model.Property;
import com.campusnest.model.PropertyType;
import com.campusnest.model.VerificationStatus;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class BlockchainServiceTest {

    private final BlockchainService service = new BlockchainService(
            false, null, null, null, null, null);

    @Test
    void canonicalHashIsDeterministic() {
        Property property = Property.builder()
                .id(1L)
                .address("Knowledge Park III, Greater Noida")
                .capacity(20)
                .rent(9500)
                .build();

        Instant now = Instant.parse("2026-07-15T10:30:00Z");
        String hash1 = service.computeCanonicalHash(property, "admin-1", VerificationStatus.VERIFIED, now);
        String hash2 = service.computeCanonicalHash(property, "admin-1", VerificationStatus.VERIFIED, now);

        assertThat(hash1).isEqualTo(hash2);
        assertThat(hash1).startsWith("0x");
        assertThat(hash1).hasSize(66);
    }

    @Test
    void canonicalHashChangesWithPropertyFields() {
        Property p1 = Property.builder().id(1L).address("Addr A").capacity(10).rent(5000).build();
        Property p2 = Property.builder().id(2L).address("Addr B").capacity(20).rent(10000).build();
        Instant now = Instant.now();

        String hash1 = service.computeCanonicalHash(p1, "admin", VerificationStatus.VERIFIED, now);
        String hash2 = service.computeCanonicalHash(p2, "admin", VerificationStatus.VERIFIED, now);

        assertThat(hash1).isNotEqualTo(hash2);
    }

    @Test
    void canonicalHashChangesWithStatus() {
        Property property = Property.builder().id(1L).address("Addr").capacity(10).rent(5000).build();
        Instant now = Instant.now();

        String verifiedHash = service.computeCanonicalHash(property, "admin", VerificationStatus.VERIFIED, now);
        String rejectedHash = service.computeCanonicalHash(property, "admin", VerificationStatus.REJECTED, now);

        assertThat(verifiedHash).isNotEqualTo(rejectedHash);
    }
}
