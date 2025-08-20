package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * The main entity - the person
 */
@Entity
@Table(name = "personal", indexes = {
        @Index(name = "idx_personal_name", columnList = "first_name, last_name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
public class Personal extends BaseEntity {

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    private Integer age;

    @Column(name = "image_link", length = 500)
    private String imageLink;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Relationships
    @OneToMany(mappedBy = "personal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Skill> skills = new HashSet<>();

    @OneToMany(mappedBy = "personal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Project> projects = new HashSet<>();

    @OneToMany(mappedBy = "personal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Certificate> certificates = new HashSet<>();

    @OneToOne(mappedBy = "personal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ContactInfo contactInfo;
}
