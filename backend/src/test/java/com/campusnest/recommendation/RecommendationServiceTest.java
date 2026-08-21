package com.campusnest.recommendation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

import com.campusnest.common.EffectiveCostService;
import com.campusnest.model.Property;
import com.campusnest.model.PropertyType;
import com.campusnest.model.StudentProfile;
import com.campusnest.model.VerificationStatus;

class RecommendationServiceTest {

    private final RecommendationService recommendationService = new RecommendationService(new EffectiveCostService());

    @Test
    void producesHighScoreForVerifiedPropertyMatchingStudentPreferences() {
        Property property = property(7000, 1.0, "WiFi,Meals Included,CCTV/Security", VerificationStatus.VERIFIED);
        StudentProfile profile = StudentProfile.builder()
                .budgetMin(7000)
                .budgetMax(9000)
                .lifestyleTags("WiFi,Safety")
                .build();

        int score = recommendationService.score(property, profile);

        assertTrue(score >= 85);
    }

    @Test
    void rewardsVerificationAndPenalizesDistanceAndBudgetMismatch() {
        Property verified = property(7000, 1.0, "WiFi", VerificationStatus.VERIFIED);
        Property unverified = property(12000, 12.0, "", VerificationStatus.DRAFT);
        StudentProfile profile = StudentProfile.builder().budgetMin(6000).budgetMax(8000).build();

        assertTrue(recommendationService.score(verified, profile) > recommendationService.score(unverified, profile));
    }

    @Test
    void explanationUsesScoreBandAndSuppliedPropertyFacts() {
        Property property = property(7000, 1.0, "WiFi", VerificationStatus.VERIFIED);

        String explanation = recommendationService.explain(property, StudentProfile.builder().build(), 90);

        assertEquals(true, explanation.contains("1.0 km commute"));
        assertEquals(true, explanation.contains("your budget"));
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
}