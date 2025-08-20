package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import com.example.portofolio.entity.enums.EntityType;
import com.example.portofolio.entity.enums.ProficiencyLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

/**
 * Universal relation between entities and technology class
 */
@Entity
@Table(name = "entity_technology",
        uniqueConstraints = @UniqueConstraint(name = "uk_entity_technology",
                columnNames = {"entity_type", "entity_id", "technology_id"}),
        indexes = {
                @Index(name = "idx_entity_tech_entity", columnList = "entity_type, entity_id"),
                @Index(name = "idx_entity_tech_proficiency", columnList = "technology_id, proficiency")
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true,onlyExplicitlyIncluded = true)
public class EntityTechnology extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false, length = 20)
    private EntityType entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technology_id", nullable = false)
    private Technology technology;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProficiencyLevel proficiency;

    @Min(0) @Max(100)
    @Builder.Default
    @Column(name = "usage_percentage")
    private Integer usagePercentage = 0;

    @Builder.Default
    @Column(name = "is_primary")
    private Boolean primary = false;
}