package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * Informații de contact
 */
@Entity
@Table(name = "contact_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class ContactInfo extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Column(unique = true, length = 150)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String github;

    @Column(length = 100)
    private String linkedin;

    @Column(length = 200)
    private String website;

    @OneToOne(mappedBy = "contactInfo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ContactLocation contactLocation;
}