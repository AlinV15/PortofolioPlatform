package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import com.example.portofolio.entity.enums.HobbyCategory;
import com.example.portofolio.entity.enums.ActivityLevel;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;

/**
 * Hobby-urile unei persoane
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

    // Relationships
    @OneToMany(mappedBy = "interest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private HashSet<RecentDiscovery> recentDiscoveries = new HashSet<>();

    // Helper method pentru metadata
    public String getEntityType() {
        return "interest";
    }
}