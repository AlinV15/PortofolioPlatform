package com.example.portofolio.repository;

import com.example.portofolio.entity.ContactInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactInfoRepository extends JpaRepository<ContactInfo, Long> {

    // Basic queries
    Optional<ContactInfo> findByPersonalId(Long personalId);

    Optional<ContactInfo> findByEmail(String email);

    // Optimized queries
    @Query("SELECT ci FROM ContactInfo ci " +
            "LEFT JOIN FETCH ci.contactLocation " +
            "WHERE ci.personal.id = :personalId")
    Optional<ContactInfo> findByPersonalIdWithLocation(@Param("personalId") Long personalId);

    @Query("SELECT ci FROM ContactInfo ci " +
            "LEFT JOIN FETCH ci.personal " +
            "LEFT JOIN FETCH ci.contactLocation " +
            "WHERE ci.id = :id")
    Optional<ContactInfo> findByIdWithPersonalAndLocation(@Param("id") Long id);

    // Validation queries
    boolean existsByEmail(String email);

    boolean existsByEmailAndPersonalIdNot(String email, Long personalId);

    boolean existsByPhone(String phone);

    boolean existsByGithub(String github);

    boolean existsByLinkedin(String linkedin);

    // Social media queries
    @Query("SELECT ci FROM ContactInfo ci " +
            "WHERE ci.github IS NOT NULL AND ci.github != ''")
    List<ContactInfo> findAllWithGithub();

    @Query("SELECT ci FROM ContactInfo ci " +
            "WHERE ci.linkedin IS NOT NULL AND ci.linkedin != ''")
    List<ContactInfo> findAllWithLinkedin();

    @Query("SELECT ci FROM ContactInfo ci " +
            "WHERE ci.website IS NOT NULL AND ci.website != ''")
    List<ContactInfo> findAllWithWebsite();

    // Search by partial contact info
    @Query("SELECT ci FROM ContactInfo ci " +
            "WHERE LOWER(ci.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(ci.phone) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<ContactInfo> findByEmailOrPhoneContaining(@Param("search") String search);

    // Statistics
    @Query("SELECT COUNT(ci) FROM ContactInfo ci WHERE ci.email IS NOT NULL")
    Long countWithEmail();

    @Query("SELECT COUNT(ci) FROM ContactInfo ci WHERE ci.phone IS NOT NULL")
    Long countWithPhone();

    @Query("SELECT COUNT(ci) FROM ContactInfo ci WHERE ci.github IS NOT NULL")
    Long countWithGithub();

    @Query("SELECT COUNT(ci) FROM ContactInfo ci WHERE ci.linkedin IS NOT NULL")
    Long countWithLinkedin();


}