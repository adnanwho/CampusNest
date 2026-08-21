package com.campusnest.recommendation;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.campusnest.common.EffectiveCostService;
import com.campusnest.model.Property;
import com.campusnest.model.PropertyType;
import com.campusnest.model.StudentProfile;
import com.campusnest.model.VerificationStatus;

class RecommendationServiceTest {

    private RecommendationService service;

    @BeforeEach
    void setUp() {
        service = new RecommendationService(new EffectiveCostService());
    }

    @Test
    void scoresVerifiedMatchingPropertyHighly() {
        Property property = property(7000, 1.0, "WiFi,Meals Included,CCTV/Security", VerificationStatus.VERIFIED);
        StudentProfile profile = profile(6000, 9000, "Knowledge Park", "WiFi,Safety");

        assertTrue(service.score(property, profile) >= 85);
    }

    @Test
    void scoresFarAwayUnverifiedPropertyLower() {
        Property property = property(12000, 15.0, "", VerificationStatus.DRAFT);
        StudentProfile profile = profile(6000, 8000, "Knowledge Park", "WiFi");

        assertTrue(service.score(property, profile) < 70);
    }

    @Test
    void scoreIsBoundedAndHandlesNullProfile() {
        Property property = property(100000, 50.0, "", VerificationStatus.REJECTED);

        int bounded = service.score(property, profile(1000, 2000, "Nowhere", ""));
        int withoutProfile = service.score(property, null);

        assertTrue(bounded >= 0 && bounded <= 100);
        assertTrue(withoutProfile >= 0 && withoutProfile <= 100);
    }

    @Test
    void verifiedPropertyOutscoresEquivalentDraft() {
        Property verified = property(7000, 2.0, "WiFi", VerificationStatus.VERIFIED);
        Property draft = property(7000, 2.0, "WiFi", VerificationStatus.DRAFT);
        StudentProfile profile = profile(6000, 8000, "Knowledge Park", "WiFi");

        assertTrue(service.score(verified, profile) > service.score(draft, profile));
    }

    @Test
    void explanationIsNonEmptyAndUsesFacts() {
        Property property = property(7000, 1.0, "WiFi,Security,Food", VerificationStatus.VERIFIED);
        StudentProfile profile = profile(6000, 8000, "Knowledge Park", "WiFi,Security,Food");

        String explanation = service.explain(property, profile, service.score(property, profile));

        assertNotNull(explanation);
        assertFalse(explanation.isBlank());
        assertTrue(explanation.contains("Test Property"));
    }

    private Property property(int rent, double distance, String facilities, VerificationStatus status) {
        return Property.builder()
                .listerId(1L)
                .name("Test Property")
                .type(PropertyType.PG)
                .address("Test Address")
                .locality("Knowledge Park")
                .description("Quiet student accommodation")
                .rent(rent)
                .deposit(10000)
                .foodCost(0)
                .electricityCost(0)
                .wifiCost(0)
                .maintenanceCost(0)
                .facilities(facilities)
                .distanceKm(distance)
                .capacity(10)
                .occupied(2)
                .available(8)
                .verificationStatus(status)
                .build();
    }

    private StudentProfile profile(int min, int max, String locality, String tags) {
        return StudentProfile.builder()
                .budgetMin(min)
                .budgetMax(max)
                .localityPref(locality)
                .lifestyleTags(tags)
                .build();
    }
}
