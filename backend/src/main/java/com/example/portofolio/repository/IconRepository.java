package com.example.portofolio.repository;

import com.example.portofolio.entity.Icon;
import com.example.portofolio.entity.enums.IconType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IconRepository extends JpaRepository<Icon, Long> {

    // Basic queries
    Optional<Icon> findByName(String name);

    Optional<Icon> findByNameIgnoreCase(String name);

    List<Icon> findByType(IconType type);

    List<Icon> findByCategory(String category);

    List<Icon> findByTypeAndCategory(IconType type, String category);

    // Search queries
    @Query("SELECT i FROM Icon i " +
            "WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Icon> findByNameContaining(@Param("search") String search);

    @Query("SELECT i FROM Icon i " +
            "WHERE i.type = :type " +
            "AND LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Icon> findByTypeAndNameContaining(@Param("type") IconType type,
                                           @Param("search") String search);

    // Category management
    @Query("SELECT DISTINCT i.category FROM Icon i " +
            "WHERE i.category IS NOT NULL " +
            "ORDER BY i.category")
    List<String> findAllCategories();

    @Query("SELECT DISTINCT i.category FROM Icon i " +
            "WHERE i.type = :type AND i.category IS NOT NULL " +
            "ORDER BY i.category")
    List<String> findCategoriesByType(@Param("type") IconType type);

    // Statistics
    @Query("SELECT i.type, COUNT(i) FROM Icon i " +
            "GROUP BY i.type")
    List<Object[]> countIconsByType();

    @Query("SELECT i.category, COUNT(i) FROM Icon i " +
            "WHERE i.category IS NOT NULL " +
            "GROUP BY i.category " +
            "ORDER BY COUNT(i) DESC")
    List<Object[]> countIconsByCategory();

    @Query("SELECT COUNT(i) FROM Icon i WHERE i.type = :type")
    Long countByType(@Param("type") IconType type);

    // Custom SVG icons
    @Query("SELECT i FROM Icon i " +
            "WHERE i.type = 'CUSTOM' AND i.svgContent IS NOT NULL")
    List<Icon> findCustomIconsWithSvg();

    @Query("SELECT i FROM Icon i " +
            "WHERE i.svgContent IS NOT NULL")
    List<Icon> findIconsWithSvgContent();

    // Validation
    boolean existsByName(String name);

    boolean existsByNameIgnoreCase(String name);

    // Most used icons (referenced in EntityMetadata)
    @Query("SELECT i, COUNT(em) as usage_count FROM Icon i " +
            "LEFT JOIN EntityMetadata em ON em.icon.id = i.id " +
            "GROUP BY i " +
            "ORDER BY COUNT(em) DESC")
    List<Object[]> findMostUsedIcons();

    @Query("SELECT i FROM Icon i " +
            "WHERE EXISTS (SELECT 1 FROM EntityMetadata em WHERE em.icon.id = i.id)")
    List<Icon> findUsedIcons();

    @Query("SELECT i FROM Icon i " +
            "WHERE NOT EXISTS (SELECT 1 FROM EntityMetadata em WHERE em.icon.id = i.id)")
    List<Icon> findUnusedIcons();
}