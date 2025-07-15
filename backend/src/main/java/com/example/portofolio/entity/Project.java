package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import com.example.portofolio.entity.enums.ProjectStatus;
import com.example.portofolio.entity.enums.ComplexityLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Proiectele unei persoane
 */
@Entity
@Table(name = "project", indexes = {
        @Index(name = "idx_project_personal_status", columnList = "personal_id, status"),
        @Index(name = "idx_project_category_complexity", columnList = "category, complexity"),
        @Index(name = "idx_project_timeline", columnList = "year, completion_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Project extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "long_description", columnDefinition = "TEXT")
    private String longDescription;

    @Column(nullable = false, length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ComplexityLevel complexity;

    @Column(name = "demo_url", length = 500)
    private String demoUrl;

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    private Integer year;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    // Relationships
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<ProjectFeature> features = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<ProjectChallenge> challenges = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<ProjectImage> images = new HashSet<>();

    @OneToOne(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ProjectMetrics metrics;

    // Helper method pentru metadata
    public String getEntityType() {
        return "project";
    }
}