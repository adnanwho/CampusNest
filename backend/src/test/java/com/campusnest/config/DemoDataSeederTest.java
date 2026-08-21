package com.campusnest.config;

import com.campusnest.blockchain.BlockchainService;
import com.campusnest.common.AvailabilityService;
import com.campusnest.model.*;
import com.campusnest.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DemoDataSeederTest {

    @Mock UserRepository userRepository;
    @Mock StudentProfileRepository studentProfileRepository;
    @Mock ListerProfileRepository listerProfileRepository;
    @Mock PropertyRepository propertyRepository;
    @Mock ReviewRepository reviewRepository;
    @Mock VerificationRecordRepository verificationRecordRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock AvailabilityService availabilityService;
    @Mock BlockchainService blockchainService;

    @InjectMocks
    DemoDataSeeder seeder;

    @Test
    void canonicalHashIncludesRealPropertyId() {
        Property property = Property.builder()
                .id(100L)
                .address("Test Address")
                .capacity(20)
                .rent(7000)
                .build();

        when(blockchainService.computeCanonicalHash(any(), any(), any(), any())).thenAnswer(inv -> {
            Property p = inv.getArgument(0);
            return "hash-for-property-" + p.getId();
        });

        String hash = blockchainService.computeCanonicalHash(
                property,
                "admin-99",
                VerificationStatus.VERIFIED,
                java.time.Instant.now()
        );

        assertThat(hash).isEqualTo("hash-for-property-100");
    }
}
