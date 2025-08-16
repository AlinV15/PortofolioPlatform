package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import com.example.portofolio.entity.enums.VolunteerType;
import com.example.portofolio.entity.enums.VolunteerStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Experiența de voluntariat
 */
@Entity
@Table(name = "volunteer_experience", indexes = {
        @Index(name = "idx_volunteer_personal_status", columnList = "personal_id, status"),
        @Index(name = "idx_volunteer_org_type", columnList = "organization, type"),
        @Index(name = "idx_volunteer_dates", columnList = "start_date, end_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true,onlyExplicitlyIncluded = true)
public class VolunteerExperience extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Column(nullable = false, length = 200)
    private String organization;

    @Column(nullable = false, length = 150)
    private String role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VolunteerType type;

    @Column(length = 150)
    private String location;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VolunteerStatus status;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "impact_description", columnDefinition = "TEXT")
    private String impactDescription;

    @Column(length = 300)
    private String website;

    @Column(name = "hours_per_week", precision = 4, scale = 1)
    private BigDecimal hoursPerWeek;

    @Column(name = "total_hours", precision = 8, scale = 1)
    private BigDecimal totalHours;

    // Relationships
    @OneToMany(mappedBy = "volunteerExperience", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<VolunteerResponsibility> responsibilities = new HashSet<>();

    // Helper method pentru metadata
    public String getEntityType() {
        return "volunteer";
    }
}