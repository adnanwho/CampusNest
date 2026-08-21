package com.campusnest.property;

import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.campusnest.auth.UserPrincipal;
import com.campusnest.model.Property;
import com.campusnest.model.PropertyType;
import com.campusnest.model.StudentProfile;
import com.campusnest.model.VerificationStatus;
import com.campusnest.property.dto.PropertyDtos.CompareItemDto;
import com.campusnest.property.dto.PropertyDtos.PropertyDetailDto;
import com.campusnest.property.dto.PropertyDtos.PropertySummaryDto;
import com.campusnest.recommendation.RecommendationService;
import com.campusnest.repository.PropertyRepository;
import com.campusnest.repository.ReviewRepository;
import com.campusnest.repository.StudentProfileRepository;
import com.campusnest.student.dto.StudentDtos.PropertySearchParams;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final ReviewRepository reviewRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PropertyMapper propertyMapper;
    private final RecommendationService recommendationService;

    public List<PropertySummaryDto> search(UserPrincipal principal, PropertySearchParams params) {
        StudentProfile profile = profileFor(principal);
        String locality = params != null ? params.getLocality() : null;
        PropertyType type = params != null && params.getType() != null ? PropertyType.valueOf(params.getType().name()) : null;
        Integer minBudget = params != null ? params.getBudgetMin() : null;
        Integer maxBudget = params != null ? params.getBudgetMax() : null;

        return propertyRepository.searchVerifiedAvailable(VerificationStatus.VERIFIED, blankToNull(locality), type, minBudget, maxBudget)
                .stream()
                .map(property -> toScoredSummary(property, profile))
                .sorted(Comparator.comparing(PropertySummaryDto::getMatchScore, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    public List<PropertySummaryDto> recommendations(UserPrincipal principal) {
        StudentProfile profile = profileFor(principal);
        return propertyRepository.searchVerifiedAvailable(VerificationStatus.VERIFIED, null, null, null, null)
                .stream()
                .map(property -> toScoredSummary(property, profile))
                .sorted(Comparator.comparing(PropertySummaryDto::getMatchScore, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    public PropertyDetailDto detail(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));
        if (property.getVerificationStatus() != VerificationStatus.VERIFIED) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found");
        }
        return propertyMapper.toDetail(property, reviewRepository.findByPropertyId(id));
    }

    public List<CompareItemDto> compare(UserPrincipal principal, List<Long> propertyIds) {
        if (propertyIds == null || propertyIds.size() < 2 || propertyIds.size() > 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Compare requires 2 to 3 property IDs");
        }
        StudentProfile profile = profileFor(principal);
        List<Property> properties = propertyRepository.findAllById(propertyIds);
        if (properties.size() != propertyIds.size()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "One or more properties were not found");
        }
        List<Property> eligible = properties.stream()
                .filter(property -> property.getVerificationStatus() == VerificationStatus.VERIFIED)
                .filter(property -> property.getAvailable() != null && property.getAvailable() > 0)
                .toList();
        if (eligible.size() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Comparison requires at least 2 verified, available properties; found " + eligible.size());
        }
        return eligible.stream()
                .map(property -> propertyMapper.toCompareItem(property, recommendationService.score(property, profile)))
                .toList();
    }

    private PropertySummaryDto toScoredSummary(Property property, StudentProfile profile) {
        int score = recommendationService.score(property, profile);
        return propertyMapper.toSummary(property, score, recommendationService.explain(property, profile, score));
    }

    private StudentProfile profileFor(UserPrincipal principal) {
        return studentProfileRepository.findByUserId(principal.getId())
                .orElseGet(() -> StudentProfile.builder().userId(principal.getId()).build());
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
