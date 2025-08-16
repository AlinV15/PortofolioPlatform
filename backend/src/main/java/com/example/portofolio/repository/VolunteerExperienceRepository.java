package com.example.portofolio.repository;

import com.example.portofolio.entity.VolunteerExperience;
import com.example.portofolio.entity.enums.VolunteerStatus;
import com.example.portofolio.entity.enums.VolunteerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface VolunteerExperienceRepository extends JpaRepository<VolunteerExperience, Long> {

    // Basic queries
    List<VolunteerExperience> findByPersonalId(Long personalId);

    List<VolunteerExperience> findByPersonalIdAndStatus(Long personalId, VolunteerStatus status);

    List<VolunteerExperience> findByPersonalIdAndType(Long personalId, VolunteerType type);

    List<VolunteerExperience> findByPersonalIdOrderByStartDateDesc(Long personalId);

    // Optimized queries
    @Query("SELECT ve FROM VolunteerExperience ve " +
            "LEFT JOIN FETCH ve.responsibilities " +
            "WHERE ve.personal.id = :personalId")
    List<VolunteerExperience> findByPersonalIdWithResponsibilities(@Param("personalId") Long personalId);

    @Query("SELECT ve FROM VolunteerExperience ve " +
            "LEFT JOIN FETCH ve.responsibilities r " +
            "WHERE ve.personal.id = :personalId " +
            "ORDER BY ve.startDate DESC")
    List<VolunteerExperience> findByPersonalIdWithResponsibilitiesOrdered(@Param("personalId") Long personalId);

    // Current/Ongoing volunteer work
    @Query("SELECT ve FROM VolunteerExperience ve " +
            "WHERE ve.personal.id = :personalId " +
            "AND ve.status = 'ONGOING' " +
            "ORDER BY ve.startDate DESC")
    List<VolunteerExperience> findOngoingByPersonalId(@Param("personalId") Long personalId);

    // Organization queries
    List<VolunteerExperience> findByPersonalIdAndOrganization(Long personalId, String organization);

    @Query("SELECT ve.organization, COUNT(ve) FROM VolunteerExperience ve " +
            "WHERE ve.personal.id = :personalId " +
            "GROUP BY ve.organization " +
            "ORDER BY COUNT(ve) DESC")
    List<Object[]> countExperiencesByOrganization(@Param("personalId") Long personalId);

    // Location queries
    List<VolunteerExperience> findByPersonalIdAndLocation(Long personalId, String location);

    @Query("SELECT ve.location, COUNT(ve) FROM VolunteerExperience ve " +
            "WHERE ve.personal.id = :personalId AND ve.location IS NOT NULL " +
            "GROUP BY ve.location " +
            "ORDER BY COUNT(ve) DESC")
    List<Object[]> countExperiencesByLocation(@Param("personalId") Long personalId);

    // Featured volunteer experiences
    @Query("SELECT ve FROM VolunteerExperience ve " +
            "JOIN EntityMetadata em ON em.entityType = 'VOLUNTEER' AND em.entityId = ve.id " +
            "WHERE ve.personal.id = :personalId AND em.featured = true " +
            "ORDER BY ve.startDate DESC")
    List<VolunteerExperience> findFeaturedByPersonalId(@Param("personalId") Long personalId);

    // Time-based queries
    @Query("SELECT ve FROM VolunteerExperience ve " +
            "WHERE ve.personal.id = :personalId " +
            "AND ve.startDate >= :since " +
            "ORDER BY ve.startDate DESC")
    List<VolunteerExperience> findRecentByPersonalId(@Param("personalId") Long personalId,
                                                     @Param("since") LocalDate since);

    @Query("SELECT ve FROM VolunteerExperience ve " +
            "WHERE ve.personal.id = :personalId " +
            "AND ve.startDate BETWEEN :startDate AND :endDate " +
            "ORDER BY ve.startDate DESC")
    List<VolunteerExperience> findByPersonalIdAndDateBetween(@Param("personalId") Long personalId,
                                                             @Param("startDate") LocalDate startDate,
                                                             @Param("endDate") LocalDate endDate);

    // Hours tracking
    @Query("SELECT SUM(ve.totalHours) FROM VolunteerExperience ve " +
            "WHERE ve.personal.id = :personalId")
    BigDecimal findTotalHoursByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT SUM(ve.totalHours) FROM VolunteerExperience ve " +
            "WHERE ve.personal.id = :personalId AND ve.status = 'COMPLETED'")
    BigDecimal findCompletedHoursByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT ve FROM VolunteerExperience ve " +
            "WHERE ve.personal.id = :personalId " +
            "AND ve.totalHours >= :minHours " +
            "ORDER BY ve.totalHours DESC")
    List<VolunteerExperience> findByPersonalIdAndMinHours(@Param("personalId") Long personalId,
                                                          @Param("minHours") BigDecimal minHours);

    // Statistics
    @Query("SELECT COUNT(ve) FROM VolunteerExperience ve WHERE ve.personal.id = :personalId")
    Long countByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT ve.type, COUNT(ve) FROM VolunteerExperience ve " +
            "WHERE ve.personal.id = :personalId " +
            "GROUP BY ve.type " +
            "ORDER BY COUNT(ve) DESC")
    List<Object[]> countExperiencesByType(@Param("personalId") Long personalId);

    @Query("SELECT ve.status, COUNT(ve) FROM VolunteerExperience ve " +
            "WHERE ve.personal.id = :personalId " +
            "GROUP BY ve.status")
    List<Object[]> countExperiencesByStatus(@Param("personalId") Long personalId);

    @Query("SELECT YEAR(ve.startDate) as year, COUNT(ve) FROM VolunteerExperience ve " +
            "WHERE ve.personal.id = :personalId " +
            "GROUP BY YEAR(ve.startDate) " +
            "ORDER BY year DESC")
    List<Object[]> getVolunteerTimelineByPersonalId(@Param("personalId") Long personalId);

    // Search
    @Query("SELECT ve FROM VolunteerExperience ve " +
            "WHERE ve.personal.id = :personalId " +
            "AND (LOWER(ve.organization) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(ve.role) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(ve.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<VolunteerExperience> findByPersonalIdAndSearchTerm(@Param("personalId") Long personalId,
                                                            @Param("search") String search);

    // Validation
    boolean existsByPersonalIdAndOrganizationAndRole(Long personalId, String organization, String role);
    /**
     * Numără orele totale de voluntariat
     */
    @Query("SELECT COALESCE(SUM(ve.totalHours), 0) FROM VolunteerExperience ve " +
            "WHERE ve.personal.id = :personalId")
    Double getTotalVolunteerHours(@Param("personalId") Long personalId);

    /**
     * Găsește organizațiile distincte
     */
    @Query("SELECT DISTINCT ve.organization FROM VolunteerExperience ve " +
            "WHERE ve.personal.id = :personalId " +
            "ORDER BY ve.organization")
    List<String> findDistinctOrganizationsByPersonalId(@Param("personalId") Long personalId);
}