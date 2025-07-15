package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import com.example.portofolio.entity.enums.ProficiencyLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Skill-urile unei persoane
 */
@Entity
@Table(name = "skill", indexes = {
        @Index(name = "idx_skill_personal_category", columnList = "personal_id, category_id"),
        @Index(name = "idx_skill_proficiency", columnList = "proficiency, level"),
        @Index(name = "idx_skill_status", columnList = "is_trending, is_learning")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Skill extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private SkillCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProficiencyLevel proficiency;

    @Min(1) @Max(100)
    @Builder.Default
    private Integer level = 1;

    @Column(name = "years_of_experience", precision = 4, scale = 1)
    @Builder.Default
    private BigDecimal yearsOfExperience = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "last_used_date")
    private LocalDate lastUsedDate;

    @Builder.Default
    @Column(name = "is_trending")
    private Boolean trending = false;

    @Builder.Default
    @Column(name = "has_certification")
    private Boolean hasCertification = false;

    @Builder.Default
    @Column(name = "is_learning")
    private Boolean learning = false;

    // Relationships
    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<SkillTag> tags = new HashSet<>();

    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<LearningProgress> learningProgress = new HashSet<>();

    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<EntitySkill> entitySkills = new HashSet<>();

    // Helper method pentru metadata
    public String getEntityType() {
        return "skill";
    }
}