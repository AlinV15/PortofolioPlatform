package com.example.portofolio.repository;

import com.example.portofolio.entity.ContactLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContactLocationRepository extends JpaRepository<ContactLocation, Long> {

    // Basic queries
    Optional<ContactLocation> findByContactInfoId(Long contactInfoId);

}