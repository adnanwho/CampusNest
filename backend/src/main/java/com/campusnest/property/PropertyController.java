package com.campusnest.property;

import com.campusnest.auth.UserPrincipal;
import com.campusnest.property.dto.PropertyDtos.CompareItemDto;
import com.campusnest.property.dto.PropertyDtos.CompareRequest;
import com.campusnest.property.dto.PropertyDtos.PropertyDetailDto;
import com.campusnest.property.dto.PropertyDtos.PropertySummaryDto;
import com.campusnest.student.dto.StudentDtos.PropertySearchParams;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping("/properties")
    public List<PropertySummaryDto> search(@AuthenticationPrincipal UserPrincipal principal,
                                           @ModelAttribute PropertySearchParams params) {
        return propertyService.search(principal, params);
    }

    @GetMapping("/properties/{id}")
    public PropertyDetailDto detail(@PathVariable Long id) {
        return propertyService.detail(id);
    }

    @GetMapping("/recommendations")
    public List<PropertySummaryDto> recommendations(@AuthenticationPrincipal UserPrincipal principal) {
        return propertyService.recommendations(principal);
    }

    @PostMapping("/properties/compare")
    public List<CompareItemDto> compare(@AuthenticationPrincipal UserPrincipal principal,
                                        @Valid @RequestBody CompareRequest request) {
        return propertyService.compare(principal, request.getPropertyIds());
    }
}
