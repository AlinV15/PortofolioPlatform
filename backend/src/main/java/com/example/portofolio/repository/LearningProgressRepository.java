package com.example.portofolio.repository;

import com.example.portofolio.entity.LearningProgress;
import com.example.portofolio.entity.enums.LearningStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningProgressRepository extends JpaRepository<LearningProgress, Long> {

    List<LearningProgress> findBySkillIdAndStatus(Long skillId, LearningStatus status);

    // Personal queries
    @Query("SELECT lp FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId")
    List<LearningProgress> findByPersonalId(@Param("personalId") Long personalId);

    // Optimized queries
    @Query("SELECT lp FROM LearningProgress lp " +
            "LEFT JOIN FETCH lp.skill s " +
            "LEFT JOIN FETCH s.category " +
            "WHERE lp.skill.personal.id = :personalId")
    List<LearningProgress> findByPersonalIdWithSkillAndCategory(@Param("personalId") Long personalId);

    // Completed learning
    @Query("SELECT lp FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId " +
            "AND lp.status = 'COMPLETED' " +
            "ORDER BY lp.completionDate DESC")
    List<LearningProgress> findCompletedLearningByPersonalId(@Param("personalId") Long personalId);

    // Statistics
    @Query("SELECT COUNT(lp) FROM LearningProgress lp " +
            "WHERE lp.skill.personal.id = :personalId")
    Long countByPersonalId(@Param("personalId") Long personalId);

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