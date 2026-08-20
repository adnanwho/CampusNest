package com.campusnest.repository;

import com.campusnest.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPropertyId(Long propertyId);
}
