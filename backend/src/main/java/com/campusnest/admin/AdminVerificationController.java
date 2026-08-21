package com.campusnest.admin;

import com.campusnest.auth.UserPrincipal;
import com.campusnest.lister.dto.ListingDtos.RejectRequest;
import com.campusnest.property.dto.PropertyDtos.PropertySummaryDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/verifications")
@RequiredArgsConstructor
public class AdminVerificationController {

    private final AdminVerificationService verificationService;

    @GetMapping("/pending")
    public List<PropertySummaryDto> pending() {
        return verificationService.pending();
    }

    @GetMapping("/all")
    public List<PropertySummaryDto> all() {
        return verificationService.all();
    }

    @PostMapping("/{id}/review")
    public PropertySummaryDto markUnderReview(@PathVariable Long id) {
        return verificationService.markUnderReview(id);
    }

    @PostMapping("/{id}/approve")
    public PropertySummaryDto approve(@AuthenticationPrincipal UserPrincipal admin, @PathVariable Long id) {
        return verificationService.approve(admin, id);
    }

    @PostMapping("/{id}/reject")
    public PropertySummaryDto reject(@AuthenticationPrincipal UserPrincipal admin,
                                     @PathVariable Long id,
                                     @Valid @RequestBody RejectRequest request) {
        return verificationService.reject(admin, id, request);
    }
}
