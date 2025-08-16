package com.example.portofolio.repository;

import com.example.portofolio.entity.Project;
import com.example.portofolio.entity.Technology;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnologyRepository extends JpaRepository<Technology, Long> {

    // Basic queries
    List<Technology> findByCategoryId(Long categoryId);

    List<Technology> findByCategoryIdOrderByPopularityScoreDesc(Long categoryId);

    Optional<Technology> findByName(String name);

    Optional<Technology> findByNameIgnoreCase(String name);

    // Optimized queries
    @Query("SELECT t FROM Technology t " +
            "LEFT JOIN FETCH t.category " +
            "LEFT JOIN FETCH t.features " +
            "WHERE t.id = :id")
    Optional<Technology> findByIdWithCategoryAndFeatures(@Param("id") Long id);

    @Query("SELECT t FROM Technology t " +
            "LEFT JOIN FETCH t.category " +
            "WHERE t.category.id = :categoryId")
    List<Technology> findByCategoryIdWithCategory(@Param("categoryId") Long categoryId);

    // Trending technologies
    @Query("SELECT t FROM Technology t " +
            "WHERE t.trending = true " +
            "ORDER BY t.popularityScore DESC, t.name ASC")
    List<Technology> findTrendingTechnologies();

    @Query("SELECT t FROM Technology t " +
            "WHERE t.category.id = :categoryId AND t.trending = true " +
            "ORDER BY t.popularityScore DESC")
    List<Technology> findTrendingByCategoryId(@Param("categoryId") Long categoryId);

    // Popular technologies
    @Query("SELECT t FROM Technology t " +
            "WHERE t.popularityScore >= :minScore " +
            "ORDER BY t.popularityScore DESC")
    List<Technology> findPopularTechnologies(@Param("minScore") Integer minScore);

    // Used technologies (în proiecte)
    @Query("SELECT DISTINCT t FROM Technology t " +
            "JOIN EntityTechnology et ON et.technology.id = t.id " +
            "JOIN Project p ON et.entityType = 'PROJECT' AND et.entityId = p.id " +
            "WHERE p.personal.id = :personalId")
    List<Technology> findUsedByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT DISTINCT t FROM Technology t " +
            "JOIN EntityTechnology et ON et.technology.id = t.id " +
            "JOIN Project p ON et.entityType = 'PROJECT' AND et.entityId = p.id " +
            "WHERE p.personal.id = :personalId AND t.category.id = :categoryId")
    List<Technology> findUsedByPersonalIdAndCategoryId(@Param("personalId") Long personalId,
                                                       @Param("categoryId") Long categoryId);

    // Statistics
    @Query("SELECT COUNT(t) FROM Technology t WHERE t.category.id = :categoryId")
    Long countByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT COUNT(t) FROM Technology t WHERE t.trending = true")
    Long countTrendingTechnologies();

    @Query("SELECT t.category.name, COUNT(t) FROM Technology t " +
            "GROUP BY t.category.name " +
            "ORDER BY COUNT(t) DESC")
    List<Object[]> countTechnologiesByCategory();

    @Query("SELECT AVG(t.popularityScore) FROM Technology t")
    Double findAveragePopularityScore();

    // Search
    @Query("SELECT t FROM Technology t " +
            "WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Technology> findByNameOrDescriptionContaining(@Param("search") String search);

    @Query("SELECT t FROM Technology t " +
            "WHERE t.category.id = :categoryId " +
            "AND (LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Technology> findByCategoryIdAndSearchTerm(@Param("categoryId") Long categoryId,
                                                   @Param("search") String search);

    // Version management
    List<Technology> findByNameAndVersion(String name, String version);

    @Query("SELECT t FROM Technology t " +
            "WHERE t.name = :name " +
            "ORDER BY t.releaseDate DESC")
    List<Technology> findVersionsByName(@Param("name") String name);

    // Features
    @Query("SELECT t FROM Technology t " +
            "JOIN t.features f " +
            "WHERE f.deprecated = false " +
            "AND LOWER(f.title) LIKE LOWER(CONCAT('%', :feature, '%'))")
    List<Technology> findByFeatureContaining(@Param("feature") String feature);

    // Recently released
    @Query("SELECT t FROM Technology t " +
            "WHERE t.releaseDate >= :since " +
            "ORDER BY t.releaseDate DESC")
    List<Technology> findRecentlyReleased(@Param("since") java.time.LocalDate since);


}