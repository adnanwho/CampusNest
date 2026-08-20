package com.campusnest.repository;

import com.campusnest.model.Property;
import com.campusnest.model.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByListerId(Long listerId);

    List<Property> findByVerificationStatus(VerificationStatus status);

    List<Property> findByVerificationStatusIn(List<VerificationStatus> statuses);

    @Query("""
        SELECT p FROM Property p
        WHERE p.verificationStatus = :status
        AND (:locality IS NULL OR LOWER(p.locality) LIKE LOWER(CONCAT('%', :locality, '%')))
        AND (:type IS NULL OR p.type = :type)
        AND (:minBudget IS NULL OR (p.rent + p.foodCost + p.electricityCost + p.wifiCost + p.maintenanceCost) >= :minBudget)
        AND (:maxBudget IS NULL OR (p.rent + p.foodCost + p.electricityCost + p.wifiCost + p.maintenanceCost) <= :maxBudget)
        AND p.available > 0
        """)
    List<Property> searchVerifiedAvailable(
            @Param("status") VerificationStatus status,
            @Param("locality") String locality,
            @Param("type") com.campusnest.model.PropertyType type,
            @Param("minBudget") Integer minBudget,
            @Param("maxBudget") Integer maxBudget
    );
}
