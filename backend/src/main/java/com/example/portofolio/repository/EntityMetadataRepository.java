package com.example.portofolio.repository;

import com.example.portofolio.entity.EntityMetadata;
import com.example.portofolio.entity.enums.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EntityMetadataRepository extends JpaRepository<EntityMetadata, Long> {

    // Basic queries
    Optional<EntityMetadata> findByEntityTypeAndEntityId(EntityType entityType, Long entityId);


}