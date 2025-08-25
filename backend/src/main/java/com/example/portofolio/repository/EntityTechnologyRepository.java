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

    @Query("SELECT et FROM EntityTechnology et " +
            "LEFT JOIN FETCH et.technology t " +
            "LEFT JOIN FETCH t.category " +
            "WHERE et.entityType = :entityType AND et.entityId = :entityId")
    List<EntityTechnology> findByEntityTypeAndEntityIdWithTechnology(@Param("entityType") EntityType entityType,
                                                                     @Param("entityId") Long entityId);

    @Query("SELECT COUNT(et) FROM EntityTechnology et " +
            "JOIN Project p ON et.entityId = p.id " +
            "WHERE et.entityType = 'PROJECT' " +
            "AND et.technology.id = :technologyId " +
            "AND p.personal.id = :personalId")
    Integer countProjectsForTechnologyAndPersonal(@Param("technologyId") Long technologyId,
                                                  @Param("personalId") Long personalId);

    @Query("SELECT COUNT(DISTINCT et.technology.id) FROM EntityTechnology et " +
            "WHERE et.entityType = 'PROJECT' AND et.entityId IN " +
            "(SELECT p.id FROM Project p WHERE p.personal.id = :personalId)")
    Integer countDistinctTechnologiesByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT t.name FROM EntityTechnology et JOIN et.technology t " +
            "WHERE et.entityType = 'PROJECT' AND et.entityId = :projectId")
    List<String> findTechnologyNamesByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT et FROM EntityTechnology et " +
            "LEFT JOIN FETCH et.technology t " +
            "LEFT JOIN FETCH t.category " +
            "WHERE et.entityType = :entityType AND et.technology.id = :technologyId")
    List<EntityTechnology> findByEntityTypeAndTechnologyId(@Param("entityType") EntityType entityType,
                                                           @Param("technologyId") Long technologyId);

}
