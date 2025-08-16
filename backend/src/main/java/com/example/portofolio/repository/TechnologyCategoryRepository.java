package com.example.portofolio.repository;

import com.example.portofolio.entity.TechnologyCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnologyCategoryRepository extends JpaRepository<TechnologyCategory, Long> {

    Optional<TechnologyCategory> findByName(String name);

    Optional<TechnologyCategory> findByNameIgnoreCase(String name);

    List<TechnologyCategory> findByParentId(Long parentId);

    List<TechnologyCategory> findByParentIsNull();

    @Query("SELECT tc FROM TechnologyCategory tc " +
            "LEFT JOIN FETCH tc.children " +
            "WHERE tc.parent IS NULL " +
            "ORDER BY tc.sortOrder, tc.name")
    List<TechnologyCategory> findRootCategoriesWithChildren();

    @Query("SELECT tc, COUNT(t) FROM TechnologyCategory tc " +
            "LEFT JOIN Technology t ON t.category.id = tc.id " +
            "GROUP BY tc " +
            "ORDER BY tc.sortOrder, tc.name")
    List<Object[]> findAllWithTechnologyCount();
}