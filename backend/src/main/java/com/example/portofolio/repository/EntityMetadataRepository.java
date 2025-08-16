package com.example.portofolio.repository;

import com.example.portofolio.entity.EntityMetadata;
import com.example.portofolio.entity.enums.EntityType;
import com.example.portofolio.entity.enums.ImportanceLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface EntityMetadataRepository extends JpaRepository<EntityMetadata, Long> {

    // Basic queries
    Optional<EntityMetadata> findByEntityTypeAndEntityId(EntityType entityType, Long entityId);

    List<EntityMetadata> findByEntityType(EntityType entityType);

    List<EntityMetadata> findByEntityTypeAndEntityIdIn(EntityType entityType, List<Long> entityIds);

    // Featured queries
    List<EntityMetadata> findByEntityTypeAndFeaturedTrue(EntityType entityType);

    List<EntityMetadata> findByFeaturedTrueOrderByImportanceDesc();

    @Query("SELECT em FROM EntityMetadata em " +
            "WHERE em.entityType = :entityType AND em.featured = true " +
            "ORDER BY em.importance DESC, em.updatedAt DESC")
    List<EntityMetadata> findFeaturedByEntityTypeOrderByImportance(@Param("entityType") EntityType entityType);

    // Importance queries
    List<EntityMetadata> findByEntityTypeAndImportance(EntityType entityType, ImportanceLevel importance);

    @Query("SELECT em FROM EntityMetadata em " +
            "WHERE em.entityType = :entityType " +
            "AND em.importance IN ('HIGH', 'MEDIUM') " +
            "ORDER BY em.importance DESC")
    List<EntityMetadata> findImportantByEntityType(@Param("entityType") EntityType entityType);

    // Bulk operations
    @Query("SELECT em FROM EntityMetadata em " +
            "WHERE em.entityType = :entityType AND em.entityId IN :entityIds")
    List<EntityMetadata> findByEntityTypeAndEntityIds(@Param("entityType") EntityType entityType,
                                                      @Param("entityIds") List<Long> entityIds);

    // Custom query pentru mapping în Service
    @Query("SELECT em.entityId, em FROM EntityMetadata em " +
            "WHERE em.entityType = :entityType AND em.entityId IN :entityIds")
    List<Object[]> findEntityIdAndMetadataByEntityTypeAndEntityIds(@Param("entityType") EntityType entityType,
                                                                   @Param("entityIds") List<Long> entityIds);

    // Statistics
    @Query("SELECT em.entityType, COUNT(em) FROM EntityMetadata em " +
            "WHERE em.featured = true " +
            "GROUP BY em.entityType")
    List<Object[]> countFeaturedByEntityType();

    @Query("SELECT COUNT(em) FROM EntityMetadata em " +
            "WHERE em.entityType = :entityType AND em.importance = :importance")
    Long countByEntityTypeAndImportance(@Param("entityType") EntityType entityType,
                                        @Param("importance") ImportanceLevel importance);

    // Cleanup operations
    @Modifying
    @Query("DELETE FROM EntityMetadata em " +
            "WHERE em.entityType = :entityType AND em.entityId = :entityId")
    void deleteByEntityTypeAndEntityId(@Param("entityType") EntityType entityType,
                                       @Param("entityId") Long entityId);

    @Modifying
    @Query("DELETE FROM EntityMetadata em " +
            "WHERE em.entityType = :entityType AND em.entityId IN :entityIds")
    void deleteByEntityTypeAndEntityIdIn(@Param("entityType") EntityType entityType,
                                         @Param("entityIds") List<Long> entityIds);

    // Check existence
    boolean existsByEntityTypeAndEntityId(EntityType entityType, Long entityId);

    @Query("SELECT COUNT(em) > 0 FROM EntityMetadata em " +
            "WHERE em.entityType = :entityType AND em.entityId = :entityId AND em.featured = true")
    boolean isEntityFeatured(@Param("entityType") EntityType entityType,
                             @Param("entityId") Long entityId);


}