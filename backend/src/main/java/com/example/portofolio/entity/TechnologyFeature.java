package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * Features ale tehnologiilor
 */
@Entity
@Table(name = "technology_feature", indexes = {
        @Index(name = "idx_tech_feature_status", columnList = "technology_id, is_deprecated")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class TechnologyFeature extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technology_id", nullable = false)
    private Technology technology;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "version_introduced", length = 50)
    private String versionIntroduced;

    @Builder.Default
    @Column(name = "is_deprecated")
    private Boolean deprecated = false;
}