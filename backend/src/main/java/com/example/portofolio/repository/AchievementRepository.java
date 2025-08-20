package com.example.portofolio.repository;

import com.example.portofolio.entity.Achievement;
import com.example.portofolio.entity.enums.EntityType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {

    // Basic queries
    List<Achievement> findByPersonalId(Long personalId);

    List<Achievement> findByPersonalIdOrderByAchievementDateDesc(Long personalId);

    // Entity-related achievements
    List<Achievement> findByPersonalIdAndEntityTypeAndEntityId(Long personalId,
                                                               EntityType entityType,
                                                               Long entityId);

    // Featured achievements
    @Query("SELECT a FROM Achievement a " +
            "JOIN EntityMetadata em ON em.entityType = 'ACHIEVEMENT' AND em.entityId = a.id " +
            "WHERE a.personal.id = :personalId AND em.featured = true " +
            "ORDER BY a.recognitionLevel DESC, a.achievementDate DESC")
    List<Achievement> findFeaturedByPersonalId(@Param("personalId") Long personalId);

    // Statistics
    @Query("SELECT COUNT(a) FROM Achievement a WHERE a.personal.id = :personalId")
    Long countByPersonalId(@Param("personalId") Long personalId);

    // Search
    @Query("SELECT a FROM Achievement a " +
            "WHERE a.personal.id = :personalId " +
            "AND (LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(a.awardBody) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Achievement> findByPersonalIdAndSearchTerm(@Param("personalId") Long personalId,
                                                    @Param("search") String search);


    @Query("SELECT a FROM Achievement a JOIN EntityMetadata em ON em.entityType = 'ACHIEVEMENT' AND em.entityId = a.id " +
            "WHERE a.personal.id = :personalId AND em.featured = true ORDER BY a.achievementDate DESC")
    List<Achievement> findFeaturedByPersonalId(@Param("personalId") Long personalId, Pageable pageable);


}