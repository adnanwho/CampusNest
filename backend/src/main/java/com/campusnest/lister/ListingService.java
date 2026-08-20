package com.campusnest.lister;

import com.campusnest.auth.UserPrincipal;
import com.campusnest.common.AvailabilityService;
import com.campusnest.common.TagUtils;
import com.campusnest.lister.dto.ListingDtos.ListingRequest;
import com.campusnest.model.Property;
import com.campusnest.model.VerificationStatus;
import com.campusnest.property.PropertyMapper;
import com.campusnest.property.dto.PropertyDtos.PropertySummaryDto;
import com.campusnest.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final PropertyRepository propertyRepository;
    private final PropertyMapper propertyMapper;
    private final AvailabilityService availabilityService;

    public List<PropertySummaryDto> getMyListings(UserPrincipal principal) {
        return propertyRepository.findByListerId(principal.getId()).stream()
                .map(propertyMapper::toSummary)
                .toList();
    }

    @Transactional
    public PropertySummaryDto createListing(UserPrincipal principal, ListingRequest request) {
        validateOccupancy(request.getOccupied(), request.getCapacity());
        Property property = Property.builder()
                .listerId(principal.getId())
                .name(request.getName())
                .type(request.getType())
                .address(request.getAddress())
                .locality(request.getLocality())
                .description(request.getDescription())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .rent(request.getRent())
                .deposit(defaultInt(request.getDeposit()))
                .foodCost(defaultInt(request.getFoodCost()))
                .electricityCost(defaultInt(request.getElectricityCost()))
                .wifiCost(defaultInt(request.getWifiCost()))
                .maintenanceCost(defaultInt(request.getMaintenanceCost()))
                .facilities(TagUtils.joinTags(request.getFacilities()))
                .distanceKm(request.getDistanceKm())
                .commuteTimeMin(request.getCommuteTimeMin())
                .commuteMode(request.getCommuteMode())
                .capacity(request.getCapacity())
                .occupied(defaultInt(request.getOccupied()))
                .verificationStatus(VerificationStatus.DRAFT)
                .build();
        availabilityService.refreshAvailability(property);
        property = propertyRepository.save(property);
        return propertyMapper.toSummary(property);
    }

    @Transactional
    public PropertySummaryDto updateListing(UserPrincipal principal, Long id, ListingRequest request) {
        Property property = getOwnedProperty(principal, id);
        if (property.getVerificationStatus() == VerificationStatus.VERIFIED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Verified listings cannot be fully edited in MVP");
        }
        validateOccupancy(request.getOccupied(), request.getCapacity());
        property.setName(request.getName());
        property.setType(request.getType());
        property.setAddress(request.getAddress());
        property.setLocality(request.getLocality());
        property.setDescription(request.getDescription());
        property.setLatitude(request.getLatitude());
        property.setLongitude(request.getLongitude());
        property.setRent(request.getRent());
        property.setDeposit(defaultInt(request.getDeposit()));
        property.setFoodCost(defaultInt(request.getFoodCost()));
        property.setElectricityCost(defaultInt(request.getElectricityCost()));
        property.setWifiCost(defaultInt(request.getWifiCost()));
        property.setMaintenanceCost(defaultInt(request.getMaintenanceCost()));
        property.setFacilities(TagUtils.joinTags(request.getFacilities()));
        property.setDistanceKm(request.getDistanceKm());
        property.setCommuteTimeMin(request.getCommuteTimeMin());
        property.setCommuteMode(request.getCommuteMode());
        property.setCapacity(request.getCapacity());
        property.setOccupied(defaultInt(request.getOccupied()));
        availabilityService.refreshAvailability(property);
        if (property.getVerificationStatus() == VerificationStatus.REJECTED) {
            property.setVerificationStatus(VerificationStatus.DRAFT);
            property.setRejectionReason(null);
        }
        property = propertyRepository.save(property);
        return propertyMapper.toSummary(property);
    }

    @Transactional
    public PropertySummaryDto updateAvailability(UserPrincipal principal, Long id, int occupied) {
        Property property = getOwnedProperty(principal, id);
        validateOccupancy(occupied, property.getCapacity());
        property.setOccupied(occupied);
        availabilityService.refreshAvailability(property);
        property = propertyRepository.save(property);
        return propertyMapper.toSummary(property);
    }

    @Transactional
    public PropertySummaryDto submitForVerification(UserPrincipal principal, Long id) {
        Property property = getOwnedProperty(principal, id);
        if (property.getLatitude() == null || property.getLongitude() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Coordinates are required before verification submission");
        }
        if (property.getVerificationStatus() != VerificationStatus.DRAFT
                && property.getVerificationStatus() != VerificationStatus.REJECTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Listing cannot be submitted in current status");
        }
        property.setVerificationStatus(VerificationStatus.SUBMITTED_FOR_VERIFICATION);
        property.setRejectionReason(null);
        property = propertyRepository.save(property);
        return propertyMapper.toSummary(property);
    }

    private Property getOwnedProperty(UserPrincipal principal, Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found"));
        if (!property.getListerId().equals(principal.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only modify your own listings");
        }
        return property;
    }

    private void validateOccupancy(Integer occupied, Integer capacity) {
        int occ = defaultInt(occupied);
        if (capacity != null && occ > capacity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Occupied count cannot exceed capacity");
        }
    }

    private int defaultInt(Integer value) {
        return value == null ? 0 : value;
    }
}
