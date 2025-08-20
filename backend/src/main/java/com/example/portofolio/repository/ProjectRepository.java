package com.example.portofolio.repository;

import com.example.portofolio.entity.Project;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Basic queries
    List<Project> findByPersonalId(Long personalId);

    // Featured projects
    @Query("SELECT p FROM Project p " +
            "JOIN EntityMetadata em ON em.entityType = 'PROJECT' AND em.entityId = p.id " +
            "WHERE p.personal.id = :personalId AND em.featured = true " +
            "ORDER BY p.year DESC, p.completionDate DESC")
    List<Project> findFeaturedByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT p FROM Project p " +
            "JOIN EntityTechnology et ON et.entityType = 'PROJECT' AND et.entityId = p.id " +
            "WHERE et.technology.id = :technologyId " +
            "ORDER BY p.completionDate DESC")
    Optional<Project> findLatestProjectUsingTechnology(@Param("technologyId") Long technologyId);

    // Statistics
    @Query("SELECT COUNT(p) FROM Project p WHERE p.personal.id = :personalId")
    Long countByPersonalId(@Param("personalId") Long personalId);

    // Search
    @Query("SELECT p FROM Project p " +
            "WHERE p.personal.id = :personalId " +
            "AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(p.category) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Project> findByPersonalIdAndSearchTerm(@Param("personalId") Long personalId,
                                                @Param("search") String search);

    @Query("SELECT p FROM Project p JOIN EntityMetadata em ON em.entityType = 'PROJECT' AND em.entityId = p.id " +
            "WHERE p.personal.id = :personalId AND em.featured = true ORDER BY p.year DESC")
    List<Project> findFeaturedByPersonalId(@Param("personalId") Long personalId, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.personal.id = :personalId AND p.complexity = 'ADVANCED' " +
            "ORDER BY p.year DESC")
    List<Project> findMajorProjectsByPersonalId(@Param("personalId") Long personalId);

    // Methods for distribution
    @Query("SELECT p.category, COUNT(p) as projectCount " +
            "FROM Project p " +
            "WHERE p.personal.id = :personalId " +
            "GROUP BY p.category " +
            "ORDER BY projectCount DESC, p.category ASC")
    List<Object[]> findProjectCategoryDistribution(@Param("personalId") Long personalId);

    /**
     * Return total projects
     */
    @Query("SELECT COUNT(p) FROM Project p WHERE p.personal.id = :personalId")
    Long getTotalProjectCount(@Param("personalId") Long personalId);

    /**
     * Find first project's year
     */
    @Query("SELECT MIN(p.year) FROM Project p WHERE p.personal.id = :personalId AND p.year IS NOT NULL")
    Integer findOldestProjectYear(@Param("personalId") Long personalId);


    /**
     * Find the latest project for calculating your experience
     */
    @Query("SELECT MAX(p.year) FROM Project p WHERE p.personal.id = :personalId AND p.year IS NOT NULL")
    Integer findNewestProjectYear(@Param("personalId") Long personalId);

    /**
     * Distribution of complexity of projects for the calculation of the average
     * Returns: [["BEGINNER", 2], ["INTERMEDIATE", 5], ["ADVANCED", 3]
     */
    @Query("SELECT p.complexity, COUNT(p) " +
            "FROM Project p " +
            "WHERE p.personal.id = :personalId AND p.complexity IS NOT NULL " +
            "GROUP BY p.complexity " +
            "ORDER BY COUNT(p) DESC")
    List<Object[]> findComplexityDistribution(@Param("personalId") Long personalId);
  // Used for making projects achievements
    @Query("SELECT p FROM Project p " +
            "WHERE p.personal.id = :personalId " +
            "AND p.status IN ('PRODUCTION', 'MAINTENANCE') " +
            "AND p.completionDate IS NOT NULL " +
            "ORDER BY p.completionDate DESC")
    List<Project> findCompletedProjectsAsAchievements(@Param("personalId") Long personalId, Pageable pageable);


    /**
     * Calculate the success rate based on projects in production vs total
     * Projects with production status or MAINTENANCE are considered "deployed"
     */
    @Query("SELECT COUNT(p) FROM Project p " +
            "WHERE p.personal.id = :personalId " +
            "AND p.status IN ('PRODUCTION', 'MAINTENANCE')")
    Long countDeployedProjects(@Param("personalId") Long personalId);

    /**
     * Projects with demoUrl (live projects) for success rate
     */
    @Query("SELECT COUNT(p) FROM Project p " +
            "WHERE p.personal.id = :personalId " +
            "AND p.demoUrl IS NOT NULL AND p.demoUrl != ''")
    Long countLiveProjects(@Param("personalId") Long personalId);

}