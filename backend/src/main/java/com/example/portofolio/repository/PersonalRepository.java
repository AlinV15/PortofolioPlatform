package com.example.portofolio.repository;

import com.example.portofolio.entity.Personal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonalRepository extends JpaRepository<Personal, Long> {

    Optional<Personal> findByFirstNameAndLastName(String firstName, String lastName);

    @Query("SELECT p FROM Personal p " +
            "LEFT JOIN FETCH p.contactInfo ci " +
            "LEFT JOIN FETCH ci.contactLocation " +
            "WHERE p.id = :id")
    Optional<Personal> findByIdWithContactInfo(@Param("id") Long id);

    @Query("SELECT p FROM Personal p " +
            "LEFT JOIN FETCH p.skills s " +
            "LEFT JOIN FETCH s.category " +
            "WHERE p.id = :id")
    Optional<Personal> findByIdWithSkills(@Param("id") Long id);

    @Query("SELECT p FROM Personal p " +
            "LEFT JOIN FETCH p.projects pr " +
            "WHERE p.id = :id")
    Optional<Personal> findByIdWithProjects(@Param("id") Long id);

    @Query("SELECT p FROM Personal p " +
            "LEFT JOIN FETCH p.certificates " +
            "WHERE p.id = :id")
    Optional<Personal> findByIdWithCertificates(@Param("id") Long id);

    // Pentru dashboard/statistics
    @Query("SELECT COUNT(p) FROM Personal p")
    Long countTotalPersonals();

    boolean existsByFirstNameAndLastName(String firstName, String lastName);
}