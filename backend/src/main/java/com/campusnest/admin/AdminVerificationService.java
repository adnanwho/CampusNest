package com.campusnest.admin;

import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.campusnest.auth.UserPrincipal;
import com.campusnest.blockchain.BlockchainService;
import com.campusnest.lister.dto.ListingDtos.RejectRequest;
import com.campusnest.model.Property;
import com.campusnest.model.VerificationRecord;
import com.campusnest.model.VerificationStatus;
import com.campusnest.property.PropertyMapper;
import com.campusnest.property.dto.PropertyDtos.PropertySummaryDto;
import com.campusnest.repository.PropertyRepository;
import com.campusnest.repository.VerificationRecordRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminVerificationService {

    private final PropertyRepository propertyRepository;
    private final VerificationRecordRepository verificationRecordRepository;
    private final BlockchainService blockchainService;
    private final PropertyMapper propertyMapper;

    public List<PropertySummaryDto> pending() {
        return propertyRepository.findByVerificationStatusIn(List.of(
                VerificationStatus.SUBMITTED_FOR_VERIFICATION,
                VerificationStatus.UNDER_REVIEW
        )).stream().map(propertyMapper::toSummary).toList();
    }

    public List<PropertySummaryDto> all() {
        return propertyRepository.findAll().stream().map(propertyMapper::toSummary).toList();
    }

    @Transactional
    public PropertySummaryDto markUnderReview(Long id) {
        Property property = getPendingProperty(id);
        property.setVerificationStatus(VerificationStatus.UNDER_REVIEW);
        return propertyMapper.toSummary(propertyRepository.save(property));
    }

    @Transactional
    public PropertySummaryDto approve(UserPrincipal admin, Long id) {
        Property property = getPendingProperty(id);
        Instant now = Instant.now();
        String hash = blockchainService.computeCanonicalHash(property, String.valueOf(admin.getId()), VerificationStatus.VERIFIED, now);
        BlockchainService.BlockchainResult chain = blockchainService.registerVerification(property.getId(), hash);

        property.setVerificationStatus(VerificationStatus.VERIFIED);
        property.setVerificationHash(hash);
        property.setVerificationTimestamp(now);
        property.setBlockchainTx(chain.transactionHash());
        property.setRejectionReason(null);
        property = propertyRepository.save(property);

        verificationRecordRepository.save(VerificationRecord.builder()
                .propertyId(property.getId())
                .listerId(property.getListerId())
                .verificationStatus(VerificationStatus.VERIFIED)
                .recordHash(hash)
                .timestamp(now)
                .blockchainTx(chain.transactionHash())
                .reviewedBy(admin.getId())
                .build());

        return propertyMapper.toSummary(property);
    }

    @Transactional
    public PropertySummaryDto reject(UserPrincipal admin, Long id, RejectRequest request) {
        Property property = getPendingProperty(id);
        Instant now = Instant.now();
        String hash = blockchainService.computeCanonicalHash(property, String.valueOf(admin.getId()), VerificationStatus.REJECTED, now);
        property.setVerificationStatus(VerificationStatus.REJECTED);
        property.setRejectionReason(request.getReason());
        property = propertyRepository.save(property);

        verificationRecordRepository.save(VerificationRecord.builder()
                .propertyId(property.getId())
                .listerId(property.getListerId())
                .verificationStatus(VerificationStatus.REJECTED)
                .recordHash(hash)
                .timestamp(now)
                .reviewedBy(admin.getId())
                .rejectionReason(request.getReason())
                .build());

        return propertyMapper.toSummary(property);
    }

    private Property getPendingProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found"));
        if (property.getVerificationStatus() != VerificationStatus.SUBMITTED_FOR_VERIFICATION
                && property.getVerificationStatus() != VerificationStatus.UNDER_REVIEW) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Listing is not pending verification");
        }
        return property;
    }
}
