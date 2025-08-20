package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import com.example.portofolio.entity.enums.ComplexityLevel;
import com.example.portofolio.entity.enums.HobbyCategory;
import com.example.portofolio.entity.enums.ActivityLevel;
import com.example.portofolio.entity.enums.ImpactLevel;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

/**
 * Hobbies of a person
 */
@Entity
@Table(name = "hobby", indexes = {
        @Index(name = "idx_hobby_personal_category", columnList = "personal_id, category"),
        @Index(name = "idx_hobby_activity", columnList = "activity_level, years_active")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Hobby extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Column(name = "why_interested", columnDefinition = "TEXT")
    private String whyInterested;

    @Column(name = "name", columnDefinition = "TEXT")
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // Use:
    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private HobbyCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_level")
    private ActivityLevel activityLevel;

    @Column(name = "years_active")
    private Long yearsActive;

    @Enumerated(EnumType.STRING)
    @Column(name = "complexity_level")
    private ComplexityLevel complexityLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "impact_on_work")
    private ImpactLevel impactOnWork;

    @Column(name = "favorite_aspect", columnDefinition = "TEXT")
    private String favoriteAspect;

    // Relationships
    @OneToMany(mappedBy = "hobby", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<RecentDiscovery> recentDiscoveries;


    // Helper method for metadata
    public String getEntityType() {
        return "interest";
    }
}