package com.campusnest.property;

import com.campusnest.auth.UserPrincipal;
import com.campusnest.model.*;
import com.campusnest.property.dto.PropertyDtos.CompareItemDto;
import com.campusnest.property.dto.PropertyDtos.PropertyDetailDto;
import com.campusnest.property.dto.PropertyDtos.PropertySummaryDto;
import com.campusnest.recommendation.RecommendationService;
import com.campusnest.repository.PropertyRepository;
import com.campusnest.repository.ReviewRepository;
import com.campusnest.repository.StudentProfileRepository;
import com.campusnest.student.dto.StudentDtos.PropertySearchParams;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

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
        String locality = params.getLocality() != null ? params.getLocality() : profile.getLocalityPref();
        PropertyType type = params.getType() != null ? PropertyType.valueOf(params.getType().name())
                : profile.getAccommodationType() != null ? PropertyType.valueOf(profile.getAccommodationType().name()) : null;
        Integer minBudget = params.getBudgetMin() != null ? params.getBudgetMin() : profile.getBudgetMin();
        Integer maxBudget = params.getBudgetMax() != null ? params.getBudgetMax() : profile.getBudgetMax();

        return propertyRepository.searchVerifiedAvailable(VerificationStatus.VERIFIED, blankToNull(locality), type, minBudget, maxBudget)
                .stream()
                .map(property -> toScoredSummary(property, profile))
                .sorted(Comparator.comparing(PropertySummaryDto::getMatchScore, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    public List<PropertySummaryDto> recommendations(UserPrincipal principal) {
        PropertySearchParams params = new PropertySearchParams();
        return search(principal, params);
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
        return properties.stream()
                .filter(property -> property.getVerificationStatus() == VerificationStatus.VERIFIED)
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
