package com.example.portofolio.repository;

import com.example.portofolio.entity.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillCategoryRepository extends JpaRepository<SkillCategory, Long> {

    @Query("SELECT sc FROM SkillCategory sc " +
            "LEFT JOIN FETCH sc.parent " +
            "LEFT JOIN FETCH sc.icon " +
            "ORDER BY sc.sortOrder, sc.name")
    List<SkillCategory> findAllWithParentAndIcon();

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