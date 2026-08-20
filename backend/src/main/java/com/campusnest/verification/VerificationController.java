package com.campusnest.verification;

import com.campusnest.model.VerificationRecord;
import com.campusnest.property.dto.PropertyDtos.VerificationInfoDto;
import com.campusnest.repository.VerificationRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationRecordRepository verificationRecordRepository;

    @Value("${campusnest.blockchain.network-name}")
    private String networkName;

    @Value("${campusnest.blockchain.contract-address:}")
    private String contractAddress;

    @Value("${campusnest.blockchain.explorer-url}")
    private String explorerUrl;

    @GetMapping("/{propertyId}")
    public VerificationInfoDto latest(@PathVariable Long propertyId) {
        VerificationRecord record = verificationRecordRepository.findFirstByPropertyIdOrderByTimestampDesc(propertyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Verification record not found"));
        String txUrl = record.getBlockchainTx() == null ? null : explorerUrl + "/tx/" + record.getBlockchainTx();
        return VerificationInfoDto.builder()
                .recordHash(record.getRecordHash())
                .timestamp(record.getTimestamp())
                .blockchainTx(record.getBlockchainTx())
                .networkName(networkName)
                .contractAddress(contractAddress)
                .explorerUrl(txUrl)
                .build();
    }
}
