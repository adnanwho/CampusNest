package com.campusnest.repository;

import com.campusnest.model.Property;
import com.campusnest.model.PropertyType;
import com.campusnest.model.User;
import com.campusnest.model.UserRole;
import com.campusnest.model.VerificationStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = "campusnest.jwt.secret=test-only-campusnest-jwt-secret-which-is-at-least-32-bytes")
class PropertyRepositoryTest {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    private Long listerId;

    @BeforeEach
    void setUp() {
        if (listerId == null) {
            User lister = userRepository.save(User.builder()
                    .name("Test Lister")
                    .email("test-repo-lister-" + System.currentTimeMillis() + "@campusnest.test")
                    .passwordHash("hash")
                    .role(UserRole.LISTER)
                    .build());
            listerId = lister.getId();

            Property p1 = Property.builder()
                    .listerId(listerId)
                    .name("Knowledge Park PG")
                    .type(PropertyType.PG)
                    .address("123 KP Road")
                    .locality("Knowledge Park")
                    .rent(8000)
                    .deposit(8000)
                    .foodCost(2000)
                    .electricityCost(500)
                    .wifiCost(500)
                    .maintenanceCost(500)
                    .capacity(10)
                    .occupied(2)
                    .available(8)
                    .verificationStatus(VerificationStatus.VERIFIED)
                    .build();

            Property p2 = Property.builder()
                    .listerId(listerId)
                    .name("Alpha Flat")
                    .type(PropertyType.FLAT)
                    .address("456 Alpha Road")
                    .locality("Alpha 1")
                    .rent(20000)
                    .deposit(20000)
                    .foodCost(0)
                    .electricityCost(1000)
                    .wifiCost(500)
                    .maintenanceCost(1500)
                    .capacity(4)
                    .occupied(1)
                    .available(3)
                    .verificationStatus(VerificationStatus.VERIFIED)
                    .build();

            Property p3 = Property.builder()
                    .listerId(listerId)
                    .name("Beta Hostel Unverified")
                    .type(PropertyType.HOSTEL)
                    .address("789 Beta Road")
                    .locality("Knowledge Park")
                    .rent(5000)
                    .deposit(5000)
                    .foodCost(1000)
                    .electricityCost(500)
                    .wifiCost(500)
                    .maintenanceCost(500)
                    .capacity(10)
                    .occupied(0)
                    .available(10)
                    .verificationStatus(VerificationStatus.DRAFT)
                    .build();

            Property p4 = Property.builder()
                    .listerId(listerId)
                    .name("Gamma Full PG")
                    .type(PropertyType.PG)
                    .address("101 Gamma Road")
                    .locality("Knowledge Park")
                    .rent(7000)
                    .deposit(7000)
                    .foodCost(1000)
                    .electricityCost(500)
                    .wifiCost(500)
                    .maintenanceCost(500)
                    .capacity(5)
                    .occupied(5)
                    .available(0)
                    .verificationStatus(VerificationStatus.VERIFIED)
                    .build();

            propertyRepository.saveAll(List.of(p1, p2, p3, p4));
        }
    }

    @Test
    void testSearchVerifiedAvailable_Case1_NoFilters() {
        List<Property> results = propertyRepository.searchVerifiedAvailable(
                VerificationStatus.VERIFIED, null, null, null, null
        );
        assertThat(results).isNotEmpty();
        assertThat(results).allMatch(p -> p.getVerificationStatus() == VerificationStatus.VERIFIED && p.getAvailable() > 0);
    }

    @Test
    void testSearchVerifiedAvailable_Case2_LocalityOnly() {
        List<Property> results = propertyRepository.searchVerifiedAvailable(
                VerificationStatus.VERIFIED, "Knowledge Park", null, null, null
        );
        assertThat(results).isNotEmpty();
        assertThat(results).allMatch(p -> p.getLocality().toLowerCase().contains("knowledge park"));
    }

    @Test
    void testSearchVerifiedAvailable_Case2_LocalityCaseInsensitive() {
        List<Property> results = propertyRepository.searchVerifiedAvailable(
                VerificationStatus.VERIFIED, "knowledge park", null, null, null
        );
        assertThat(results).isNotEmpty();
        assertThat(results).allMatch(p -> p.getLocality().toLowerCase().contains("knowledge park"));
    }

    @Test
    void testSearchVerifiedAvailable_Case3_TypeOnly() {
        List<Property> results = propertyRepository.searchVerifiedAvailable(
                VerificationStatus.VERIFIED, null, PropertyType.PG, null, null
        );
        assertThat(results).isNotEmpty();
        assertThat(results).allMatch(p -> p.getType() == PropertyType.PG);
    }

    @Test
    void testSearchVerifiedAvailable_Case4_BudgetRange() {
        List<Property> results = propertyRepository.searchVerifiedAvailable(
                VerificationStatus.VERIFIED, null, null, 5000, 15000
        );
        assertThat(results).isNotEmpty();
        assertThat(results).allMatch(p -> {
            int total = p.getRent() + p.getFoodCost() + p.getElectricityCost() + p.getWifiCost() + p.getMaintenanceCost();
            return total >= 5000 && total <= 15000;
        });
    }

    @Test
    void testSearchVerifiedAvailable_MinBudgetOnly() {
        List<Property> results = propertyRepository.searchVerifiedAvailable(
                VerificationStatus.VERIFIED, null, null, 15000, null
        );
        assertThat(results).isNotEmpty();
        assertThat(results).allMatch(p -> {
            int total = p.getRent() + p.getFoodCost() + p.getElectricityCost() + p.getWifiCost() + p.getMaintenanceCost();
            return total >= 15000;
        });
    }

    @Test
    void testSearchVerifiedAvailable_MaxBudgetOnly() {
        List<Property> results = propertyRepository.searchVerifiedAvailable(
                VerificationStatus.VERIFIED, null, null, null, 15000
        );
        assertThat(results).isNotEmpty();
        assertThat(results).allMatch(p -> {
            int total = p.getRent() + p.getFoodCost() + p.getElectricityCost() + p.getWifiCost() + p.getMaintenanceCost();
            return total <= 15000;
        });
    }

    @Test
    void testSearchVerifiedAvailable_Case5_AllFilters() {
        List<Property> results = propertyRepository.searchVerifiedAvailable(
                VerificationStatus.VERIFIED, "Knowledge Park", PropertyType.PG, 5000, 15000
        );
        assertThat(results).isNotEmpty();
        assertThat(results).allMatch(p -> p.getType() == PropertyType.PG && p.getLocality().toLowerCase().contains("knowledge park"));
    }
}
