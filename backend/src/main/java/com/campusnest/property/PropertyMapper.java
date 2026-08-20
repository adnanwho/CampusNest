package com.campusnest.property;

import com.campusnest.common.AvailabilityService;
import com.campusnest.common.EffectiveCostService;
import com.campusnest.common.TagUtils;
import com.campusnest.model.*;
import com.campusnest.property.dto.PropertyDtos.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PropertyMapper {

    private final AvailabilityService availabilityService;
    private final EffectiveCostService effectiveCostService;
    private final String networkName;
    private final String contractAddress;
    private final String explorerUrl;

    public PropertyMapper(
            AvailabilityService availabilityService,
            EffectiveCostService effectiveCostService,
            @Value("${campusnest.blockchain.network-name}") String networkName,
            @Value("${campusnest.blockchain.contract-address:}") String contractAddress,
            @Value("${campusnest.blockchain.explorer-url}") String explorerUrl
    ) {
        this.availabilityService = availabilityService;
        this.effectiveCostService = effectiveCostService;
        this.networkName = networkName;
        this.contractAddress = contractAddress;
        this.explorerUrl = explorerUrl;
    }

    public PropertySummaryDto toSummary(Property property) {
        return PropertySummaryDto.builder()
                .id(property.getId())
                .name(property.getName())
                .type(property.getType())
                .locality(property.getLocality())
                .rent(property.getRent())
                .effectiveMonthlyCost(effectiveCostService.calculate(property))
                .distanceKm(property.getDistanceKm())
                .commuteTimeMin(property.getCommuteTimeMin())
                .commuteMode(property.getCommuteMode())
                .rating(property.getRating())
                .available(property.getAvailable())
                .capacity(property.getCapacity())
                .availabilityStatus(availabilityService.computeStatus(property.getOccupied(), property.getCapacity()))
                .verificationStatus(property.getVerificationStatus())
                .facilities(TagUtils.parseTags(property.getFacilities()))
                .build();
    }

    public PropertySummaryDto toSummary(Property property, int matchScore, String aiExplanation) {
        PropertySummaryDto dto = toSummary(property);
        dto.setMatchScore(matchScore);
        dto.setAiExplanation(aiExplanation);
        return dto;
    }

    public PropertyDetailDto toDetail(Property property, List<Review> reviews) {
        return PropertyDetailDto.builder()
                .id(property.getId())
                .name(property.getName())
                .type(property.getType())
                .address(property.getAddress())
                .locality(property.getLocality())
                .description(property.getDescription())
                .latitude(property.getLatitude())
                .longitude(property.getLongitude())
                .rent(property.getRent())
                .deposit(property.getDeposit())
                .foodCost(property.getFoodCost())
                .electricityCost(property.getElectricityCost())
                .wifiCost(property.getWifiCost())
                .maintenanceCost(property.getMaintenanceCost())
                .effectiveMonthlyCost(effectiveCostService.calculate(property))
                .facilities(TagUtils.parseTags(property.getFacilities()))
                .distanceKm(property.getDistanceKm())
                .commuteTimeMin(property.getCommuteTimeMin())
                .commuteMode(property.getCommuteMode())
                .capacity(property.getCapacity())
                .occupied(property.getOccupied())
                .available(property.getAvailable())
                .availabilityStatus(availabilityService.computeStatus(property.getOccupied(), property.getCapacity()))
                .rating(property.getRating())
                .verificationStatus(property.getVerificationStatus())
                .verificationHash(property.getVerificationHash())
                .verificationTimestamp(property.getVerificationTimestamp())
                .blockchainTx(property.getBlockchainTx())
                .reviews(reviews.stream().map(this::toReviewDto).toList())
                .verification(buildVerificationInfo(property))
                .build();
    }

    public CompareItemDto toCompareItem(Property property, int matchScore) {
        return CompareItemDto.builder()
                .id(property.getId())
                .name(property.getName())
                .matchScore(matchScore)
                .rent(property.getRent())
                .effectiveMonthlyCost(effectiveCostService.calculate(property))
                .deposit(property.getDeposit())
                .distanceKm(property.getDistanceKm())
                .commuteTimeMin(property.getCommuteTimeMin())
                .rating(property.getRating())
                .available(property.getAvailable())
                .availabilityStatus(availabilityService.computeStatus(property.getOccupied(), property.getCapacity()))
                .verificationStatus(property.getVerificationStatus())
                .keyFacilities(TagUtils.parseTags(property.getFacilities()))
                .build();
    }

    private ReviewDto toReviewDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .rating(review.getRating())
                .cleanlinessRating(review.getCleanlinessRating())
                .safetyRating(review.getSafetyRating())
                .foodRating(review.getFoodRating())
                .wifiRating(review.getWifiRating())
                .staffRating(review.getStaffRating())
                .reviewText(review.getReviewText())
                .isDemo(review.getIsDemo())
                .build();
    }

    private VerificationInfoDto buildVerificationInfo(Property property) {
        if (property.getVerificationStatus() != VerificationStatus.VERIFIED) {
            return null;
        }
        String txExplorer = property.getBlockchainTx() != null && !property.getBlockchainTx().isBlank()
                ? explorerUrl + "/tx/" + property.getBlockchainTx()
                : null;
        return VerificationInfoDto.builder()
                .recordHash(property.getVerificationHash())
                .timestamp(property.getVerificationTimestamp())
                .blockchainTx(property.getBlockchainTx())
                .networkName(networkName)
                .contractAddress(contractAddress)
                .explorerUrl(txExplorer)
                .build();
    }
}
