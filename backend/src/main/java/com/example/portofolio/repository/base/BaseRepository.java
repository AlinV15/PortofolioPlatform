package com.example.portofolio.repository.base;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Base repository interface providing read-only functionality for portfolio display
 * @param <T> Entity type
 * @param <ID> Entity ID type
 */
@NoRepositoryBean
public interface BaseRepository<T, ID> extends JpaRepository<T, ID> {

    // ===== BASIC READ OPERATIONS =====

    /**
     * Find entities by multiple IDs
     */
    @Query("SELECT e FROM #{#entityName} e WHERE e.id IN :ids")
    List<T> findByIdIn(@Param("ids") List<ID> ids);

    /**
     * Find entities ordered by creation date (most recent first)
     */
    @Query("SELECT e FROM #{#entityName} e ORDER BY e.createdAt DESC")
    List<T> findAllByCreationDateDesc();

    /**
     * Find entities with pagination ordered by creation date
     */
    @Query("SELECT e FROM #{#entityName} e ORDER BY e.createdAt DESC")
    Page<T> findAllByCreationDateDesc(Pageable pageable);

    // ===== STATISTICS & ANALYTICS =====

    /**
     * Count total entities
     */
    @Query("SELECT COUNT(e) FROM #{#entityName} e")
    long countTotal();

    /**
     * Get creation statistics by date (for timeline views)
     */
    @Query("SELECT DATE(e.createdAt) as date, COUNT(e) as count FROM #{#entityName} e " +
            "WHERE e.createdAt >= :since " +
            "GROUP BY DATE(e.createdAt) " +
            "ORDER BY DATE(e.createdAt) DESC")
    List<Object[]> getCreationStatsSince(@Param("since") LocalDateTime since);

    /**
     * Get monthly creation statistics (for charts)
     */
    @Query("SELECT YEAR(e.createdAt) as year, MONTH(e.createdAt) as month, COUNT(e) as count " +
            "FROM #{#entityName} e " +
            "WHERE e.createdAt >= :since " +
            "GROUP BY YEAR(e.createdAt), MONTH(e.createdAt) " +
            "ORDER BY YEAR(e.createdAt) DESC, MONTH(e.createdAt) DESC")
    List<Object[]> getMonthlyCreationStats(@Param("since") LocalDateTime since);

    /**
     * Get yearly statistics
     */
    @Query("SELECT YEAR(e.createdAt) as year, COUNT(e) as count " +
            "FROM #{#entityName} e " +
            "GROUP BY YEAR(e.createdAt) " +
            "ORDER BY YEAR(e.createdAt) DESC")
    List<Object[]> getYearlyStats();

    // ===== RECENT ITEMS =====

    /**
     * Find recently created entities
     */
    @Query("SELECT e FROM #{#entityName} e WHERE e.createdAt >= :date ORDER BY e.createdAt DESC")
    List<T> findCreatedAfter(@Param("date") LocalDateTime date);

    /**
     * Find recently updated entities
     */
    @Query("SELECT e FROM #{#entityName} e WHERE e.updatedAt >= :date ORDER BY e.updatedAt DESC")
    List<T> findUpdatedAfter(@Param("date") LocalDateTime date);

    /**
     * Find recent items with limit
     */
    @Query("SELECT e FROM #{#entityName} e ORDER BY e.createdAt DESC")
    List<T> findRecentItems(Pageable pageable);

    // ===== SEARCH & FILTERING =====

    /**
     * Generic search by common fields (override in specific repositories)
     */
    @Query("SELECT e FROM #{#entityName} e " +
            "WHERE LOWER(CAST(e.id AS string)) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<T> findBySearchTerm(@Param("search") String search);

    /**
     * Check if any entities exist with given IDs
     */
    @Query("SELECT COUNT(e) > 0 FROM #{#entityName} e WHERE e.id IN :ids")
    boolean existsByIdIn(@Param("ids") List<ID> ids);

    // ===== METADATA SUPPORT (for entities with EntityMetadata) =====

    /**
     * Find entities that have associated metadata
     */
    @Query("SELECT e FROM #{#entityName} e WHERE EXISTS " +
            "(SELECT 1 FROM EntityMetadata em WHERE em.entityType = :entityType AND em.entityId = e.id)")
    List<T> findWithMetadata(@Param("entityType") String entityType);

    /**
     * Find featured entities
     */
    @Query("SELECT e FROM #{#entityName} e WHERE EXISTS " +
            "(SELECT 1 FROM EntityMetadata em WHERE em.entityType = :entityType AND em.entityId = e.id AND em.featured = true)")
    List<T> findFeatured(@Param("entityType") String entityType);

    /**
     * Find entities by importance level
     */
    @Query("SELECT e FROM #{#entityName} e " +
            "JOIN EntityMetadata em ON em.entityType = :entityType AND em.entityId = e.id " +
            "WHERE em.importance = :importance " +
            "ORDER BY em.updatedAt DESC")
    List<T> findByImportance(@Param("entityType") String entityType, @Param("importance") String importance);

    /**
     * Count entities by metadata importance
     */
    @Query("SELECT em.importance, COUNT(e) FROM #{#entityName} e " +
            "JOIN EntityMetadata em ON em.entityType = :entityType AND em.entityId = e.id " +
            "GROUP BY em.importance " +
            "ORDER BY em.importance DESC")
    List<Object[]> countByImportance(@Param("entityType") String entityType);

    // ===== UTILITIES =====

    /**
     * Find first entity (oldest)
     */
    @Query("SELECT e FROM #{#entityName} e ORDER BY e.createdAt ASC")
    Optional<T> findFirstCreated();

    /**
     * Find last entity (newest)
     */
    @Query("SELECT e FROM #{#entityName} e ORDER BY e.createdAt DESC")
    Optional<T> findLastCreated();

    /**
     * Check if entity exists and has metadata
     */
    @Query("SELECT COUNT(e) > 0 FROM #{#entityName} e " +
            "WHERE e.id = :id AND EXISTS " +
            "(SELECT 1 FROM EntityMetadata em WHERE em.entityType = :entityType AND em.entityId = e.id)")
    boolean existsByIdWithMetadata(@Param("id") ID id, @Param("entityType") String entityType);

    // ===== TIMELINE QUERIES =====

    /**
     * Find entities created in date range
     */
    @Query("SELECT e FROM #{#entityName} e " +
            "WHERE e.createdAt BETWEEN :startDate AND :endDate " +
            "ORDER BY e.createdAt DESC")
    List<T> findCreatedBetween(@Param("startDate") LocalDateTime startDate,
                               @Param("endDate") LocalDateTime endDate);

    /**
     * Find entities by year
     */
    @Query("SELECT e FROM #{#entityName} e " +
            "WHERE YEAR(e.createdAt) = :year " +
            "ORDER BY e.createdAt DESC")
    List<T> findByYear(@Param("year") Integer year);

    /**
     * Get distinct years that have entities
     */
    @Query("SELECT DISTINCT YEAR(e.createdAt) FROM #{#entityName} e " +
            "ORDER BY YEAR(e.createdAt) DESC")
    List<Integer> findDistinctYears();
}