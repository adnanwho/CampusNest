package com.campusnest.blockchain;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.campusnest.model.Property;
import com.campusnest.model.VerificationStatus;

class BlockchainServiceTest {

    private BlockchainService service;

    @BeforeEach
    void setUp() {
        service = new BlockchainService(
                false, "", "", "https://rpc-amoy.polygon.technology",
                "Polygon Amoy", "https://amoy.polygonscan.com");
    }

    @Test
    void recordHashIsDeterministicAndSha256Sized() {
        String hash1 = service.computeRecordHash(1L, 2L, "2026-08-21T00:00:00Z", "VERIFIED");
        String hash2 = service.computeRecordHash(1L, 2L, "2026-08-21T00:00:00Z", "VERIFIED");

        assertEquals(hash1, hash2);
        assertTrue(hash1.startsWith("0x"));
        assertEquals(66, hash1.length());
    }

    @Test
    void recordHashChangesWithStatusAndRichVerificationFields() {
        String verified = service.computeRecordHash(1L, 2L, "2026-08-21T00:00:00Z", "VERIFIED");
        String rejected = service.computeRecordHash(1L, 2L, "2026-08-21T00:00:00Z", "REJECTED");
        String rich = service.computeRecordHash(1L, 2L, "2026-08-21T00:00:00Z", "VERIFIED",
                "Knowledge Park III, Greater Noida", 30, 5L);

        assertNotEquals(verified, rejected);
        assertNotEquals(verified, rich);
    }

    @Test
    void canonicalHashIncludesPropertySnapshotAndAdminSignoff() {
        Property property = Property.builder()
                .id(1L)
                .listerId(2L)
                .address("Knowledge Park III, Greater Noida")
                .capacity(20)
                .rent(9500)
                .build();
        Instant timestamp = Instant.parse("2026-07-15T10:30:00Z");

        String hash = service.computeCanonicalHash(property, "admin-1", VerificationStatus.VERIFIED, timestamp);
        String changedHash = service.computeCanonicalHash(
                Property.builder().id(1L).listerId(2L).address("Different address").capacity(20).rent(9500).build(),
                "admin-1", VerificationStatus.VERIFIED, timestamp);

        assertNotNull(hash);
        assertEquals(66, hash.length());
        assertNotEquals(hash, changedHash);
    }

    @Test
    void registerVerificationReturnsMockWhenDisabled() {
        BlockchainService.BlockchainResult result = service.registerVerification(1L, "0xabc");

        assertNotNull(result);
        assertTrue(result.transactionHash().startsWith("mock-tx-"));
        assertEquals("Polygon Amoy", result.networkName());
    }
}
