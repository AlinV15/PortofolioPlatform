package com.example.portofolio.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CoreSkillDto {

    private String id;              // Skill.id.toString()
    private String name;            // Skill.name
    private Integer level;          // Skill.level
    private String proficiency;     // Skill.proficiency.toString().toLowerCase()
    private String experience;      // Skill.yearsOfExperience formatted ("2.5 years")
    private String color;           // EntityMetadata.primaryColor
    private List<String> tags;      // SkillTag.tagName list
    private Integer projects;       // Count din EntitySkill unde entityType = PROJECT
}