package com.campusnest.lister;

import com.campusnest.auth.UserPrincipal;
import com.campusnest.lister.dto.ListingDtos.ListingRequest;
import com.campusnest.lister.dto.ListingDtos.AvailabilityUpdateRequest;
import com.campusnest.property.dto.PropertyDtos.PropertySummaryDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @GetMapping("/mine")
    public List<PropertySummaryDto> myListings(@AuthenticationPrincipal UserPrincipal principal) {
        return listingService.getMyListings(principal);
    }

    @PostMapping
    public PropertySummaryDto create(@AuthenticationPrincipal UserPrincipal principal,
                                     @Valid @RequestBody ListingRequest request) {
        return listingService.createListing(principal, request);
    }

    @PutMapping("/{id}")
    public PropertySummaryDto update(@AuthenticationPrincipal UserPrincipal principal,
                                     @PathVariable Long id,
                                     @Valid @RequestBody ListingRequest request) {
        return listingService.updateListing(principal, id, request);
    }

    @PutMapping("/{id}/availability")
    public PropertySummaryDto updateAvailability(@AuthenticationPrincipal UserPrincipal principal,
                                                 @PathVariable Long id,
                                                 @Valid @RequestBody AvailabilityUpdateRequest request) {
        return listingService.updateAvailability(principal, id, request.getOccupied());
    }

    @PostMapping("/{id}/verify")
    public PropertySummaryDto submitForVerification(@AuthenticationPrincipal UserPrincipal principal,
                                                      @PathVariable Long id) {
        return listingService.submitForVerification(principal, id);
    }
}
