package com.example.portofolio.repository;

import com.example.portofolio.entity.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillCategoryRepository extends JpaRepository<SkillCategory, Long> {

    // Basic queries
    Optional<SkillCategory> findByName(String name);

    Optional<SkillCategory> findByNameIgnoreCase(String name);

    List<SkillCategory> findByParentId(Long parentId);

    List<SkillCategory> findByParentIsNull(); // Root categories

    // Optimized queries
    @Query("SELECT sc FROM SkillCategory sc " +
            "LEFT JOIN FETCH sc.children " +
            "WHERE sc.parent IS NULL " +
            "ORDER BY sc.sortOrder, sc.name")
    List<SkillCategory> findRootCategoriesWithChildren();

    @Query("SELECT sc FROM SkillCategory sc " +
            "LEFT JOIN FETCH sc.parent " +
            "LEFT JOIN FETCH sc.icon " +
            "ORDER BY sc.sortOrder, sc.name")
    List<SkillCategory> findAllWithParentAndIcon();

    // Statistics with skills
    @Query("SELECT sc, COUNT(s) FROM SkillCategory sc " +
            "LEFT JOIN Skill s ON s.category.id = sc.id AND s.personal.id = :personalId " +
            "GROUP BY sc " +
            "ORDER BY sc.sortOrder, sc.name")
    List<Object[]> findAllWithSkillStats(@Param("personalId") Long personalId);

    @Query("SELECT sc FROM SkillCategory sc " +
            "WHERE EXISTS (SELECT 1 FROM Skill s WHERE s.category.id = sc.id AND s.personal.id = :personalId) " +
            "ORDER BY sc.sortOrder, sc.name")
    List<SkillCategory> findUsedByPersonalId(@Param("personalId") Long personalId);

    // Hierarchy navigation
    @Query("SELECT sc FROM SkillCategory sc " +
            "WHERE sc.parent.id = :parentId " +
            "ORDER BY sc.sortOrder, sc.name")
    List<SkillCategory> findChildrenByParentId(@Param("parentId") Long parentId);

    @Query(value = "WITH RECURSIVE CategoryHierarchy AS (" +
            "  SELECT id, name, parent_id, 0 as level FROM skill_category WHERE id = :categoryId " +
            "  UNION ALL " +
            "  SELECT sc.id, sc.name, sc.parent_id, ch.level + 1 " +
            "  FROM skill_category sc " +
            "  JOIN CategoryHierarchy ch ON sc.parent_id = ch.id" +
            ") SELECT * FROM CategoryHierarchy", nativeQuery = true)
    List<Object[]> findCategoryHierarchy(@Param("categoryId") Long categoryId);

    // Search
    @Query("SELECT sc FROM SkillCategory sc " +
            "WHERE LOWER(sc.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(sc.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<SkillCategory> findByNameOrDescriptionContaining(@Param("search") String search);
}