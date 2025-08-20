package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Project features
 */
@Entity
@Table(name = "project_feature", indexes = {
        @Index(name = "idx_project_feature_order", columnList = "project_id, sort_order")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true,onlyExplicitlyIncluded = true)
public class ProjectFeature extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "implementation_date")
    private LocalDate implementationDate;

    @Column(name = "development_time_hours", precision = 8, scale = 2)
    private BigDecimal developmentTimeHours;

    @Builder.Default
    @Column(name = "sort_order")
    private Integer sortOrder = 0;
}