package com.example.portofolio.repository;

import com.example.portofolio.entity.EntitySkill;
import com.example.portofolio.entity.enums.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntitySkillRepository extends JpaRepository<EntitySkill, Long> {

    List<EntitySkill> findByEntityTypeAndEntityId(EntityType entityType, Long entityId);

    @Query("SELECT es FROM EntitySkill es " +
            "LEFT JOIN FETCH es.skill " +
            "WHERE es.entityType = :entityType AND es.entityId = :entityId")
    List<EntitySkill> findByEntityTypeAndEntityIdWithSkill(@Param("entityType") EntityType entityType,
                                                           @Param("entityId") Long entityId);

    Integer countByEntityTypeAndSkillId(EntityType entityType, Long skillId);

    @Query(value = "SELECT p.title FROM entity_skill es " +
            "JOIN project p ON p.id = es.entity_id " +
            "WHERE es.entity_type = 'PROJECT' AND es.skill_id = :skillId",
            nativeQuery = true)
    List<String> findProjectNamesBySkillId(@Param("skillId") Long skillId);
}
