// ===== UNIVERSAL RELATIONSHIPS =====

package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import com.example.portofolio.entity.enums.EntityType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

/**
 * Relația universală între entități și skill-uri
 */
@Entity
@Table(name = "entity_skill",
        uniqueConstraints = @UniqueConstraint(name = "uk_entity_skill",
                columnNames = {"entity_type", "entity_id", "skill_id"}),
        indexes = {
                @Index(name = "idx_entity_skill_entity", columnList = "entity_type, entity_id"),
                @Index(name = "idx_entity_skill_proficiency", columnList = "skill_id, proficiency_level")
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true,onlyExplicitlyIncluded = true)
public class EntitySkill extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false, length = 20)
    private EntityType entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Min(1) @Max(100)
    @Builder.Default
    @Column(name = "proficiency_level")
    private Integer proficiencyLevel = 1;

    @Min(0) @Max(100)
    @Builder.Default
    @Column(name = "usage_percentage")
    private Integer usagePercentage = 0;

    @Builder.Default
    @Column(name = "is_primary")
    private Boolean primary = false;
}