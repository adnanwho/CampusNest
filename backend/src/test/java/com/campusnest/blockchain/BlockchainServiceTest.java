package com.campusnest.blockchain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class BlockchainServiceTest {

    private BlockchainService service;

    @BeforeEach
    void setUp() {
        service = new BlockchainService(
                false, "", "", "https://rpc-amoy.polygon.technology",
                "Polygon Amoy", "https://amoy.polygonscan.com");
    }

    @Test
    void computeRecordHash_returnsHexPrefixedHash() {
        String hash = service.computeRecordHash(1L, 2L, "2026-08-21T00:00:00Z", "VERIFIED");
        assertNotNull(hash);
        assertTrue(hash.startsWith("0x"));
        assertEquals(66, hash.length(), "SHA-256 hex should be 64 chars + 0x prefix");
    }

    @Test
    void computeRecordHash_isDeterministic() {
        String hash1 = service.computeRecordHash(1L, 2L, "2026-08-21T00:00:00Z", "VERIFIED");
        String hash2 = service.computeRecordHash(1L, 2L, "2026-08-21T00:00:00Z", "VERIFIED");
        assertEquals(hash1, hash2, "Same inputs should produce same hash");
    }

    @Test
    void computeRecordHash_differsForDifferentStatus() {
        String verified = service.computeRecordHash(1L, 2L, "2026-08-21T00:00:00Z", "VERIFIED");
        String rejected = service.computeRecordHash(1L, 2L, "2026-08-21T00:00:00Z", "REJECTED");
        assertNotEquals(verified, rejected);
    }

    @Test
    void computeRecordHash_richPayloadIncludesAddressCapacityAdmin() {
        String basic = service.computeRecordHash(1L, 2L, "2026-08-21T00:00:00Z", "VERIFIED");
        String rich = service.computeRecordHash(1L, 2L, "2026-08-21T00:00:00Z", "VERIFIED",
                "Knowledge Park III, Greater Noida", 30, 5L);
        assertNotEquals(basic, rich, "Rich payload should produce different hash");
    }

    @Test
    void computeRecordHash_richPayloadIsCaseInsensitiveForAddress() {
        String upper = service.computeRecordHash(1L, 2L, "2026-08-21T00:00:00Z", "VERIFIED",
                "KNOWLEDGE PARK III, GREATER NOIDA", 30, 5L);
        String lower = service.computeRecordHash(1L, 2L, "2026-08-21T00:00:00Z", "VERIFIED",
                "knowledge park iii, greater noida", 30, 5L);
        assertEquals(upper, lower, "Address should be normalized to lowercase");
    }

    @Test
    void registerVerification_returnsMockWhenDisabled() {
        BlockchainService.BlockchainResult result = service.registerVerification(1L, "0xabc");
        assertNotNull(result);
        assertNotNull(result.transactionHash());
        assertTrue(result.transactionHash().startsWith("mock-tx-"));
        assertEquals("Polygon Amoy", result.networkName());
    }
}