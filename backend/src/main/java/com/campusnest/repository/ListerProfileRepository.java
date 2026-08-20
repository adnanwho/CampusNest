package com.campusnest.repository;

import com.campusnest.model.ListerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ListerProfileRepository extends JpaRepository<ListerProfile, Long> {
    Optional<ListerProfile> findByUserId(Long userId);
}
