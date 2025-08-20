package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import com.example.portofolio.entity.enums.AchievementType;
import com.example.portofolio.entity.enums.EntityType;
import com.example.portofolio.entity.enums.RecognitionLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Achievements class
 */
@Entity
@Table(name = "achievement", indexes = {
        @Index(name = "idx_achievement_personal_type", columnList = "personal_id, achievement_type"),
        @Index(name = "idx_achievement_date_level", columnList = "achievement_date, recognition_level"),
        @Index(name = "idx_achievement_entity", columnList = "entity_type, entity_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true,onlyExplicitlyIncluded = true)
public class Achievement extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "education_id")
    private Education education;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "achievement_type", nullable = false, length = 20)
    private AchievementType achievementType;

    @Column(name = "achievement_date", nullable = false)
    private LocalDate achievementDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", length = 20)
    private EntityType entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "recognition_level", length = 20)
    private RecognitionLevel recognitionLevel = RecognitionLevel.LOCAL;

    @Column(name = "award_body", length = 200)
    private String awardBody;

    @Column(name = "certificate_url", length = 500)
    private String certificateUrl;
}
