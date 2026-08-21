package com.campusnest.recommendation;

import static org.junit.jupiter.api.Assertions.assertEquals;
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

    private Property property(int rent, int food, int electricity, int wifi, int maintenance,
                              double distanceKm, VerificationStatus status, String facilities) {
        return Property.builder()
                .listerId(1L)
                .name("Test Property")
                .type(PropertyType.PG)
                .address("Test Address")
                .locality("Knowledge Park")
                .description("Quiet student accommodation")
                .rent(rent)
                .deposit(10000)
                .foodCost(food)
                .electricityCost(electricity)
                .wifiCost(wifi)
                .maintenanceCost(maintenance)
                .distanceKm(distanceKm)
                .capacity(10)
                .occupied(2)
                .available(8)
                .verificationStatus(status)
                .facilities(facilities)
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

    @Test
    void score_returns100_forPerfectMatch() {
        Property p = property(7000, 0, 0, 0, 0, 1.0, VerificationStatus.VERIFIED, "Wi-Fi,Security,Food");
        StudentProfile profile = profile(6000, 8000, "Knowledge Park", "Wi-Fi,Security,Food");
        int score = service.score(p, profile);
        assertTrue(score >= 80, "Expected high score for perfect match, got " + score);
    }

    @Test
    void score_returnsLower_forFarAwayUnverified() {
        Property p = property(7000, 0, 0, 0, 0, 15.0, VerificationStatus.DRAFT, "Wi-Fi");
        StudentProfile profile = profile(6000, 8000, "Knowledge Park", "Wi-Fi");
        int score = service.score(p, profile);
        assertTrue(score < 70, "Expected lower score for far unverified property, got " + score);
    }

    @Test
    void score_isBoundedBetween0And100() {
        Property p = property(100000, 0, 0, 0, 0, 50.0, VerificationStatus.REJECTED, "");
        StudentProfile profile = profile(1000, 2000, "Nowhere", "");
        int score = service.score(p, profile);
        assertTrue(score >= 0 && score <= 100, "Score must be in [0,100], got " + score);
    }

    @Test
    void score_verifiedGetsHigherTrustThanDraft() {
        Property verified = property(7000, 0, 0, 0, 0, 2.0, VerificationStatus.VERIFIED, "Wi-Fi");
        Property draft = property(7000, 0, 0, 0, 0, 2.0, VerificationStatus.DRAFT, "Wi-Fi");
        StudentProfile profile = profile(6000, 8000, "Knowledge Park", "Wi-Fi");
        assertTrue(service.score(verified, profile) > service.score(draft, profile),
                "Verified property should score higher than draft");
    }

    @Test
    void explain_returnsNonEmptyForHighScore() {
        Property p = property(7000, 0, 0, 0, 0, 1.0, VerificationStatus.VERIFIED, "Wi-Fi,Security,Food");
        StudentProfile profile = profile(6000, 8000, "Knowledge Park", "Wi-Fi,Security,Food");
        int score = service.score(p, profile);
        String explanation = service.explain(p, profile, score);
        assertNotNull(explanation);
        assertFalse(explanation.isBlank());
    }

    @Test
    void score_handlesNullProfileGracefully() {
        Property p = property(7000, 0, 0, 0, 0, 1.0, VerificationStatus.VERIFIED, "Wi-Fi");
        int score = service.score(p, null);
        assertTrue(score >= 0 && score <= 100, "Score must be in [0,100], got " + score);
    }

    @Test
    void producesHighScoreForVerifiedPropertyMatchingStudentPreferences() {
        Property property = property(7000, 0, 0, 0, 0, 1.0, VerificationStatus.VERIFIED, "WiFi,Meals Included,CCTV/Security");
        StudentProfile profile = StudentProfile.builder()
                .budgetMin(7000)
                .budgetMax(9000)
                .lifestyleTags("WiFi,Safety")
                .build();

        int score = service.score(property, profile);
        assertTrue(score >= 80);
    }

    @Test
    void rewardsVerificationAndPenalizesDistanceAndBudgetMismatch() {
        Property verified = property(7000, 0, 0, 0, 0, 1.0, VerificationStatus.VERIFIED, "WiFi");
        Property unverified = property(12000, 0, 0, 0, 0, 12.0, VerificationStatus.DRAFT, "");
        StudentProfile profile = StudentProfile.builder().budgetMin(6000).budgetMax(8000).build();

        assertTrue(service.score(verified, profile) > service.score(unverified, profile));
    }

    @Test
    void explanationUsesScoreBandAndSuppliedPropertyFacts() {
        Property property = property(7000, 0, 0, 0, 0, 1.0, VerificationStatus.VERIFIED, "WiFi");
        String explanation = service.explain(property, StudentProfile.builder().build(), 90);

        assertEquals(true, explanation.contains("1.0 km commute") || explanation.contains("1.0km"));
        assertEquals(true, explanation.contains("budget"));
    }
}