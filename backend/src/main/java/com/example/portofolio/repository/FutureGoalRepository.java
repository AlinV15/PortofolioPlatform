package com.example.portofolio.repository;

import com.example.portofolio.entity.FutureGoal;
import com.example.portofolio.entity.enums.GoalType;
import com.example.portofolio.entity.enums.GoalStatus;
import com.example.portofolio.entity.enums.PriorityLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FutureGoalRepository extends JpaRepository<FutureGoal, Long> {

    // Basic queries
    List<FutureGoal> findByPersonalId(Long personalId);

    List<FutureGoal> findByPersonalIdAndGoalType(Long personalId, GoalType goalType);

    List<FutureGoal> findByPersonalIdAndStatus(Long personalId, GoalStatus status);

    List<FutureGoal> findByPersonalIdAndPriority(Long personalId, PriorityLevel priority);

    List<FutureGoal> findByPersonalIdOrderByTargetDateAsc(Long personalId);

    List<FutureGoal> findByPersonalIdOrderByPriorityDescTargetDateAsc(Long personalId);

    // Status-based queries
    @Query("SELECT fg FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId " +
            "AND fg.status IN ('PLANNING', 'IN_PROGRESS') " +
            "ORDER BY fg.priority DESC, fg.targetDate ASC")
    List<FutureGoal> findActiveGoalsByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT fg FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId " +
            "AND fg.status = 'COMPLETED' " +
            "ORDER BY fg.updatedAt DESC")
    List<FutureGoal> findCompletedGoalsByPersonalId(@Param("personalId") Long personalId);

    // Priority queries
    @Query("SELECT fg FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId " +
            "AND fg.priority = 'HIGH' " +
            "AND fg.status IN ('PLANNING', 'IN_PROGRESS') " +
            "ORDER BY fg.targetDate ASC")
    List<FutureGoal> findHighPriorityActiveGoals(@Param("personalId") Long personalId);

    // Target date queries
    @Query("SELECT fg FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId " +
            "AND fg.targetDate <= :date " +
            "AND fg.status IN ('PLANNING', 'IN_PROGRESS') " +
            "ORDER BY fg.targetDate ASC")
    List<FutureGoal> findGoalsDueBy(@Param("personalId") Long personalId,
                                    @Param("date") LocalDate date);

    @Query("SELECT fg FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId " +
            "AND fg.targetDate BETWEEN :startDate AND :endDate " +
            "ORDER BY fg.targetDate ASC")
    List<FutureGoal> findGoalsByDateRange(@Param("personalId") Long personalId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);

    // Progress queries
    @Query("SELECT fg FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId " +
            "AND fg.progressPercentage >= :minProgress " +
            "ORDER BY fg.progressPercentage DESC")
    List<FutureGoal> findGoalsByMinProgress(@Param("personalId") Long personalId,
                                            @Param("minProgress") Integer minProgress);

    // Skill-related goals
    List<FutureGoal> findByPersonalIdAndSkillId(Long personalId, Long skillId);

    @Query("SELECT fg FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId " +
            "AND fg.skill IS NOT NULL " +
            "ORDER BY fg.priority DESC, fg.targetDate ASC")
    List<FutureGoal> findSkillRelatedGoalsByPersonalId(@Param("personalId") Long personalId);

    // Featured goals
    @Query("SELECT fg FROM FutureGoal fg " +
            "JOIN EntityMetadata em ON em.entityType = 'FUTURE_GOAL' AND em.entityId = fg.id " +
            "WHERE fg.personal.id = :personalId AND em.featured = true " +
            "ORDER BY fg.priority DESC, fg.targetDate ASC")
    List<FutureGoal> findFeaturedByPersonalId(@Param("personalId") Long personalId);

    // Statistics
    @Query("SELECT COUNT(fg) FROM FutureGoal fg WHERE fg.personal.id = :personalId")
    Long countByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT fg.status, COUNT(fg) FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId " +
            "GROUP BY fg.status")
    List<Object[]> countGoalsByStatus(@Param("personalId") Long personalId);

    @Query("SELECT fg.goalType, COUNT(fg) FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId " +
            "GROUP BY fg.goalType " +
            "ORDER BY COUNT(fg) DESC")
    List<Object[]> countGoalsByType(@Param("personalId") Long personalId);

    @Query("SELECT fg.priority, COUNT(fg) FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId " +
            "GROUP BY fg.priority " +
            "ORDER BY fg.priority DESC")
    List<Object[]> countGoalsByPriority(@Param("personalId") Long personalId);

    @Query("SELECT AVG(fg.progressPercentage) FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId AND fg.status = 'IN_PROGRESS'")
    Double findAverageProgressByPersonalId(@Param("personalId") Long personalId);

    // Timeline analysis
    @Query("SELECT YEAR(fg.targetDate) as year, COUNT(fg) FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId AND fg.targetDate IS NOT NULL " +
            "GROUP BY YEAR(fg.targetDate) " +
            "ORDER BY year ASC")
    List<Object[]> getGoalTimelineByPersonalId(@Param("personalId") Long personalId);

    // Search
    @Query("SELECT fg FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId " +
            "AND (LOWER(fg.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(fg.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<FutureGoal> findByPersonalIdAndSearchTerm(@Param("personalId") Long personalId,
                                                   @Param("search") String search);

    // Overdue goals
    @Query("SELECT fg FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId " +
            "AND fg.targetDate < :currentDate " +
            "AND fg.status IN ('PLANNING', 'IN_PROGRESS') " +
            "ORDER BY fg.targetDate ASC")
    List<FutureGoal> findOverdueGoals(@Param("personalId") Long personalId,
                                      @Param("currentDate") LocalDate currentDate);

    // Upcoming goals
    @Query("SELECT fg FROM FutureGoal fg " +
            "WHERE fg.personal.id = :personalId " +
            "AND fg.targetDate BETWEEN :currentDate AND :futureDate " +
            "AND fg.status IN ('PLANNING', 'IN_PROGRESS') " +
            "ORDER BY fg.targetDate ASC")
    List<FutureGoal> findUpcomingGoals(@Param("personalId") Long personalId,
                                       @Param("currentDate") LocalDate currentDate,
                                       @Param("futureDate") LocalDate futureDate);

    @Query("SELECT fg FROM FutureGoal fg WHERE fg.personal.id = :personalId " +
            "ORDER BY fg.priority DESC, fg.targetDate ASC")
    List<FutureGoal> findByPersonalIdOrderByPriorityDesc(@Param("personalId") Long personalId);

}