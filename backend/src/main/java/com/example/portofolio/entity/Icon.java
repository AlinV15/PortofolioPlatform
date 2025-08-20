package com.example.portofolio.entity;

import com.example.portofolio.entity.base.BaseEntity;
import com.example.portofolio.entity.enums.IconType;
import jakarta.persistence.*;
import lombok.*;

/**
 * Centralized system of icons
 */
@Entity
@Table(name = "icon", indexes = {
        @Index(name = "idx_icon_type_category", columnList = "type, category")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true,onlyExplicitlyIncluded = true)
public class Icon extends BaseEntity {

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IconType type;

    @Column(length = 50)
    private String category;

    @Column(name = "svg_content", columnDefinition = "TEXT")
    private String svgContent;
}
