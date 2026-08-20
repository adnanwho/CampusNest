package com.campusnest.recommendation;

import com.campusnest.common.EffectiveCostService;
import com.campusnest.common.TagUtils;
import com.campusnest.model.Property;
import com.campusnest.model.StudentProfile;
import com.campusnest.model.VerificationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final EffectiveCostService effectiveCostService;

    public int score(Property property, StudentProfile profile) {
        double budget = budgetScore(property, profile);
        double distance = distanceScore(property);
        double trust = property.getVerificationStatus() == VerificationStatus.VERIFIED ? 100 : 40;
        double facilities = facilityScore(property);
        double lifestyle = lifestyleScore(property, profile);

        double weighted = (0.30 * budget)
                + (0.25 * distance)
                + (0.20 * trust)
                + (0.15 * facilities)
                + (0.10 * lifestyle);
        return Math.max(0, Math.min(100, (int) Math.round(weighted)));
    }

    public String explain(Property property, StudentProfile profile, int score) {
        int effectiveCost = effectiveCostService.calculate(property);
        String locality = property.getLocality() != null ? property.getLocality() : "your preferred area";
        String distance = property.getDistanceKm() == null ? "a practical commute" : property.getDistanceKm() + " km commute";
        if (score >= 85) {
            return property.getName() + " is a strong fit because it stays near your budget, has " + distance + ", and matches key student facilities in " + locality + ".";
        }
        if (score >= 70) {
            return property.getName() + " is a good option with an effective monthly cost of Rs " + effectiveCost + " and a balanced mix of commute, trust, and facilities.";
        }
        return property.getName() + " is available, but it may compromise on budget fit, commute, or lifestyle preferences compared with stronger matches.";
    }

    private double budgetScore(Property property, StudentProfile profile) {
        int cost = effectiveCostService.calculate(property);
        if (profile == null || profile.getBudgetMin() == null || profile.getBudgetMax() == null) return 70;
        if (cost >= profile.getBudgetMin() && cost <= profile.getBudgetMax()) return 100;
        int nearest = cost < profile.getBudgetMin() ? profile.getBudgetMin() : profile.getBudgetMax();
        double diffRatio = Math.abs(cost - nearest) / (double) Math.max(1, nearest);
        return Math.max(0, 100 - (diffRatio * 160));
    }

    private double distanceScore(Property property) {
        if (property.getDistanceKm() == null) return 65;
        double distance = property.getDistanceKm();
        if (distance <= 1.5) return 100;
        if (distance <= 3) return 85;
        if (distance <= 6) return 65;
        if (distance <= 10) return 45;
        return 25;
    }

    private double facilityScore(Property property) {
        List<String> facilities = TagUtils.parseTags(property.getFacilities());
        if (facilities.isEmpty()) return 40;
        return Math.min(100, 35 + facilities.size() * 10);
    }

    private double lifestyleScore(Property property, StudentProfile profile) {
        if (profile == null || profile.getLifestyleTags() == null || profile.getLifestyleTags().isBlank()) return 65;
        List<String> wanted = TagUtils.parseTags(profile.getLifestyleTags()).stream().map(String::toLowerCase).toList();
        String searchable = (property.getFacilities() + "," + property.getDescription() + "," + property.getLocality()).toLowerCase();
        long matches = wanted.stream().filter(searchable::contains).count();
        if (wanted.isEmpty()) return 65;
        return Math.min(100, (matches * 100.0) / wanted.size());
    }
}
