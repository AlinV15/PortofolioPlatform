package com.example.portofolio.repository;

import com.example.portofolio.entity.ContactInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContactInfoRepository extends JpaRepository<ContactInfo, Long> {

    // Basic queries
    Optional<ContactInfo> findByPersonalId(Long personalId);

}