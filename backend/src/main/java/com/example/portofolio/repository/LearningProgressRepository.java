package com.example.portofolio.repository;

import com.example.portofolio.entity.LearningProgress;
import com.example.portofolio.entity.enums.LearningStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LearningProgressRepository extends JpaRepository<LearningProgress, Long> {

    // Basic queries by skill
    List<LearningProgress> findBySkillId(Long skillId);

    List<LearningProgress> findBySkillIdAndStatus(Long skillId, LearningStatus status);

    // Personal queries
    @Query("SELECT lp FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId")
    List<LearningProgress> findByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT lp FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId AND lp.status = :status")
    List<LearningProgress> findByPersonalIdAndStatus(@Param("personalId") Long personalId,
                                                     @Param("status") LearningStatus status);

    @Query("SELECT lp FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId AND lp.status IN :statuses")
    List<LearningProgress> findByPersonalIdAndStatusIn(@Param("personalId") Long personalId,
                                                       @Param("statuses") List<LearningStatus> statuses);

    // Optimized queries
    @Query("SELECT lp FROM LearningProgress lp " +
            "LEFT JOIN FETCH lp.skill s " +
            "LEFT JOIN FETCH s.category " +
            "WHERE lp.skill.personal.id = :personalId")
    List<LearningProgress> findByPersonalIdWithSkillAndCategory(@Param("personalId") Long personalId);

    @Query("SELECT lp FROM LearningProgress lp " +
            "LEFT JOIN FETCH lp.skill " +
            "WHERE lp.skill.personal.id = :personalId AND lp.status = :status " +
            "ORDER BY lp.progressPercentage DESC")
    List<LearningProgress> findByPersonalIdAndStatusWithSkill(@Param("personalId") Long personalId,
                                                              @Param("status") LearningStatus status);

    // Current learning
    @Query("SELECT lp FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId " +
            "AND lp.status = 'IN_PROGRESS' " +
            "ORDER BY lp.progressPercentage DESC, lp.startDate DESC")
    List<LearningProgress> findCurrentLearningByPersonalId(@Param("personalId") Long personalId);

    // Completed learning
    @Query("SELECT lp FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId " +
            "AND lp.status = 'COMPLETED' " +
            "ORDER BY lp.completionDate DESC")
    List<LearningProgress> findCompletedLearningByPersonalId(@Param("personalId") Long personalId);

    // Progress tracking
    @Query("SELECT lp FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId " +
            "AND lp.progressPercentage >= :minProgress " +
            "ORDER BY lp.progressPercentage DESC")
    List<LearningProgress> findByPersonalIdAndMinProgress(@Param("personalId") Long personalId,
                                                          @Param("minProgress") Integer minProgress);

    // Time-based queries
    @Query("SELECT lp FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId " +
            "AND lp.startDate >= :since " +
            "ORDER BY lp.startDate DESC")
    List<LearningProgress> findRecentLearningByPersonalId(@Param("personalId") Long personalId,
                                                          @Param("since") LocalDateTime since);

    // Technology-related learning
    @Query("SELECT lp FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId " +
            "AND EXISTS (SELECT 1 FROM EntityTechnology et " +
            "            WHERE et.technology.id = :technologyId " +
            "            AND et.entityType = 'SKILL' AND et.entityId = lp.skill.id)")
    List<LearningProgress> findByPersonalIdAndTechnologyId(@Param("personalId") Long personalId,
                                                           @Param("technologyId") Long technologyId);

    @Query("SELECT COUNT(lp) > 0 FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId " +
            "AND lp.status = :status " +
            "AND EXISTS (SELECT 1 FROM EntityTechnology et " +
            "            WHERE et.technology.id = :technologyId " +
            "            AND et.entityType = 'SKILL' AND et.entityId = lp.skill.id)")
    boolean existsByPersonalIdAndTechnologyIdAndStatus(@Param("personalId") Long personalId,
                                                       @Param("technologyId") Long technologyId,
                                                       @Param("status") LearningStatus status);

    // Statistics
    @Query("SELECT COUNT(lp) FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId")
    Long countByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT lp.status, COUNT(lp) FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId " +
            "GROUP BY lp.status")
    List<Object[]> countLearningProgressByStatus(@Param("personalId") Long personalId);

    @Query("SELECT AVG(lp.progressPercentage) FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId AND lp.status = 'IN_PROGRESS'")
    Double findAverageProgressByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT SUM(lp.timeSpentHours) FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId")
    Double findTotalTimeSpentByPersonalId(@Param("personalId") Long personalId);

    // Search
    @Query("SELECT lp FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId " +
            "AND (LOWER(lp.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(lp.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(lp.skill.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<LearningProgress> findByPersonalIdAndSearchTerm(@Param("personalId") Long personalId,
                                                         @Param("search") String search);

    @Query("SELECT lp FROM LearningProgress lp WHERE lp.skill.personal.id = :personalId " +
            "AND lp.status IN ('IN_PROGRESS', 'NOT_STARTED')")
    List<LearningProgress> findActiveByPersonalId(@Param("personalId") Long personalId);
}