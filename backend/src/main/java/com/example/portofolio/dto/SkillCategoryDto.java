package com.example.portofolio.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SkillCategoryDto {

    private String id;              // SkillCategory.id.toString()
    private String name;            // SkillCategory.name
    private Integer skillCount;     // Count de skills în categoria
    private Double avgLevel;        // Media level-urilor din skills
    private String color;           // EntityMetadata.primaryColor pentru categoria
    private String bgColor;         // EntityMetadata.secondaryColor
    private String icon;            // Icon.name din categoria
    private Integer trending;       // Count de skills cu trending = true
    private String description;     // SkillCategory.description
}