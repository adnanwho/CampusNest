package com.campusnest.repository;

import com.campusnest.model.VerificationRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VerificationRecordRepository extends JpaRepository<VerificationRecord, Long> {
    Optional<VerificationRecord> findFirstByPropertyIdOrderByTimestampDesc(Long propertyId);
    List<VerificationRecord> findByVerificationStatus(com.campusnest.model.VerificationStatus status);
}
