package com.example.portofolio.repository;

import com.example.portofolio.entity.Achievement;
import com.example.portofolio.entity.enums.AchievementType;
import com.example.portofolio.entity.enums.EntityType;
import com.example.portofolio.entity.enums.RecognitionLevel;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {

    // Basic queries
    List<Achievement> findByPersonalId(Long personalId);

    List<Achievement> findByPersonalIdAndAchievementType(Long personalId, AchievementType type);

    List<Achievement> findByPersonalIdAndAchievementTypeIn(Long personalId, List<AchievementType> types);

    List<Achievement> findByPersonalIdOrderByAchievementDateDesc(Long personalId);

    List<Achievement> findByPersonalIdOrderByAchievementDateDesc(Long personalId, Pageable pageable);

    // Recognition level queries
    List<Achievement> findByPersonalIdAndRecognitionLevel(Long personalId, RecognitionLevel level);

    @Query("SELECT a FROM Achievement a " +
            "WHERE a.personal.id = :personalId " +
            "AND a.recognitionLevel IN ('NATIONAL', 'INTERNATIONAL') " +
            "ORDER BY a.recognitionLevel DESC, a.achievementDate DESC")
    List<Achievement> findHighRecognitionByPersonalId(@Param("personalId") Long personalId);

    // Entity-related achievements
    List<Achievement> findByPersonalIdAndEntityTypeAndEntityId(Long personalId,
                                                               EntityType entityType,
                                                               Long entityId);

    @Query("SELECT a FROM Achievement a " +
            "WHERE a.personal.id = :personalId " +
            "AND a.entityType = :entityType " +
            "ORDER BY a.achievementDate DESC")
    List<Achievement> findByPersonalIdAndEntityType(@Param("personalId") Long personalId,
                                                    @Param("entityType") EntityType entityType);

    // Featured achievements
    @Query("SELECT a FROM Achievement a " +
            "JOIN EntityMetadata em ON em.entityType = 'ACHIEVEMENT' AND em.entityId = a.id " +
            "WHERE a.personal.id = :personalId AND em.featured = true " +
            "ORDER BY a.recognitionLevel DESC, a.achievementDate DESC")
    List<Achievement> findFeaturedByPersonalId(@Param("personalId") Long personalId);

    // Recent achievements
    @Query("SELECT a FROM Achievement a " +
            "WHERE a.personal.id = :personalId " +
            "AND a.achievementDate >= :since " +
            "ORDER BY a.achievementDate DESC")
    List<Achievement> findRecentByPersonalId(@Param("personalId") Long personalId,
                                             @Param("since") LocalDate since);

    // Date range queries
    @Query("SELECT a FROM Achievement a " +
            "WHERE a.personal.id = :personalId " +
            "AND a.achievementDate BETWEEN :startDate AND :endDate " +
            "ORDER BY a.achievementDate DESC")
    List<Achievement> findByPersonalIdAndDateBetween(@Param("personalId") Long personalId,
                                                     @Param("startDate") LocalDate startDate,
                                                     @Param("endDate") LocalDate endDate);

    // Year-based queries
    @Query("SELECT a FROM Achievement a " +
            "WHERE a.personal.id = :personalId " +
            "AND YEAR(a.achievementDate) = :year " +
            "ORDER BY a.achievementDate DESC")
    List<Achievement> findByPersonalIdAndYear(@Param("personalId") Long personalId,
                                              @Param("year") Integer year);

    @Query("SELECT YEAR(a.achievementDate) as year, COUNT(a) FROM Achievement a " +
            "WHERE a.personal.id = :personalId " +
            "GROUP BY YEAR(a.achievementDate) " +
            "ORDER BY year DESC")
    List<Object[]> getAchievementTimelineByPersonalId(@Param("personalId") Long personalId);

    // Award body queries
    List<Achievement> findByPersonalIdAndAwardBody(Long personalId, String awardBody);

    @Query("SELECT a.awardBody, COUNT(a) FROM Achievement a " +
            "WHERE a.personal.id = :personalId AND a.awardBody IS NOT NULL " +
            "GROUP BY a.awardBody " +
            "ORDER BY COUNT(a) DESC")
    List<Object[]> countAchievementsByAwardBody(@Param("personalId") Long personalId);

    // Statistics
    @Query("SELECT COUNT(a) FROM Achievement a WHERE a.personal.id = :personalId")
    Long countByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT a.achievementType, COUNT(a) FROM Achievement a " +
            "WHERE a.personal.id = :personalId " +
            "GROUP BY a.achievementType " +
            "ORDER BY COUNT(a) DESC")
    List<Object[]> countAchievementsByType(@Param("personalId") Long personalId);

    @Query("SELECT a.recognitionLevel, COUNT(a) FROM Achievement a " +
            "WHERE a.personal.id = :personalId " +
            "GROUP BY a.recognitionLevel " +
            "ORDER BY a.recognitionLevel DESC")
    List<Object[]> countAchievementsByRecognitionLevel(@Param("personalId") Long personalId);

    // Search
    @Query("SELECT a FROM Achievement a " +
            "WHERE a.personal.id = :personalId " +
            "AND (LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(a.awardBody) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Achievement> findByPersonalIdAndSearchTerm(@Param("personalId") Long personalId,
                                                    @Param("search") String search);

    // Certificate URL validation
    boolean existsByCertificateUrl(String certificateUrl);


    @Query("SELECT a FROM Achievement a JOIN EntityMetadata em ON em.entityType = 'ACHIEVEMENT' AND em.entityId = a.id " +
            "WHERE a.personal.id = :personalId AND em.featured = true ORDER BY a.achievementDate DESC")
    List<Achievement> findFeaturedByPersonalId(@Param("personalId") Long personalId, Pageable pageable);


}