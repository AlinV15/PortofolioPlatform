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
public class SkillDto {

    private String id;                  // Skill.id.toString()
    private String name;                // Skill.name
    private Integer level;              // Skill.level (0-100)
    private String proficiency;         // Skill.proficiency.toString().toLowerCase()
    private String description;         // Skill.description
    private Double yearsOfExperience;   // Skill.yearsOfExperience.doubleValue()
    private Integer projects;           // Count din EntitySkill pentru PROJECT
    private String icon;                // Icon.name din EntityMetadata
    private String color;               // EntityMetadata.primaryColor
    private String category;            // Mapped din SkillCategory.name la enum string
}