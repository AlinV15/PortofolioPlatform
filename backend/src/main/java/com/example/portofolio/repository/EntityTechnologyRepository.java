package com.example.portofolio.repository;

import com.example.portofolio.entity.EntityTechnology;
import com.example.portofolio.entity.enums.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntityTechnologyRepository extends JpaRepository<EntityTechnology, Long> {

    List<EntityTechnology> findByEntityTypeAndEntityId(EntityType entityType, Long entityId);

    List<EntityTechnology> findByTechnologyId(Long technologyId);

    @Query("SELECT et FROM EntityTechnology et " +
            "LEFT JOIN FETCH et.technology t " +
            "LEFT JOIN FETCH t.category " +
            "WHERE et.entityType = :entityType AND et.entityId = :entityId")
    List<EntityTechnology> findByEntityTypeAndEntityIdWithTechnology(@Param("entityType") EntityType entityType,
                                                                     @Param("entityId") Long entityId);

    Integer countByEntityTypeAndTechnologyId(EntityType entityType, Long technologyId);

    boolean existsByEntityTypeAndTechnologyId(EntityType entityType, Long technologyId);

    // Pentru personal queries
    @Query("SELECT et FROM EntityTechnology et " +
            "JOIN Project p ON et.entityType = 'PROJECT' AND et.entityId = p.id " +
            "WHERE p.personal.id = :personalId AND et.technology.category.id = :categoryId")
    List<EntityTechnology> findByPersonalIdAndTechnologyCategoryId(@Param("personalId") Long personalId,
                                                                   @Param("categoryId") Long categoryId);

    @Query("SELECT et FROM EntityTechnology et " +
            "JOIN Project p ON et.entityType = 'PROJECT' AND et.entityId = p.id " +
            "LEFT JOIN FETCH et.technology t " +
            "LEFT JOIN FETCH t.category " +
            "WHERE p.personal.id = :personalId")
    List<EntityTechnology> findByPersonalIdWithTechnologyAndCategory(@Param("personalId") Long personalId);

    @Query("SELECT COUNT(DISTINCT et.technology.id) FROM EntityTechnology et " +
            "WHERE et.entityType = 'PROJECT' AND et.entityId IN " +
            "(SELECT p.id FROM Project p WHERE p.personal.id = :personalId)")
    Integer countDistinctTechnologiesByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT t.name FROM EntityTechnology et JOIN et.technology t " +
            "WHERE et.entityType = 'PROJECT' AND et.entityId = :projectId")
    List<String> findTechnologyNamesByProjectId(@Param("projectId") Long projectId);

}
