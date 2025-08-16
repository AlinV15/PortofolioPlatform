package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import com.example.portofolio.entity.enums.LearningStatus;
import jakarta.persistence.*;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Progresul în învățare pentru skill-uri
 */
@Entity
@Table(name = "learning_progress", indexes = {
        @Index(name = "idx_learning_progress_skill_status", columnList = "skill_id, status"),
        @Index(name = "idx_learning_progress_dates", columnList = "start_date, completion_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true,onlyExplicitlyIncluded = true)
public class LearningProgress extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false, length = 200)
    private String name;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LearningStatus status = LearningStatus.NOT_STARTED;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "completion_date")
    private LocalDateTime completionDate;

    @Min(0) @Max(100)
    @Builder.Default
    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;

    @Builder.Default
    @Column(name = "time_spent_hours", precision = 8, scale = 2)
    private BigDecimal timeSpentHours = BigDecimal.ZERO;

    @Column(name = "estimated_completion", length = 100)
    private String estimatedCompletion;

    @Column(columnDefinition = "TEXT")
    private String description;
}