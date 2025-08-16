package com.example.portofolio.repository;

import com.example.portofolio.entity.Project;
import com.example.portofolio.entity.enums.ProjectStatus;
import com.example.portofolio.entity.enums.ComplexityLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Basic queries
    List<Project> findByPersonalId(Long personalId);

    List<Project> findByPersonalIdAndStatus(Long personalId, ProjectStatus status);

    List<Project> findByPersonalIdAndCategory(Long personalId, String category);

    // Optimized queries
    @Query("SELECT p FROM Project p " +
            "LEFT JOIN FETCH p.images " +
            "LEFT JOIN FETCH p.features " +
            "LEFT JOIN FETCH p.metrics " +
            "WHERE p.personal.id = :personalId")
    List<Project> findByPersonalIdWithDetails(@Param("personalId") Long personalId);

    @Query("SELECT p FROM Project p " +
            "LEFT JOIN FETCH p.images img " +
            "WHERE p.id = :id AND img.primary = true")
    Optional<Project> findByIdWithPrimaryImage(@Param("id") Long id);

    // Featured projects
    @Query("SELECT p FROM Project p " +
            "JOIN EntityMetadata em ON em.entityType = 'PROJECT' AND em.entityId = p.id " +
            "WHERE p.personal.id = :personalId AND em.featured = true " +
            "ORDER BY p.year DESC, p.completionDate DESC")
    List<Project> findFeaturedByPersonalId(@Param("personalId") Long personalId);

    // Recent projects
    @Query("SELECT p FROM Project p " +
            "WHERE p.personal.id = :personalId " +
            "AND p.status IN ('PRODUCTION', 'DEVELOPMENT') " +
            "ORDER BY p.completionDate DESC, p.createdAt DESC")
    List<Project> findRecentByPersonalId(@Param("personalId") Long personalId, Pageable pageable);

    // Projects by complexity
    List<Project> findByPersonalIdAndComplexity(Long personalId, ComplexityLevel complexity);

    // Projects by year
    @Query("SELECT p FROM Project p " +
            "WHERE p.personal.id = :personalId AND p.year = :year " +
            "ORDER BY p.completionDate DESC")
    List<Project> findByPersonalIdAndYear(@Param("personalId") Long personalId,
                                          @Param("year") Integer year);

    @Query("SELECT p FROM Project p " +
            "WHERE p.personal.id = :personalId " +
            "AND p.completionDate BETWEEN :startDate AND :endDate " +
            "ORDER BY p.completionDate DESC")
    List<Project> findByPersonalIdAndCompletionDateBetween(@Param("personalId") Long personalId,
                                                           @Param("startDate") LocalDate startDate,
                                                           @Param("endDate") LocalDate endDate);

    // Technology-related queries
    @Query("SELECT p FROM Project p " +
            "JOIN EntityTechnology et ON et.entityType = 'PROJECT' AND et.entityId = p.id " +
            "WHERE p.personal.id = :personalId AND et.technology.id = :technologyId")
    List<Project> findByPersonalIdAndTechnologyId(@Param("personalId") Long personalId,
                                                  @Param("technologyId") Long technologyId);

    @Query("SELECT p FROM Project p " +
            "JOIN EntityTechnology et ON et.entityType = 'PROJECT' AND et.entityId = p.id " +
            "WHERE et.technology.id = :technologyId " +
            "ORDER BY p.completionDate DESC")
    Optional<Project> findLatestProjectUsingTechnology(@Param("technologyId") Long technologyId);

    @Query("SELECT p FROM Project p " +
            "JOIN EntityTechnology et ON et.entityType = 'PROJECT' AND et.entityId = p.id " +
            "WHERE et.technology.id = :technologyId " +
            "ORDER BY p.createdAt ASC")
    Optional<Project> findFirstProjectUsingTechnology(@Param("technologyId") Long technologyId);

    // Statistics
    @Query("SELECT COUNT(p) FROM Project p WHERE p.personal.id = :personalId")
    Long countByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT COUNT(p) FROM Project p " +
            "WHERE p.personal.id = :personalId AND p.status = :status")
    Long countByPersonalIdAndStatus(@Param("personalId") Long personalId,
                                    @Param("status") ProjectStatus status);

    @Query("SELECT p.category, COUNT(p) FROM Project p " +
            "WHERE p.personal.id = :personalId " +
            "GROUP BY p.category")
    List<Object[]> countProjectsByCategory(@Param("personalId") Long personalId);

    // Search
    @Query("SELECT p FROM Project p " +
            "WHERE p.personal.id = :personalId " +
            "AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(p.category) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Project> findByPersonalIdAndSearchTerm(@Param("personalId") Long personalId,
                                                @Param("search") String search);

    // Pagination support
    Page<Project> findByPersonalIdOrderByCompletionDateDesc(Long personalId, Pageable pageable);

    Page<Project> findByPersonalIdAndStatusOrderByCompletionDateDesc(Long personalId,
                                                                     ProjectStatus status,
                                                                     Pageable pageable);

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
     * Găsește cel mai recent proiect pentru calculul experienței
     */
    @Query("SELECT MAX(p.year) FROM Project p WHERE p.personal.id = :personalId AND p.year IS NOT NULL")
    Integer findNewestProjectYear(@Param("personalId") Long personalId);

    /**
     * Distribuția complexității proiectelor pentru calculul mediei
     * Returnează: [["BEGINNER", 2], ["INTERMEDIATE", 5], ["ADVANCED", 3]]
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
     * Calculează rata de succes bazată pe proiectele în producție vs total
     * Proiectele cu status PRODUCTION sau MAINTENANCE sunt considerate "deployed"
     */
    @Query("SELECT COUNT(p) FROM Project p " +
            "WHERE p.personal.id = :personalId " +
            "AND p.status IN ('PRODUCTION', 'MAINTENANCE')")
    Long countDeployedProjects(@Param("personalId") Long personalId);

    /**
     * Proiectele cu demoUrl (live projects) pentru success rate
     */
    @Query("SELECT COUNT(p) FROM Project p " +
            "WHERE p.personal.id = :personalId " +
            "AND p.demoUrl IS NOT NULL AND p.demoUrl != ''")
    Long countLiveProjects(@Param("personalId") Long personalId);

    /**
     * Alternative pentru success rate - proiecte finalizate vs total
     */
    @Query("SELECT COUNT(p) FROM Project p " +
            "WHERE p.personal.id = :personalId " +
            "AND p.status NOT IN ('PLANNING', 'CANCELLED')")
    Long countCompletedProjects(@Param("personalId") Long personalId);
}