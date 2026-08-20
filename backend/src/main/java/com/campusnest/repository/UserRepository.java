package com.campusnest.repository;

import com.campusnest.model.User;
import com.campusnest.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByEmailAndRole(String email, UserRole role);
}
