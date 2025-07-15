package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

/**
 * Legătura între cursuri și proiecte
 */
@Entity
@Table(name = "course_project", indexes = {
        @Index(name = "idx_course_project_unique", columnList = "course_id, project_id", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class CourseProject extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(length = 10)
    private String grade;

    @Min(0) @Max(100)
    @Builder.Default
    @Column(name = "contribution_percentage")
    private Integer contributionPercentage = 100;
}
