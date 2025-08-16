package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import com.example.portofolio.entity.enums.InterestCategory;
import com.example.portofolio.entity.enums.IntensityLevel;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Interesele unei persoane
 */
@Entity
@Table(name = "interest", indexes = {
        @Index(name = "idx_interest_personal_category", columnList = "personal_id, category"),
        @Index(name = "idx_interest_intensity_category", columnList = "intensity, category")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true,onlyExplicitlyIncluded = true)
public class Interest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InterestCategory category;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private IntensityLevel intensity = IntensityLevel.MODERATE;

    @Column(name = "why_interested", columnDefinition = "TEXT")
    private String whyInterested;

    // Relationships
    @OneToMany(mappedBy = "interest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<RecentDiscovery> recentDiscoveries = new HashSet<>();

    // Helper method pentru metadata
    public String getEntityType() {
        return "interest";
    }
}