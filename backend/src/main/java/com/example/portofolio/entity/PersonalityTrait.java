package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import com.example.portofolio.entity.enums.StrengthLevel;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Trăsăturile de personalitate
 */
@Entity
@Table(name = "personality_trait", indexes = {
        @Index(name = "idx_personality_personal_strength", columnList = "personal_id, strength_level")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class PersonalityTrait extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Column(nullable = false, length = 100)
    private String trait;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "strength_level", length = 20)
    private StrengthLevel strengthLevel = StrengthLevel.MODERATE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "icon_id")
    private Icon icon;

    // Relationships
    @OneToMany(mappedBy = "trait", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<PersonalityExample> examples = new HashSet<>();
}